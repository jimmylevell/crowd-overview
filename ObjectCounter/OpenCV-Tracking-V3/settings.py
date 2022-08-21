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
