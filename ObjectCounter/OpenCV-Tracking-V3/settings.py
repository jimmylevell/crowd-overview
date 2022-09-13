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

    global auth_token
    auth_token = "N57efeBgtG6wgHYa13H6OQRy+h0xdmqlcQBkTMiZR5A="

    global backend_url
    backend_url = "http://localhost:3000/api/checkpoint/measurement/"

    global checkpoint_id
    checkpoint_id = "6320668a0f885b62face06c5"
