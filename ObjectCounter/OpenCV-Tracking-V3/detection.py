import math

from datetime import datetime


class Detection:
    def __init__(self, class_id, score, box):
        self.class_id = class_id
        self.score = score
        self.box = box

        self.x = box[0]
        self.y = box[1]
        self.w = box[2]
        self.h = box[3]

        self.id = ""
        self.direction = 0
        self.detections = 0

        self.matched = False

        self.measured_at = datetime.now().strftime("%d.%m.%Y, %H:%M:%S")

    def __str__(self):
        return "Object ID: {}, Class ID: {}, Score: {}, Direction: {}, Detections: {}".format(
            self.id,
            self.class_id,
            format(self.score, ".2f"),
            format(self.direction, ".2f"),
            self.detections,
        )

    def __repr__(self):
        return str(self)

    def get_short_description(self):
        return "ID: {}, Class: {}, Score: {}, Direction: {}, Detections: {}".format(
            self.id,
            self.class_id,
            format(self.score, ".2f"),
            format(self.direction, ".2f"),
            self.detections,
        )

    def get_cx(self):
        return (self.x + self.x + self.w) // 2

    def get_cy(self):
        return (self.y + self.y + self.w) // 2

    def get_distance(self, cx, cy):
        return math.hypot(self.get_cx() - cx, self.get_cy() - cy)
