import sys
import settings
from pathlib import Path

from consumer import ConsumerThread
from producer import ProducerThread


def main():
    settings.init()
    ProducerThread(
        source="..\\..\\Simulator\\API\\output\\demo\\251",  # "los_angeles.mp4"
        # show_vid=True,
    ).start()
    ConsumerThread().start()


if __name__ == "__main__":
    main()
