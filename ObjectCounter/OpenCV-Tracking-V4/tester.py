from absl import flags
import sys
import numpy as np
import cv2
import matplotlib.pyplot as plt
import tensorflow.compat.v1 as tf
from keras import backend as K
from pathlib import Path

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
from producer import run_non_maxima_suppression, align_video_to_model

FILE = Path(__file__).resolve()
ROOT = FILE.parents[0]

def init_file(name):
    return open(ROOT / 'runs' / 'tracks' / 'exp7' / 'data' / name, "w")

def run(files=[], name="", object_class=0):
    # Set the flags for the model
    FLAGS = flags.FLAGS
    FLAGS(sys.argv[:1])

    # Enforce tensorflow v1
    tf.compat.v1.disable_v2_behavior()

    # CONFIG
    input_size = settings.input_size
    max_cosine_distance = settings.max_cosine_distance       # is it the same object?
    nn_budget = settings.nn_budget                # number of features to be stored in the memory
    nms_max_overlap = settings.nms_max_overlap           # non-maxima suppression, i.e. removes all boxes with a lower score than the max box
    model_filename = 'model_data/mars-small128.pb'          # pre-trained model for pedestrian tracking

    # Variable Section
    class_names = [c.strip() for c in open('./data/labels/coco.names').readlines()]
    cmap = plt.get_cmap('tab20b')
    colors = [cmap(i)[:3] for i in np.linspace(0,1,20)]

    # initialaize encoder
    encoder = gdet.create_box_encoder(model_filename, batch_size=1)
    metric = nn_matching.NearestNeighborDistanceMetric('cosine', max_cosine_distance, nn_budget)
    tracker = Tracker(metric)

    file = init_file(name + '.txt')

    with tf.Graph().as_default():
        with tf.Session() as sess:
            K.set_session(sess)

            if settings.tiny:
                yolo = YoloV3Tiny(classes=len(class_names))
                yolo.load_weights('./weights/yolov3-tiny.tf')
            else:
                yolo = YoloV3(classes=len(class_names), size=input_size)
                yolo.load_weights('./weights/yolov3.tf')

            for img in files:
                frame_idx = int(img.name.split('.')[0])
                img = cv2.imread(str(img))

                img_in = align_video_to_model(img, input_size)
                boxes, scores, classes, nums = yolo.predict(img_in, steps=1)
                classes = classes[0]
                converted_boxes = convert_boxes(img, boxes[0])
                features = encoder(img, converted_boxes)

                # initialize detections
                detections = [Detection(bbox, score, class_name, feature) for bbox, score, class_name, feature in zip(converted_boxes, scores[0], classes, features)]
                detections = run_non_maxima_suppression(detections, nms_max_overlap)

                # execute kalman filter
                tracker.predict()
                tracker.update(detections)

                for track in tracker.tracks:
                    # if kalman has no update, skip
                    if not track.is_confirmed() or track.time_since_update >1:
                        continue

                    bbox = track.to_tlbr()
                    class_name= class_names[int(track.get_class())]
                    color = colors[int(track.get_class()) % len(colors)]            # color of the bounding box
                    color = [i * 255 for i in color]                                # convert to RGB

                    # draw bounding box
                    cv2.rectangle(img, (int(bbox[0]),int(bbox[1])), (int(bbox[2]),int(bbox[3])), color, 2)

                    # draw label with class name and track id
                    cv2.rectangle(img, (int(bbox[0]), int(bbox[1]-30)), (int(bbox[0])+(len(class_name) + len(str(track.track_id))) * 17, int(bbox[1])), color, -1)
                    cv2.putText(img, class_name + "-" + str(track.track_id), (int(bbox[0]), int(bbox[1] - 10)), 0, 0.75,(255, 255, 255), 2)

                    # print MOT metrics - only of desired class
                    bbox = track.to_tlwh()
                    detection_class = int(track.get_class())
                    if detection_class == object_class:
                        # frame_idx + 1, id, bbox_left, bbox_top, bbox_w, bbox_h, -1, -1, -1, i
                        mot_metric = str(frame_idx), str(track.track_id), str(int(bbox[0])), str(int(bbox[1])), str(int(bbox[2])), str(int(bbox[3])), str(-1), str(-1), str(-1), str(0)
                        print(mot_metric)
                        file.write(" ".join(mot_metric) + "\n")
                        file.flush()

                cv2.imshow('output', img)

                key = cv2.waitKey(1)
                if key == 27:
                    break

            cv2.destroyAllWindows()
            file.close()
