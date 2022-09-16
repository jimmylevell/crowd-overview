import threading


def init():
    global queue
    queue = []

    global condition
    condition = threading.Condition()

    global _sentinel
    _sentinel = object()

    global history
    history = 150

    global varThreshold
    varThreshold = 50

    global noise_threshold
    noise_threshold = 254

    global min_area
    min_area = 400

    global max_distance
    max_distance = 50

    global auth_token
    auth_token = "api-key"

    global backend_url
    backend_url = "http://localhost:3000/api/checkpoint/measurement/"

    global checkpoint_id
    checkpoint_id = "63230f4c8fa6bc13424a1c8c"
