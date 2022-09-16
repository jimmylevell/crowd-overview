import sys
import settings

from consumer import ConsumerThread
from producer import ProducerThread


def main():
    settings.init()
    ProducerThread(source="los_angeles.mp4", show_vid=True).start()
    ConsumerThread().start()


if __name__ == "__main__":
    main()
