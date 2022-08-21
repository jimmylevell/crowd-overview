import math

from detection import Detection

class EuclideanDistTracker:
    def __init__(self):
        # Store the center positions of the objects
        self.center_points = {}

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

    # receives detections
    def update(self, detections):
        # Objects boxes and ids
        objects_bbs_ids = []

        # Get center point of new object
        for detection in detections:
            x, y, w, h = detection.box
            cx = (x + x + w) // 2
            cy = (y + y + h) // 2

            # Find out if that object was detected already
            same_object_detected = False
            for id, pts in self.center_points.items():
                pt = pts[-1]
                dist = math.hypot(cx - pt[0], cy - pt[1])

                if dist < 25:
                    self.center_points[id].append((cx, cy))
                    objects_bbs_ids.append([x, y, w, h, id])

                    # update detection object
                    detection.direction = self.get_direction(self.center_points[id])
                    detection.x = x
                    detection.y = y
                    detection.w = w
                    detection.h = h
                    detection.id = id
                    detection.detections = len(self.center_points[id])

                    same_object_detected = True
                    break

            # New object is detected we assign the ID to that object
            if same_object_detected is False:
                detection.x = x
                detection.y = y
                detection.w = w
                detection.h = h
                detection.id = self.id_count

                self.center_points[self.id_count] = [(cx, cy)]
                objects_bbs_ids.append([x, y, w, h, self.id_count])
                self.id_count += 1

        # Clean the dictionary by center points to remove IDS not used anymore
        new_center_points = {}
        for obj_bb_id in objects_bbs_ids:
            _, _, _, _, object_id = obj_bb_id
            center = self.center_points[object_id]
            new_center_points[object_id] = center

        # Update dictionary with IDs not used removed
        self.center_points = new_center_points.copy()

        return detections
