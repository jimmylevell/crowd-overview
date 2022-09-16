from absl import flags
import sys
import threading
import time
import numpy as np
import cv2
import re
import urllib.request
import os
import matplotlib.pyplot as plt
from _collections import deque
import tensorflow.compat.v1 as tf
from keras import backend as K

import settings

settings.init()

# Load the model
from yolov3_tf2.models import YoloV3, YoloV3Tiny
from yolov3_tf2.dataset import transform_images
from yolov3_tf2.utils import convert_boxes

from deep_sort import preprocessing
from deep_sort import nn_matching
from deep_sort.detection import Detection
from deep_sort.tracker import Tracker

from tools import generate_detections as gdet

from convert import convert

# apply non-max suppression to the bounding boxes
def run_non_maxima_suppression(detections, nms_max_overlap):
    boxs = np.array([d.tlwh for d in detections])
    scores = np.array([d.confidence for d in detections])
    classes = np.array([d.class_name for d in detections])

    # indices of the kept boxes, eliminated multi frame detections
    indices = preprocessing.non_max_suppression(boxs, classes, nms_max_overlap, scores)
    return [detections[i] for i in indices]


# align video to the model dimensions
def align_video_to_model(img, input_size):
    # convert color space from BGR to RGB because YOLOv3 was trained on RGB images
    img_in = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # expand the image to have a batch dimension
    img_in = tf.expand_dims(img_in, 0)

    # resize the image to the input size of the model, i.e. 416x416 pixels for YOLOv3
    img_in = transform_images(img_in, input_size)

    return img_in


