import math
import settings

from detection import Detection

settings.init()


class EuclideanDistTracker:
    def __init__(self):
        self.detections = {}

        # Keep the count of the IDs
        # each time a new object id detected, the count will increase by one
        self.id_count = 0

    def get_angle(self, p1, p2):
        x1, y1 = p1
        x2, y2 = p2
        return math.atan2(y2 - y1, x2 - x1)

    def get_direction(self, center_points):
        # Get the last two center points
        p1 = center_points[-1]
        p2 = center_points[-2]

        # Calculate the direction
        direction = self.get_angle(p1, p2)
        return direction

    def reset_detection_status(self):
        for detection in self.detections.values():
            detection.matched = False

    def add_detection(self, new_detections):
        for new_detection in new_detections:
            self.detections[new_detection.id] = new_detection

    def remove_old_detections(self):
        unmatched_detections = [
            detection for detection in self.detections.values() if not detection.matched
        ]
        for unmatched_detection in unmatched_detections:
            del self.detections[unmatched_detection.id]

    # receives detections
    def update(self, new_detections):
        newly_detected = []

        self.reset_detection_status()

        for new_detection in new_detections:
            for detection in self.detections.values():
                distance = detection.get_distance(
                    new_detection.get_cx(), new_detection.get_cy()
                )

                if distance < settings.max_distance:
                    detection.x = new_detection.x
                    detection.y = new_detection.y
                    detection.w = new_detection.w
                    detection.h = new_detection.h
                    detection.matched = True

                    detection.detections += 1

                    new_detection.matched = True
                    break

            if not new_detection.matched:
                self.id_count += 1
                new_detection.id = self.id_count
                newly_detected.append(new_detection)

        self.remove_old_detections()
        self.add_detection(newly_detected)

        return self.detections.values()
