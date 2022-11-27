import sys
import settings
from pathlib import Path

from consumer import ConsumerThread
from producer import ProducerThread


def main():
    settings.init()
    ProducerThread(
        source="..\\..\\Simulator\\API\\output\\24",  # "los_angeles.mp4"
    ).start()
    ConsumerThread().start()


if __name__ == "__main__":
    main()
