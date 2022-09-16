import threading
import cv2
import sys
import settings

from tracker import EuclideanDistTracker
from detection import Detection


class ProducerThread(threading.Thread):
    def __init__(
        self,
        use_web_cam=False,
        cam_index=0,
        use_video_file=False,
        video_file_path="highway.mp4",
        roi_selection=True,
    ):
        super(ProducerThread, self).__init__()

        # Create tracker object
        self.tracker = EuclideanDistTracker()

        if use_web_cam:
            self.cap = cv2.VideoCapture(cam_index)
        elif use_video_file:
            self.cap = cv2.VideoCapture(video_file_path)
        else:
            print("Error: No video source selected.")
            sys.exit(1)

        # Read first frame
        ok, frame = self.cap.read()
        if not ok:
            print("Cannot read video file")
            sys.exit()

        # Extract Region of interest ROI
        if roi_selection:
            self.roi_coordinates = self.get_region_of_interest_selection(frame)
        else:
            self.roi_coordinates = (0, frame.shape[2], frame.shape[1], frame.shape[0])
            print("Default Region of interest: ", self.roi_coordinates)

        # Object detection from Stable camera, extract the moving objects from the stable camera¨
        # the longer the history the more stable the object detection is
        # the higher the value less detection, but also less false positives
        self.object_detector = cv2.createBackgroundSubtractorMOG2(
            history=settings.history, varThreshold=settings.varThreshold
        )

    def add_to_queue(self, data):
        settings.condition.acquire()
        settings.queue.append(data)
        settings.condition.notify()
        settings.condition.release()

    def get_region_of_interest_selection(self, frame):
        # Extract Region of interest ROI
        self.roi_coordinates = cv2.selectROI(frame, False)
        cv2.destroyAllWindows()
        print("Region of interest: ", self.roi_coordinates)
        return self.roi_coordinates

    def run(self):
        while True:
            ret, frame = self.cap.read()
            height, width, _ = frame.shape

            # 1. Object Detection
            roi = frame[
                int(self.roi_coordinates[1]) : int(
                    self.roi_coordinates[1] + self.roi_coordinates[3]
                ),
                int(self.roi_coordinates[0]) : int(
                    self.roi_coordinates[0] + self.roi_coordinates[2]
                ),
            ]
            cv2.rectangle(
                frame,
                (self.roi_coordinates[0], self.roi_coordinates[1]),
                (
                    self.roi_coordinates[0] + self.roi_coordinates[2],
                    self.roi_coordinates[1] + self.roi_coordinates[3],
                ),
                (255, 0, 0),
                2,
            )
            mask = self.object_detector.apply(roi)

            # remove noise from the mask
            _, mask = cv2.threshold(
                mask, settings.noise_threshold, 255, cv2.THRESH_BINARY
            )

            # extract coordinates of moving objects
            contours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

            # collect all detections (bounding boxes)
            detections = []
            for cnt in contours:
                # Calculate area and remove small elements
                area = cv2.contourArea(cnt)
                if area > settings.min_area:
                    x, y, w, h = cv2.boundingRect(cnt)
                    detections.append(Detection("", "", (x, y, w, h)))

            # 2. Object Tracking
            detections = self.tracker.update(detections)
            for detection in detections:
                id = detection.id
                direction = detection.direction
                x = detection.x
                y = detection.y
                w = detection.w
                h = detection.h

                cv2.putText(
                    roi,
                    str(id) + " " + format(direction, ".2f"),
                    (x, y - 15),
                    cv2.FONT_HERSHEY_PLAIN,
                    2,
                    (255, 0, 0),
                    2,
                )
                cv2.rectangle(roi, (x, y), (x + w, y + h), (0, 255, 0), 3)

            # update consumer
            self.add_to_queue(detections)

            cv2.imshow("roi", roi)
            cv2.imshow("Frame", frame)
            cv2.imshow("Mask", mask)

            key = cv2.waitKey(30)
            if key == 27:
                self.add_to_queue(settings._sentinel)
                break

        self.cap.release()
        cv2.destroyAllWindows()
