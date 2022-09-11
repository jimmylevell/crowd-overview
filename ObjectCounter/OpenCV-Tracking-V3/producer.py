import threading
import cv2
import re
import sys
import os

from object_detection import ObjectDetection
from tracker import EuclideanDistTracker
import settings

BASE_DIR = os.path.dirname(os.path.realpath(__file__))

class ProducerThread(threading.Thread):
    def __init__(self, use_web_cam=False, cam_index=0, use_video_file=False, video_file_path="los_angeles.mp4"):
        super(ProducerThread, self).__init__()

        self.objectdetection = ObjectDetection()

        if use_web_cam:
            self.video = cv2.VideoCapture(cam_index)

        if use_video_file:
            video_file_path = os.path.join(BASE_DIR, video_file_path)
            self.video = cv2.VideoCapture(video_file_path)

        self.tracker = EuclideanDistTracker()

        self.check_cuda_present()
        self.check_video_present()
        self.get_region_of_interest_selection()

    def add_to_queue(self, data):
        settings.condition.acquire()
        settings.queue.append(data)
        settings.condition.notify()
        settings.condition.release()

    def check_video_present(self):
        ok, self.frame = self.video.read()
        if not ok:
            print ('Cannot read video file')
            sys.exit()

    def check_cuda_present(self):
        cv_info = [re.sub('\s+', ' ', ci.strip()) for ci in cv2.getBuildInformation().strip().split('\n')
                    if len(ci) > 0 and re.search(r'(nvidia*:?)|(cuda*:)|(cudnn*:)', ci.lower()) is not None]

        if len(cv_info) > 0:
            print('\n'.join(cv_info))
            print('\n')
        else:
            print('No CUDA/OpenCV GPU found')
            print('\n')

    def get_region_of_interest_selection(self):
        # Extract Region of interest ROI
        self.roi_coordinates = cv2.selectROI(self.frame, False)
        cv2.destroyAllWindows()
        print("Region of interest: ", self.roi_coordinates)

    def get_region_of_interest(self):
        return self.frame[int(self.roi_coordinates[1]):int(self.roi_coordinates[1] + self.roi_coordinates[3]), int(self.roi_coordinates[0]):int(self.roi_coordinates[0] + self.roi_coordinates[2])]

    def visualize_object_tracking(self, detections):
        for detection in detections:
            cv2.putText(self.roi, detection.get_short_description(), (detection.x, detection.y - 15), cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 0), 2)
            cv2.rectangle(self.roi, (detection.x, detection.y), (detection.x + detection.w, detection.y + detection.h), (0, 255, 0), 3)

    def filter_detections(self, detections):
        return [detection for detection in detections if detection.score > settings.confidence_threshold and detection.detections > settings.repetitions_threshold]

    def run(self):
        while True:
            _, self.frame = self.video.read()
            self.roi = self.get_region_of_interest()
            detections = self.objectdetection.detect(self.roi)
            detections = self.tracker.update(detections)
            detections = self.filter_detections(detections)

            self.visualize_object_tracking(detections)
            # https://www.geeksforgeeks.org/python-opencv-selectroi-function/
            # https://www.geeksforgeeks.org/python-opencv-cv2-rectangle-method/
            cv2.rectangle(self.frame, (self.roi_coordinates[0], self.roi_coordinates[1]), (self.roi_coordinates[0] + self.roi_coordinates[2], self.roi_coordinates[1] + self.roi_coordinates[3]), (255, 0, 0), 2)
            self.add_to_queue(detections)

            cv2.imshow("roi", self.roi)
            cv2.imshow("Frame", self.frame)

            key = cv2.waitKey(5)
            if key == 27:
                self.add_to_queue(settings._sentinel)
                break

        self.video.release()
        cv2.destroyAllWindows()
