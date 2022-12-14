import argparse
import threading
import os
import sys
from pathlib import Path
import torch
import torch.backends.cudnn as cudnn
import re


def check_torch_cuda():
    return torch.cuda.is_available()


def check_cv2_cuda():
    cv_info = [
        re.sub("\s+", " ", ci.strip())
        for ci in cv2.getBuildInformation().strip().split("\n")
        if len(ci) > 0
        and re.search(r"(nvidia*:?)|(cuda*:)|(cudnn*:)", ci.lower()) is not None
    ]

    return len(cv_info) > 0


def init():
    # limit the number of cpus used by high performance libraries
    os.environ["OMP_NUM_THREADS"] = "1"
    os.environ["OPENBLAS_NUM_THREADS"] = "1"
    os.environ["MKL_NUM_THREADS"] = "1"
    os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
    os.environ["NUMEXPR_NUM_THREADS"] = "1"

    if str(ROOT) not in sys.path:
        sys.path.append(str(ROOT))  # add ROOT to PATH
    if str(ROOT / "yolov5") not in sys.path:
        sys.path.append(str(ROOT / "yolov5"))  # add yolov5 ROOT to PATH
    if str(ROOT / "trackers" / "strong_sort") not in sys.path:
        sys.path.append(
            str(ROOT / "trackers" / "strong_sort")
        )  # add strong_sort ROOT to PATH

    return Path(os.path.relpath(ROOT, Path.cwd()))  # relative


ROOT = Path(os.path.abspath("")).resolve()
WEIGHTS = ROOT / "weights"
init()

import settings
import logging
from yolov5.models.common import DetectMultiBackend
from yolov5.utils.dataloaders import VID_FORMATS, LoadImages, LoadStreams
from yolov5.utils.general import (
    LOGGER,
    check_img_size,
    non_max_suppression,
    scale_coords,
    cv2,
    check_imshow,
    xyxy2xywh,
    increment_path,
    strip_optimizer,
    colorstr,
    check_file,
)
from yolov5.utils.torch_utils import select_device, time_sync
from yolov5.utils.plots import Annotator, colors, save_one_box
from trackers.multi_tracker_zoo import create_tracker

settings.init()

# remove duplicated stream handler to avoid duplicated logging
logging.getLogger().removeHandler(logging.getLogger().handlers[0])


