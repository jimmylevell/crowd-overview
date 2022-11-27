import threading


def init():
    global setup_direction
    setup_direction = "x"  # x or y

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

    global auth_token
    auth_token = "btoYflJ9nzrX2U43RSwDcsWUI"

    global backend_url
    backend_url = "http://localhost:3000/api/checkpoint/measurement/"

    global checkpoint_id
    checkpoint_id = "6378e250b9439142c57e66b2"

    global yolo_weights
    yolo_weights = "yolov5m.pt"

    global tracking_method
    tracking_method = "strongsort"

    global imgsz
    imgsz = (640, 640)

    global conf_thres
    conf_thres = 0.25

    global iou_thres
    iou_thres = 0.45

    global detectable_classes
    detectable_classes = ("1 2 3 4 6 8",)  # COCO classes which should be detected
