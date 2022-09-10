class Detection:
    def __init__(self, class_id, score, box):
        self.class_id = class_id
        self.score = score
        self.box = box

        self.x = ""
        self.y = ""
        self.w = ""
        self.h = ""
        self.id = ""
        self.direction = 0
        self.detections = 0

    def __str__(self):
        return "Object ID: {}, Class ID: {}, Score: {}, Direction: {}, Detections: {}".format(self.id, self.class_id, format(self.score,".2f"), format(self.direction,".2f"), self.detections)

    def __repr__(self):
        return str(self)

    def get_short_description(self):
        return "ID: {}, Class: {}, Score: {}, Direction: {}, Detections: {}".format(self.id, self.class_id, format(self.score,".2f"), format(self.direction,".2f"), self.detections)
