import cv2
import settings

from pathlib import Path

from tracker import EuclideanDistTracker
from detection import Detection

settings.init()

FILE = Path(__file__).resolve()
ROOT = FILE.parents[0]


def init_file(name):
    return open(ROOT / "runs" / "tracks" / "exp7" / "data" / name, "w")


def mot_output(detections, file, frame_idx):
    for detection in detections:
        # frame_idx + 1, id, bbox_left, bbox_top, bbox_w, bbox_h, -1, -1, -1, i
        mot_metric = (
            str(frame_idx),
            str(detection.id),
            str(int(detection.x)),
            str(int(detection.y)),
            str(int(detection.w)),
            str(int(detection.h)),
            str(-1),
            str(-1),
            str(-1),
            str(0),
        )
        print(mot_metric)
        file.write(" ".join(mot_metric) + "\n")
        file.flush()


def run(files=[], name="", object_class=0):
    file = init_file(name + ".txt")

    # Create tracker object
    tracker = EuclideanDistTracker()
    object_detector = cv2.createBackgroundSubtractorMOG2(
        history=settings.history, varThreshold=settings.varThreshold
    )

    for img in files:
        frame_idx = int(img.name.split(".")[0])
        img = cv2.imread(str(img))

        mask = object_detector.apply(img)

        # remove noise from the mask
        _, mask = cv2.threshold(mask, settings.noise_threshold, 255, cv2.THRESH_BINARY)

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
        detections = tracker.update(detections)
        for detection in detections:
            id = detection.id
            direction = detection.direction
            x = detection.x
            y = detection.y
            w = detection.w
            h = detection.h

            cv2.putText(
                img,
                str(id) + " " + format(direction, ".2f"),
                (x, y - 15),
                cv2.FONT_HERSHEY_PLAIN,
                2,
                (255, 0, 0),
                2,
            )
            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 3)

        mot_output(detections=detections, file=file, frame_idx=frame_idx)

        cv2.imshow("Frame", img)

        key = cv2.waitKey(30)
        if key == 27:
            break

    cv2.destroyAllWindows()
