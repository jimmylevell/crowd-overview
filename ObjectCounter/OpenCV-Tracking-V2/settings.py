import threading

def init():
    global history
    history = 100

    global varThreshold
    varThreshold = 40

    global noise_threshold
    noise_threshold = 254

    global euclidean_dist_threshold
    euclidean_dist_threshold = 25

    global min_area
    min_area = 100
