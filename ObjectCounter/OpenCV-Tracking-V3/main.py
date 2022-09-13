import os

import settings
from consumer import ConsumerThread
from producer import ProducerThread

# Based on: https://pysource.com/2021/10/05/object-tracking-from-scratch-opencv-and-python/
# Using YOLOv4 for object detection and Euclidian Distance for tracking.


def main():
    settings.init()
    download_weights_if_required()

    ProducerThread(use_video_file=True).start()
    ConsumerThread().start()


def download_weights_if_required():
    BASE_DIR = os.path.dirname(os.path.realpath(__file__))
    path = os.path.join(BASE_DIR, "dnn_model\yolov4.weights")

    if not os.path.exists(path):
        import wget

        wget.download(settings.weight_urls, out=path)


if __name__ == "__main__":
    main()
