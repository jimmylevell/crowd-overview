import threading


def init():
    global queue
    queue = []

    global condition
    condition = threading.Condition()

    global _sentinel
    _sentinel = object()

    global weight_urls
    weight_urls = "https://download.app.levell.ch/crowdmanager/yolov3.weights"

    global tiny_weight_urls
    tiny_weight_urls = "https://download.app.levell.ch/crowdmanager/yolov3-tiny.weights"

    global max_cosine_distance
    max_cosine_distance = 0.5

    global nn_budget
    nn_budget = None

    global nms_max_overlap
    nms_max_overlap = 0.8

    global output_video
    output_video = False

    global input_size
    input_size = 416  # 288

    global tiny
    tiny = False
