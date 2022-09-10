from absl import flags
import sys
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

def check_tf_cuda():
    return len(tf.config.list_physical_devices('GPU')) > 0

def check_cv2_cuda():
    cv_info = [re.sub('\s+', ' ', ci.strip()) for ci in cv2.getBuildInformation().strip().split('\n')
                if len(ci) > 0 and re.search(r'(nvidia*:?)|(cuda*:)|(cudnn*:)', ci.lower()) is not None]

    return len(cv_info) > 0

def download_weights():
    # download weights of not present
    if not os.path.exists("weights/yolov3.weights"):
        print("Downloading weights...")
        urllib.request.urlretrieve(settings.weight_urls, "weights/yolov3.weights")
    else:
        print("Weights already downloaded")

    if not os.path.exists("weights/yolov3-tiny.weights"):
        print("Downloading tiny weights...")
        urllib.request.urlretrieve(settings.tiny_weight_urls, "weights/yolov3-tiny.weights")
    else:
        print("Tiny Weights already downloaded")

# checks if video is available
def check_video_present(video):
    ok, frame = video.read()
    if not ok:
        print ('Cannot read video file')
        sys.exit()
    return frame

# create file for video output
def get_output_video(vid):
    codec = cv2.VideoWriter_fourcc(*'XVID') # avi format
    vid_fps = int(vid.get(cv2.CAP_PROP_FPS))
    vid_size = (int(vid.get(cv2.CAP_PROP_FRAME_WIDTH)), int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT)))
    return cv2.VideoWriter('./data/video/output.avi', codec, vid_fps, vid_size)

# align video to the model dimensions
def align_video_to_model(img, input_size):
    # convert color space from BGR to RGB because YOLOv3 was trained on RGB images
    img_in = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # expand the image to have a batch dimension
    img_in = tf.expand_dims(img_in, 0)

    # resize the image to the input size of the model, i.e. 416x416 pixels for YOLOv3
    img_in = transform_images(img_in, input_size)

    return img_in

# read coco names based on IDs
def get_class_coco_names(classes, class_names):
    names = []
    for i in range(len(classes)):
        names.append(class_names[int(classes[i])])
    return np.array(names)

# get region of interest
def get_region_of_interest_selection(frame):
    roi_coordinates = cv2.selectROI(frame, False)
    cv2.destroyAllWindows()
    print("Region of interest: ", roi_coordinates)

    return roi_coordinates

# apply non-max suppression to the bounding boxes
def run_non_maxima_suppression(detections, nms_max_overlap):
    boxs = np.array([d.tlwh for d in detections])
    scores = np.array([d.confidence for d in detections])
    classes = np.array([d.class_name for d in detections])

    # indices of the kept boxes, eliminated multi frame detections
    indices = preprocessing.non_max_suppression(boxs, classes, nms_max_overlap, scores)
    return [detections[i] for i in indices]

def get_region_of_interest(frame, roi_coordinates):
    return frame[int(roi_coordinates[1]):int(roi_coordinates[1] + roi_coordinates[3]), int(roi_coordinates[0]):int(roi_coordinates[0] + roi_coordinates[2])]

