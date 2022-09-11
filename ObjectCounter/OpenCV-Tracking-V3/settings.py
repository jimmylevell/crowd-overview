import threading

def init():
    global queue
    queue = []

    global condition
    condition = threading.Condition()

    global _sentinel
    _sentinel = object()

    global weight_urls
    weight_urls = "https://download.app.levell.ch/crowdmanager/yolov4.weights"

    global max_distance
    max_distance = 25

    global confidence_threshold
    confidence_threshold = 0.5

    global repetitions_threshold
    repetitions_threshold = 5
