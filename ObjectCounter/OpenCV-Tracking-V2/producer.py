import cv2
import sys
import settings
from tracker import EuclideanDistTracker

def get_region_of_interest_selection(frame):
    # Extract Region of interest ROI
    roi_coordinates = cv2.selectROI(frame, False)
    cv2.destroyAllWindows()
    print("Region of interest: ", roi_coordinates)
    return roi_coordinates

def run(use_web_cam=False, cam_index=0, use_video_file=False, video_file_path="los_angeles.mp4", roi_selection=True):
    # Create tracker object
    tracker = EuclideanDistTracker()

    if use_web_cam:
        cap = cv2.VideoCapture(cam_index)
    elif use_video_file:
        cap = cv2.VideoCapture(video_file_path)
    else:
        print("Error: No video source selected.")
        sys.exit(1)

    # Read first frame
    ok, frame = cap.read()
    if not ok:
        print ('Cannot read video file')
        sys.exit()

    # Extract Region of interest ROI
    if roi_selection:
        roi_coordinates = get_region_of_interest_selection(frame)
    else:
        roi_coordinates = (0, frame.shape[2], frame.shape[1], frame.shape[0])
        print("Default Region of interest: ", roi_coordinates)

    # Object detection from Stable camera, extract the moving objects from the stable camera¨
    # the longer the history the more stable the object detection is
    # the higher the value less detection, but also less false positives
    object_detector = cv2.createBackgroundSubtractorMOG2(history=settings.history, varThreshold=settings.varThreshold)

    while True:
        ret, frame = cap.read()
        height, width, _ = frame.shape

        # 1. Object Detection
        roi = frame[int(roi_coordinates[1]):int(roi_coordinates[1] + roi_coordinates[3]), int(roi_coordinates[0]):int(roi_coordinates[0] + roi_coordinates[2])]
        cv2.rectangle(frame, (roi_coordinates[0], roi_coordinates[1]), (roi_coordinates[0] + roi_coordinates[2], roi_coordinates[1] + roi_coordinates[3]), (255, 0, 0), 2)
        mask = object_detector.apply(roi)

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
                detections.append([x, y, w, h])

        # 2. Object Tracking
        boxes_ids = tracker.update(detections)
        for box_id in boxes_ids:
            x, y, w, h, id, direction = box_id
            cv2.putText(roi, str(id) + " " + format(direction,".2f"), (x, y - 15), cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 0), 2)
            cv2.rectangle(roi, (x, y), (x + w, y + h), (0, 255, 0), 3)

        cv2.imshow("roi", roi)
        cv2.imshow("Frame", frame)
        cv2.imshow("Mask", mask)

        key = cv2.waitKey(30)
        if key == 27:
            break

    cap.release()
    cv2.destroyAllWindows()
