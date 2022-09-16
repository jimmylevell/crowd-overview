import settings
from consumer import ConsumerThread
from producer import ProducerThread


def main():
    settings.init()
    ProducerThread(use_video_file=True).start()
    ConsumerThread().start()


if __name__ == "__main__":
    main()