class ProducerThread(threading.Thread):
    def __init__(
        self,
        use_web_cam=False,
        cam_index=0,
        use_video_file=False,
        video_file_path="./data/video/los_angeles.mp4",
        roi_selection=True,
    ):
        super(ProducerThread, self).__init__()

        # Enforce tensorflow v1
        tf.compat.v1.disable_v2_behavior()
        model_filename = (
            "model_data/mars-small128.pb"  # pre-trained model for pedestrian tracking
        )

        # Variable Section
        self.class_names = [
            c.strip() for c in open("./data/labels/coco.names").readlines()
        ]

        cmap = plt.get_cmap("tab20b")
        self.colors = [cmap(i)[:3] for i in np.linspace(0, 1, 20)]
        self.pts = [
            deque(maxlen=30) for _ in range(1000)
        ]  # 1000 is the maximum number of objects to be tracked, here we use 30 points to draw the trajectory

        self.counter = []

        # load video
        if use_web_cam:
            self.vid = cv2.VideoCapture(cam_index)
        elif use_video_file:
            self.vid = cv2.VideoCapture(video_file_path)
        else:
            print("Error: No video source selected.")
            sys.exit(1)

        self.frame = self.check_video_present(self.vid)

        if roi_selection:
            self.roi_coordinates = self.get_region_of_interest_selection(self.frame)
        else:
            self.roi_coordinates = (
                284,
                self.frame.shape[2],
                self.frame.shape[1],
                self.frame.shape[0],
            )
            print("Default Region of interest: ", self.roi_coordinates)

        self.out = self.get_output_video(self.vid)

        # initialaize encoder
        self.encoder = gdet.create_box_encoder(model_filename, batch_size=1)
        metric = nn_matching.NearestNeighborDistanceMetric(
            "cosine", settings.max_cosine_distance, settings.nn_budget
        )
        self.tracker = Tracker(metric)

        self.check_prerequisites()

    def check_prerequisites(self):
        # Check if we have a GPU support TF
        if self.check_tf_cuda():
            print("TensorFlow GPU is available")
        else:
            print("TensorFlow GPU is NOT available")
            sys.exit(1)

        # Check if we have a GPU support OpenCV
        if self.check_cv2_cuda():
            print("CV2 GPU is available")
        else:
            print("CV2 GPU is NOT available")
            sys.exit(1)

        # check if weights are downloaded
        self.download_weights()

        convert()
        convert(
            tiny=True,
            weights="weights/yolov3-tiny.weights",
            output="weights/yolov3-tiny.tf",
        )

    def check_tf_cuda(self):
        return len(tf.config.list_physical_devices("GPU")) > 0

    def check_cv2_cuda(self):
        cv_info = [
            re.sub("\s+", " ", ci.strip())
            for ci in cv2.getBuildInformation().strip().split("\n")
            if len(ci) > 0
            and re.search(r"(nvidia*:?)|(cuda*:)|(cudnn*:)", ci.lower()) is not None
        ]

        return len(cv_info) > 0

    def download_weights(self):
        # download weights of not present
        if not os.path.exists("weights/yolov3.weights"):
            print("Downloading weights...")
            urllib.request.urlretrieve(settings.weight_urls, "weights/yolov3.weights")
        else:
            print("Weights already downloaded")

        if not os.path.exists("weights/yolov3-tiny.weights"):
            print("Downloading tiny weights...")
            urllib.request.urlretrieve(
                settings.tiny_weight_urls, "weights/yolov3-tiny.weights"
            )
        else:
            print("Tiny Weights already downloaded")

    # checks if video is available
    def check_video_present(self, video):
        ok, frame = video.read()
        if not ok:
            print("Cannot read video file")
            sys.exit()
        return frame

    # create file for video output
    def get_output_video(self, vid):
        codec = cv2.VideoWriter_fourcc(*"XVID")  # avi format
        vid_fps = int(vid.get(cv2.CAP_PROP_FPS))
        vid_size = (
            int(vid.get(cv2.CAP_PROP_FRAME_WIDTH)),
            int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT)),
        )
        return cv2.VideoWriter("./data/video/output.avi", codec, vid_fps, vid_size)

    # read coco names based on IDs
    def get_class_coco_names(self, classes, class_names):
        names = []
        for i in range(len(classes)):
            names.append(class_names[int(classes[i])])
        return np.array(names)

    # get region of interest
    def get_region_of_interest_selection(self, frame):
        roi_coordinates = cv2.selectROI(frame, False)
        cv2.destroyAllWindows()
        print("Region of interest: ", roi_coordinates)

        return roi_coordinates

    def get_region_of_interest(self, frame, roi_coordinates):
        return frame[
            int(roi_coordinates[1]) : int(roi_coordinates[1] + roi_coordinates[3]),
            int(roi_coordinates[0]) : int(roi_coordinates[0] + roi_coordinates[2]),
        ]

    def add_to_queue(self, data):
        settings.condition.acquire()
        settings.queue.append(data)
        settings.condition.notify()
        settings.condition.release()

    def run(self):
        # Set the flags for the model
        FLAGS = flags.FLAGS
        FLAGS(sys.argv[:1])

        with tf.Graph().as_default():
            with tf.Session() as sess:
                K.set_session(sess)

                if settings.tiny:
                    yolo = YoloV3Tiny(classes=len(self.class_names))
                    yolo.load_weights("./weights/yolov3-tiny.tf")
                else:
                    yolo = YoloV3(
                        classes=len(self.class_names), size=settings.input_size
                    )
                    yolo.load_weights("./weights/yolov3.tf")

                while True:
                    _, img = self.vid.read()
                    if img is None:
                        print("Completed")
                        break

                    t1 = time.time()

                    roi = self.get_region_of_interest(img, self.roi_coordinates)
                    cv2.rectangle(
                        img,
                        (self.roi_coordinates[0], self.roi_coordinates[1]),
                        (
                            self.roi_coordinates[0] + self.roi_coordinates[2],
                            self.roi_coordinates[1] + self.roi_coordinates[3],
                        ),
                        (255, 0, 0),
                        2,
                    )
                    img_in = align_video_to_model(roi, settings.input_size)
                    print("Time required to align video from: " + str(time.time() - t1))

                    # object detection using YOLO
                    # boxes 3D shape: (1, 100, 4)
                    # scores 2D shape: (1, 100)
                    # classes 2D shape: (1, 100)
                    # nums 1D shape: (1,)
                    boxes, scores, classes, nums = yolo.predict(img_in, steps=1)
                    print("Time required to predict: " + str(time.time() - t1))
                    classes = classes[0]

                    # get the bounding boxes of detected objects
                    converted_boxes = convert_boxes(roi, boxes[0])

                    # get the feature vectors of the detected objects
                    features = self.encoder(roi, converted_boxes)
                    print("Time required to encode: " + str(time.time() - t1))

                    # initialize detections
                    detections = [
                        Detection(bbox, score, class_name, feature)
                        for bbox, score, class_name, feature in zip(
                            converted_boxes, scores[0], classes, features
                        )
                    ]
                    detections = run_non_maxima_suppression(
                        detections, settings.nms_max_overlap
                    )
                    print(
                        "Time required to run non maxima suppression: "
                        + str(time.time() - t1)
                    )

                    # execute kalman filter
                    self.tracker.predict()
                    self.tracker.update(detections)
                    print(
                        "Time required for tracker to update: " + str(time.time() - t1)
                    )

                    current_count = int(0)
                    for track in self.tracker.tracks:
                        # if kalman has no update, skip
                        if not track.is_confirmed() or track.time_since_update > 1:
                            continue

                        bbox = track.to_tlbr()
                        class_name = self.class_names[int(track.get_class())]
                        color = self.colors[
                            int(track.get_class()) % len(self.colors)
                        ]  # color of the bounding box
                        color = [i * 255 for i in color]  # convert to RGB

                        # draw bounding box
                        cv2.rectangle(
                            roi,
                            (int(bbox[0]), int(bbox[1])),
                            (int(bbox[2]), int(bbox[3])),
                            color,
                            2,
                        )

                        # draw label with class name and track id
                        cv2.rectangle(
                            roi,
                            (int(bbox[0]), int(bbox[1] - 30)),
                            (
                                int(bbox[0])
                                + (len(class_name) + len(str(track.track_id))) * 17,
                                int(bbox[1]),
                            ),
                            color,
                            -1,
                        )
                        cv2.putText(
                            roi,
                            class_name + "-" + str(track.track_id),
                            (int(bbox[0]), int(bbox[1] - 10)),
                            0,
                            0.75,
                            (255, 255, 255),
                            2,
                        )

                        # draw trajectory
                        center = (
                            int(((bbox[0]) + (bbox[2])) / 2),
                            int(((bbox[1]) + (bbox[3])) / 2),
                        )
                        self.pts[track.track_id].append(center)

                        for j in range(1, len(self.pts[track.track_id])):
                            # if we do not have enough points to draw a line, skip
                            if (
                                self.pts[track.track_id][j] is None
                                or self.pts[track.track_id][j - 1] is None
                            ):
                                continue

                            thickness = int(
                                np.sqrt(64 / float(j + 1)) * 2
                            )  # thickness of the line is inversely proportional to the number of points
                            cv2.line(
                                roi,
                                (self.pts[track.track_id][j - 1]),
                                (self.pts[track.track_id][j]),
                                color,
                                thickness,
                            )

                        # count the number of objects in the ROI
                        height, width, _ = img.shape
                        cv2.line(
                            roi,
                            (0, int(3 * height / 6 + height / 20)),
                            (width, int(3 * height / 6 + height / 20)),
                            (0, 255, 0),
                            thickness=2,
                        )
                        cv2.line(
                            roi,
                            (0, int(3 * height / 6 - height / 20)),
                            (width, int(3 * height / 6 - height / 20)),
                            (0, 255, 0),
                            thickness=2,
                        )

                        center_y = int(((bbox[1]) + (bbox[3])) / 2)
                        if center_y <= int(
                            3 * height / 6 + height / 20
                        ) and center_y >= int(3 * height / 6 - height / 20):
                            if class_name == "car" or class_name == "truck":
                                self.counter.append(int(self.track.track_id))
                                current_count += 1

                    # update consumer
                    self.add_to_queue(self.tracker.tracks)

                    print(
                        "Time required to draw results for each track: "
                        + str(time.time() - t1)
                    )

                    total_count = len(set(self.counter))
                    cv2.putText(
                        img,
                        "Current Vehicle Count: " + str(current_count),
                        (0, 80),
                        0,
                        1,
                        (0, 0, 255),
                        2,
                    )
                    cv2.putText(
                        img,
                        "Total Vehicle Count: " + str(total_count),
                        (0, 130),
                        0,
                        1,
                        (0, 0, 255),
                        2,
                    )

                    # draw FPS
                    fps = 1.0 / (time.time() - t1)
                    cv2.putText(
                        img, "FPS: {:.2f}".format(fps), (0, 30), 0, 1, (0, 0, 255), 2
                    )

                    cv2.imshow("output", img)

                    if settings.output_video:
                        self.out.write(img)

                    key = cv2.waitKey(1)
                    if key == 27:
                        self.add_to_queue(settings._sentinel)
                        break

                self.vid.release()
                self.out.release()
                cv2.destroyAllWindows()