def run(use_web_cam=False, cam_index=0, use_video_file=False, video_file_path="los_angeles.mp4", roi_selection=True):
    # Set the flags for the model
    FLAGS = flags.FLAGS
    FLAGS(sys.argv[:1])

    # Enforce tensorflow v1
    tf.compat.v1.disable_v2_behavior()

    # CONFIG
    input_size = settings.input_size
    output_video = settings.output_video
    max_cosine_distance = settings.max_cosine_distance       # is it the same object?
    nn_budget = settings.nn_budget                # number of features to be stored in the memory
    nms_max_overlap = settings.nms_max_overlap           # non-maxima suppression, i.e. removes all boxes with a lower score than the max box
    model_filename = 'model_data/mars-small128.pb'          # pre-trained model for pedestrian tracking

    # Variable Section
    class_names = [c.strip() for c in open('./data/labels/coco.names').readlines()]
    cmap = plt.get_cmap('tab20b')
    colors = [cmap(i)[:3] for i in np.linspace(0,1,20)]
    pts = [deque(maxlen=30) for _ in range(1000)]       # 1000 is the maximum number of objects to be tracked, here we use 30 points to draw the trajectory
    counter = []

    # load video
    if use_web_cam:
        vid = cv2.VideoCapture(cam_index)
    elif use_video_file:
        vid = cv2.VideoCapture(video_file_path)
    else:
        print("Error: No video source selected.")
        sys.exit(1)

    frame = check_video_present(vid)

    if roi_selection:
        roi_coordinates = get_region_of_interest_selection(frame)
    else:
        roi_coordinates = (284, frame.shape[2], frame.shape[1], frame.shape[0])
        print("Default Region of interest: ", roi_coordinates)
    out = get_output_video(vid)

    # initialaize encoder
    encoder = gdet.create_box_encoder(model_filename, batch_size=1)
    metric = nn_matching.NearestNeighborDistanceMetric('cosine', max_cosine_distance, nn_budget)
    tracker = Tracker(metric)

    with tf.Graph().as_default():
        with tf.Session() as sess:
            K.set_session(sess)

            if settings.tiny:
                yolo = YoloV3Tiny(classes=len(class_names))
                yolo.load_weights('./weights/yolov3-tiny.tf')
            else:
                yolo = YoloV3(classes=len(class_names), size=input_size)
                yolo.load_weights('./weights/yolov3.tf')

            while True:
                _, img = vid.read()
                if img is None:
                    print('Completed')
                    break

                t1 = time.time()

                roi = get_region_of_interest(img, roi_coordinates)
                cv2.rectangle(img, (roi_coordinates[0], roi_coordinates[1]), (roi_coordinates[0] + roi_coordinates[2], roi_coordinates[1] + roi_coordinates[3]), (255, 0, 0), 2)
                img_in = align_video_to_model(roi, input_size)
                print("Time required to align video from: " + str(time.time()-t1))

                # object detection using YOLO
                # boxes 3D shape: (1, 100, 4)
                # scores 2D shape: (1, 100)
                # classes 2D shape: (1, 100)
                # nums 1D shape: (1,)
                boxes, scores, classes, nums = yolo.predict(img_in, steps=1)
                print("Time required to predict: " + str(time.time()-t1))
                classes = classes[0]

                # get the bounding boxes of detected objects
                converted_boxes = convert_boxes(roi, boxes[0])

                # get the feature vectors of the detected objects
                features = encoder(roi, converted_boxes)
                print("Time required to encode: " + str(time.time()-t1))

                # initialize detections
                detections = [Detection(bbox, score, class_name, feature) for bbox, score, class_name, feature in zip(converted_boxes, scores[0], classes, features)]
                detections = run_non_maxima_suppression(detections, nms_max_overlap)
                print("Time required to run non maxima suppression: " + str(time.time()-t1))

                # execute kalman filter
                tracker.predict()
                tracker.update(detections)
                print("Time required for tracker to update: " + str(time.time()-t1))

                current_count = int(0)
                for track in tracker.tracks:
                    # if kalman has no update, skip
                    if not track.is_confirmed() or track.time_since_update >1:
                        continue

                    bbox = track.to_tlbr()
                    class_name= class_names[int(track.get_class())]
                    color = colors[int(track.get_class()) % len(colors)]            # color of the bounding box
                    color = [i * 255 for i in color]                                # convert to RGB

                    # draw bounding box
                    cv2.rectangle(roi, (int(bbox[0]),int(bbox[1])), (int(bbox[2]),int(bbox[3])), color, 2)

                    # draw label with class name and track id
                    cv2.rectangle(roi, (int(bbox[0]), int(bbox[1]-30)), (int(bbox[0])+(len(class_name) + len(str(track.track_id))) * 17, int(bbox[1])), color, -1)
                    cv2.putText(roi, class_name + "-" + str(track.track_id), (int(bbox[0]), int(bbox[1] - 10)), 0, 0.75,(255, 255, 255), 2)

                    # draw trajectory
                    center = (int(((bbox[0]) + (bbox[2])) / 2), int(((bbox[1]) + (bbox[3])) / 2))
                    pts[track.track_id].append(center)

                    for j in range(1, len(pts[track.track_id])):
                        # if we do not have enough points to draw a line, skip
                        if pts[track.track_id][j] is None or  pts[track.track_id][j-1] is None:
                            continue

                        thickness = int(np.sqrt(64/float(j+1))*2)       # thickness of the line is inversely proportional to the number of points
                        cv2.line(roi, (pts[track.track_id][j-1]), (pts[track.track_id][j]), color, thickness)

                    # count the number of objects in the ROI
                    height, width, _ = img.shape
                    cv2.line(roi, (0, int(3*height/6+height/20)), (width, int(3*height/6+height/20)), (0, 255, 0), thickness=2)
                    cv2.line(roi, (0, int(3*height/6-height/20)), (width, int(3*height/6-height/20)), (0, 255, 0), thickness=2)

                    center_y = int(((bbox[1])+(bbox[3]))/2)
                    if center_y <= int(3*height/6+height/20) and center_y >= int(3*height/6-height/20):
                        if class_name == 'car' or class_name == 'truck':
                            counter.append(int(track.track_id))
                            current_count += 1

                print("Time required to draw results for each track: " + str(time.time()-t1))

                total_count = len(set(counter))
                cv2.putText(img, "Current Vehicle Count: " + str(current_count), (0, 80), 0, 1, (0, 0, 255), 2)
                cv2.putText(img, "Total Vehicle Count: " + str(total_count), (0,130), 0, 1, (0,0,255), 2)

                # draw FPS
                fps = 1./(time.time()-t1)
                cv2.putText(img, "FPS: {:.2f}".format(fps), (0,30), 0, 1, (0,0,255), 2)

                cv2.imshow('output', img)

                if output_video:
                    out.write(img)

                key = cv2.waitKey(1)
                if key == 27:
                    break

            vid.release()
            out.release()
            cv2.destroyAllWindows()
