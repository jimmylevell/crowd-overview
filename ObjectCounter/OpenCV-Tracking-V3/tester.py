import cv2

from pathlib import Path
from object_detection import ObjectDetection
from tracker import EuclideanDistTracker
import settings

settings.init()

FILE = Path(__file__).resolve()
ROOT = FILE.parents[0]

def visualize_object_tracking(img, detections):
    for detection in detections:
        cv2.putText(img, detection.get_short_description(), (detection.x, detection.y - 15), cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 0), 2)
        cv2.rectangle(img, (detection.x, detection.y), (detection.x + detection.w, detection.y + detection.h), (0, 255, 0), 3)

def filter_detections(detections):
    return [detection for detection in detections if detection.score > 0.5 and detection.detections > 5]

def init_file(name):
    return open(ROOT / 'runs' / 'tracks' / 'exp7' / 'data' / name, "w")

def mot_output(detections, class_id, file, frame_idx):
    for detection in detections:
        # print MOT metrics - only of desired class
        detection_class = int(detection.class_id)
        if detection_class == class_id:
            # frame_idx + 1, id, bbox_left, bbox_top, bbox_w, bbox_h, -1, -1, -1, i
            mot_metric = str(frame_idx), str(detection.id), str(int(detection.x)), str(int(detection.y)), str(int(detection.w)), str(int(detection.h)), str(-1), str(-1), str(-1), str(0)
            print(mot_metric)
            file.write(" ".join(mot_metric) + "\n")
            file.flush()

def run(files=[], name="", object_class=0):
    file = init_file(name + '.txt')

    objectdetection = ObjectDetection()
    tracker = EuclideanDistTracker()

    for img in files:
        frame_idx = int(img.name.split('.')[0])
        img = cv2.imread(str(img))

        detections = objectdetection.detect(img)
        detections = tracker.update(detections)
        detections = filter_detections(detections)

        visualize_object_tracking(img, detections)

        mot_output(detections=detections, class_id=object_class, file=file, frame_idx=frame_idx)

        cv2.imshow("Frame", img)

        key = cv2.waitKey(5)
        if key == 27:
            break

    cv2.destroyAllWindows()