class ProducerThread(threading.Thread):
    def __init__(
        self,
        source="0",
        yolo_weights=WEIGHTS / settings.yolo_weights,  # model.pt path(s),
        reid_weights=WEIGHTS / "osnet_x0_25_msmt17.pt",  # model.pt path,
        config_strongsort=ROOT / "strong_sort/configs/strong_sort.yaml",
        tracking_method=settings.tracking_method,
        imgsz=settings.imgsz,  # inference size (height, width)
        conf_thres=settings.conf_thres,  # confidence threshold
        iou_thres=settings.iou_thres,  # NMS IOU threshold
        max_det=1000,  # maximum detections per image
        device="0",  # cuda device, i.e. 0 or 0,1,2,3 or cpu
        show_vid=False,  # show results
        save_txt=False,  # save results to *.txt
        save_conf=False,  # save confidences in --save-txt labels
        save_crop=False,  # save cropped prediction boxes
        save_vid=False,  # save confidences in --save-txt labels
        nosave=False,  # do not save images/videos
        classes=settings.detectable_classes,  # filter by class: --class 0, or --class 0 2 3
        agnostic_nms=False,  # class-agnostic NMS
        augment=False,  # augmented inference
        visualize=False,  # visualize features
        update=False,  # update all models
        project=ROOT / "runs/track",  # save results to project/name
        name="exp",  # save results to project/name
        exist_ok=False,  # existing project/name ok, do not increment
        line_thickness=2,  # bounding box thickness (pixels)
        hide_labels=False,  # hide labels
        hide_conf=False,  # hide confidences
        hide_class=False,  # hide IDs
        half=False,  # use FP16 half-precision inference
        dnn=False,  # use OpenCV DNN for ONNX inference
    ):
        super(ProducerThread, self).__init__()

        self.source = source
        self.yolo_weights = yolo_weights
        self.reid_weights = reid_weights
        self.config_strongsort = config_strongsort
        self.tracking_method = tracking_method
        self.imgsz = imgsz
        self.conf_thres = conf_thres
        self.iou_thres = iou_thres
        self.max_det = max_det
        self.device = device
        self.show_vid = show_vid
        self.save_txt = save_txt
        self.save_conf = save_conf
        self.save_crop = save_crop
        self.save_vid = save_vid
        self.nosave = nosave
        self.classes = classes
        self.agnostic_nms = agnostic_nms
        self.augment = augment
        self.visualize = visualize
        self.update = update
        self.project = project
        self.name = name
        self.exist_ok = exist_ok
        self.line_thickness = line_thickness
        self.hide_labels = hide_labels
        self.hide_conf = hide_conf
        self.hide_class = hide_class
        self.half = half
        self.dnn = dnn
        self.eval = eval

    def add_to_queue(self, data):
        settings.condition.acquire()
        settings.queue.append(data)
        settings.condition.notify()
        settings.condition.release()

    @torch.no_grad()
    def run(self):
        source = self.source
        yolo_weights = self.yolo_weights
        reid_weights = self.reid_weights
        config_strongsort = self.config_strongsort
        imgsz = self.imgsz
        tracking_method = self.tracking_method
        conf_thres = self.conf_thres
        iou_thres = self.iou_thres
        max_det = self.max_det
        device = self.device
        show_vid = self.show_vid
        save_txt = self.save_txt
        save_conf = self.save_conf
        save_crop = self.save_crop
        save_vid = self.save_vid
        nosave = self.nosave
        classes = self.classes
        agnostic_nms = self.agnostic_nms
        augment = self.augment
        visualize = self.visualize
        update = self.update
        project = self.project
        name = self.name
        exist_ok = self.exist_ok
        line_thickness = self.line_thickness
        hide_labels = self.hide_labels
        hide_conf = self.hide_conf
        hide_class = self.hide_class
        half = self.half
        dnn = self.dnn
        eval = self.eval

        source = str(source)
        save_img = not nosave and not source.endswith(".txt")  # save inference images
        is_file = Path(source).suffix[1:] in (VID_FORMATS)
        is_url = source.lower().startswith(
            ("rtsp://", "rtmp://", "http://", "https://")
        )
        webcam = (
            source.isnumeric() or source.endswith(".txt") or (is_url and not is_file)
        )
        if is_url and is_file:
            source = check_file(source)  # download

        # Directories
        if not isinstance(yolo_weights, list):  # single yolo model
            exp_name = yolo_weights.stem
        elif (
            type(yolo_weights) is list and len(yolo_weights) == 1
        ):  # single models after --yolo_weights
            exp_name = Path(yolo_weights[0]).stem
        else:  # multiple models after --yolo_weights
            exp_name = "ensemble"
        exp_name = name if name else exp_name + "_" + reid_weights.stem
        save_dir = increment_path(
            Path(project) / exp_name, exist_ok=exist_ok
        )  # increment run
        (save_dir / "tracks" if save_txt else save_dir).mkdir(
            parents=True, exist_ok=True
        )  # make dir

        # Load model
        device = select_device(device)
        model = DetectMultiBackend(
            yolo_weights, device=device, dnn=dnn, data=None, fp16=half
        )
        stride, names, pt = model.stride, model.names, model.pt
        imgsz = check_img_size(imgsz, s=stride)  # check image size

        # Dataloader
        if webcam:
            show_vid = check_imshow()
            cudnn.benchmark = True  # set True to speed up constant image size inference
            dataset = LoadStreams(source, img_size=imgsz, stride=stride, auto=pt)
            nr_sources = len(dataset)
        else:
            dataset = LoadImages(source, img_size=imgsz, stride=stride, auto=pt)
            nr_sources = 1
        vid_path, vid_writer, txt_path = (
            [None] * nr_sources,
            [None] * nr_sources,
            [None] * nr_sources,
        )

        # Create as many strong sort instances as there are video sources
        tracker_list = []
        for i in range(nr_sources):
            tracker = create_tracker(tracking_method, reid_weights, device, half)
            tracker_list.append(
                tracker,
            )
            if hasattr(tracker_list[i], "model"):
                if hasattr(tracker_list[i].model, "warmup"):
                    tracker_list[i].model.warmup()
        outputs = [None] * nr_sources

        # Run tracking
        # model.warmup(imgsz=(1 if pt else nr_sources, 3, *imgsz))  # warmup
        dt, seen = [0.0, 0.0, 0.0, 0.0], 0
        curr_frames, prev_frames = [None] * nr_sources, [None] * nr_sources
        for frame_idx, (path, im, im0s, vid_cap, s) in enumerate(dataset):
            t1 = time_sync()
            im = torch.from_numpy(im).to(device)
            im = im.half() if half else im.float()  # uint8 to fp16/32
            im /= 255.0  # 0 - 255 to 0.0 - 1.0
            if len(im.shape) == 3:
                im = im[None]  # expand for batch dim
            t2 = time_sync()
            dt[0] += t2 - t1

            # Inference
            visualize = (
                increment_path(save_dir / Path(path[0]).stem, mkdir=True)
                if visualize
                else False
            )
            pred = model(im, augment=augment, visualize=visualize)
            t3 = time_sync()
            dt[1] += t3 - t2

            # Apply none max suppression
            pred = non_max_suppression(
                pred, conf_thres, iou_thres, classes, agnostic_nms, max_det=max_det
            )
            dt[2] += time_sync() - t3

            # Process detections
            for i, det in enumerate(pred):  # detections per image
                seen += 1
                if webcam:  # nr_sources >= 1
                    p, im0, _ = path[i], im0s[i].copy(), dataset.count
                    p = Path(p)  # to Path
                    s += f"{i}: "
                    txt_file_name = p.name
                    save_path = str(save_dir / p.name)  # im.jpg, vid.mp4, ...
                else:
                    p, im0, _ = path, im0s.copy(), getattr(dataset, "frame", 0)
                    p = Path(p)  # to Path
                    # video file
                    if source.endswith(VID_FORMATS):
                        txt_file_name = p.stem
                        save_path = str(save_dir / p.name)  # im.jpg, vid.mp4, ...
                    # folder with imgs
                    else:
                        txt_file_name = (
                            p.parent.name
                        )  # get folder name containing current img
                        save_path = str(
                            save_dir / p.parent.name
                        )  # im.jpg, vid.mp4, ...
                curr_frames[i] = im0

                txt_path = str(save_dir / "tracks" / txt_file_name)  # im.txt
                s += "%gx%g " % im.shape[2:]  # print string
                imc = im0.copy() if save_crop else im0  # for save_crop

                annotator = Annotator(im0, line_width=line_thickness, pil=not ascii)

                if hasattr(tracker_list[i], "tracker") and hasattr(
                    tracker_list[i].tracker, "camera_update"
                ):
                    if (
                        prev_frames[i] is not None and curr_frames[i] is not None
                    ):  # camera motion compensation
                        tracker_list[i].tracker.camera_update(
                            prev_frames[i], curr_frames[i]
                        )

                if det is not None and len(det):
                    # Rescale boxes from img_size to im0 size
                    det[:, :4] = scale_coords(
                        im.shape[2:], det[:, :4], im0.shape
                    ).round()

                    # Print results
                    for c in det[:, -1].unique():
                        n = (det[:, -1] == c).sum()  # detections per class
                        s += f"{n} {names[int(c)]}{'s' * (n > 1)}, "  # add to string

                    # pass detections to strongsort
                    t4 = time_sync()
                    outputs[i] = tracker_list[i].update(det.cpu(), im0)
                    t5 = time_sync()
                    dt[3] += t5 - t4

                    # draw boxes for visualization
                    if len(outputs[i]) > 0:
                        for j, (output, conf) in enumerate(zip(outputs[i], det[:, 4])):

                            bboxes = output[0:4]
                            id = output[4]
                            cls = output[5]
                            measured_at = output[6]
                            direction = output[7]

                            if save_txt:
                                # to MOT format
                                bbox_left = output[0]
                                bbox_top = output[1]
                                bbox_w = output[2] - output[0]
                                bbox_h = output[3] - output[1]
                                # Write MOT compliant results to file
                                with open(txt_path + ".txt", "a") as f:
                                    f.write(
                                        ("%g " * 10 + "\n")
                                        % (
                                            frame_idx + 1,
                                            id,
                                            bbox_left,  # MOT format
                                            bbox_top,
                                            bbox_w,
                                            bbox_h,
                                            -1,
                                            -1,
                                            -1,
                                            i,
                                        )
                                    )

                            if save_vid or save_crop or show_vid:  # Add bbox to image
                                c = int(cls)  # integer class
                                id = int(id)  # integer id
                                label = (
                                    None
                                    if hide_labels
                                    else (
                                        f"{id} {names[c]}"
                                        if hide_conf
                                        else (
                                            f"{id} {conf:.2f}"
                                            if hide_class
                                            else f"{id} {names[c]} {conf:.2f} {direction}"
                                        )
                                    )
                                )
                                annotator.box_label(
                                    bboxes, label, color=colors(c, True)
                                )
                                if save_crop:
                                    txt_file_name = (
                                        txt_file_name
                                        if (isinstance(path, list) and len(path) > 1)
                                        else ""
                                    )
                                    save_one_box(
                                        bboxes,
                                        imc,
                                        file=save_dir
                                        / "crops"
                                        / txt_file_name
                                        / names[c]
                                        / f"{id}"
                                        / f"{p.stem}.jpg",
                                        BGR=True,
                                    )

                        # inform the queue that the task is done
                        self.add_to_queue(outputs)

                    LOGGER.info(
                        f"{s}Done. YOLO:({t3 - t2:.3f}s), {tracking_method}:({t5 - t4:.3f}s)"
                    )

                else:
                    # strongsort_list[i].increment_ages()
                    LOGGER.info("No detections")

                # Stream results
                im0 = annotator.result()
                if show_vid:
                    cv2.imshow(str(p), im0)
                    key = cv2.waitKey(1)
                    if key == 27:
                        self.add_to_queue(settings._sentinel)
                        break

                # Save results (image with detections)
                if save_vid:
                    if vid_path[i] != save_path:  # new video
                        vid_path[i] = save_path
                        if isinstance(vid_writer[i], cv2.VideoWriter):
                            vid_writer[i].release()  # release previous video writer
                        if vid_cap:  # video
                            fps = vid_cap.get(cv2.CAP_PROP_FPS)
                            w = int(vid_cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                            h = int(vid_cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                        else:  # stream
                            fps, w, h = 30, im0.shape[1], im0.shape[0]
                        save_path = str(
                            Path(save_path).with_suffix(".mp4")
                        )  # force *.mp4 suffix on results videos
                        vid_writer[i] = cv2.VideoWriter(
                            save_path, cv2.VideoWriter_fourcc(*"mp4v"), fps, (w, h)
                        )
                    vid_writer[i].write(im0)

                prev_frames[i] = curr_frames[i]

        # Print results
        t = tuple(x / seen * 1e3 for x in dt)  # speeds per image
        LOGGER.info(
            f"Speed: %.1fms pre-process, %.1fms inference, %.1fms NMS, %.1fms {tracking_method} update per image at shape {(1, 3, *imgsz)}"
            % t
        )
        if save_txt or save_vid:
            s = (
                f"\n{len(list(save_dir.glob('tracks/*.txt')))} tracks saved to {save_dir / 'tracks'}"
                if save_txt
                else ""
            )
            LOGGER.info(f"Results saved to {colorstr('bold', save_dir)}{s}")
        if update:
            strip_optimizer(yolo_weights)  # update model (to fix SourceChangeWarning)

        im0.release()
        cv2.destroyAllWindows()
