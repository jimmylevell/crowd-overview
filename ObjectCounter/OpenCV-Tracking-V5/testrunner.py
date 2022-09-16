import argparse
import sys
import os
from pathlib import Path

from tracker import run

FILE = Path(__file__).resolve()
ROOT = FILE.parents[0]  # yolov5 strongsort root directory
WEIGHTS = ROOT / "weights"

if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))  # add ROOT to PATH
if str(ROOT / "yolov5") not in sys.path:
    sys.path.append(str(ROOT / "yolov5"))  # add yolov5 ROOT to PATH
if str(ROOT / "strong_sort") not in sys.path:
    sys.path.append(str(ROOT / "strong_sort"))  # add strong_sort ROOT to PATH
ROOT = Path(os.path.relpath(ROOT, Path.cwd()))  # relative


def parse_opt():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--yolo-weights",
        nargs="+",
        type=Path,
        default=WEIGHTS / "yolov5m.pt",
        help="model.pt path(s)",
    )
    parser.add_argument(
        "--strong-sort-weights", type=Path, default=WEIGHTS / "osnet_x0_25_msmt17.pt"
    )
    parser.add_argument(
        "--config-strongsort", type=str, default="strong_sort/configs/strong_sort.yaml"
    )
    parser.add_argument(
        "--source", type=str, default="0", help="file/dir/URL/glob, 0 for webcam"
    )
    parser.add_argument(
        "--imgsz",
        "--img",
        "--img-size",
        nargs="+",
        type=int,
        default=[640],
        help="inference size h,w",
    )
    parser.add_argument(
        "--conf-thres", type=float, default=0.5, help="confidence threshold"
    )
    parser.add_argument(
        "--iou-thres", type=float, default=0.5, help="NMS IoU threshold"
    )
    parser.add_argument(
        "--max-det", type=int, default=1000, help="maximum detections per image"
    )
    parser.add_argument(
        "--device", default="", help="cuda device, i.e. 0 or 0,1,2,3 or cpu"
    )
    parser.add_argument(
        "--show-vid", action="store_true", help="display tracking video results"
    )
    parser.add_argument("--save-txt", action="store_true", help="save results to *.txt")
    parser.add_argument(
        "--save-conf", action="store_true", help="save confidences in --save-txt labels"
    )
    parser.add_argument(
        "--save-crop", action="store_true", help="save cropped prediction boxes"
    )
    parser.add_argument(
        "--save-vid", action="store_true", help="save video tracking results"
    )
    parser.add_argument(
        "--nosave", action="store_true", help="do not save images/videos"
    )
    # class 0 is person, 1 is bycicle, 2 is car... 79 is oven
    parser.add_argument(
        "--classes",
        nargs="+",
        type=int,
        help="filter by class: --classes 0, or --classes 0 2 3",
    )
    parser.add_argument(
        "--agnostic-nms", action="store_true", help="class-agnostic NMS"
    )
    parser.add_argument("--augment", action="store_true", help="augmented inference")
    parser.add_argument("--visualize", action="store_true", help="visualize features")
    parser.add_argument("--update", action="store_true", help="update all models")
    parser.add_argument(
        "--project", default=ROOT / "runs/track", help="save results to project/name"
    )
    parser.add_argument("--name", default="exp", help="save results to project/name")
    parser.add_argument(
        "--exist-ok",
        action="store_true",
        help="existing project/name ok, do not increment",
    )
    parser.add_argument(
        "--line-thickness", default=3, type=int, help="bounding box thickness (pixels)"
    )
    parser.add_argument(
        "--hide-labels", default=False, action="store_true", help="hide labels"
    )
    parser.add_argument(
        "--hide-conf", default=False, action="store_true", help="hide confidences"
    )
    parser.add_argument(
        "--hide-class", default=False, action="store_true", help="hide IDs"
    )
    parser.add_argument(
        "--half", action="store_true", help="use FP16 half-precision inference"
    )
    parser.add_argument(
        "--dnn", action="store_true", help="use OpenCV DNN for ONNX inference"
    )
    parser.add_argument("--eval", action="store_true", help="run evaluation")
    opt = parser.parse_args()
    opt.imgsz *= 2 if len(opt.imgsz) == 1 else 1  # expand

    return opt


def main(opt):
    run(**vars(opt))


if __name__ == "__main__":
    opt = parse_opt()
    main(opt)
