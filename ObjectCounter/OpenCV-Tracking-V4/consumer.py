import threading
import settings

class ConsumerThread(threading.Thread):
    def __init__(self):
        super(ConsumerThread, self).__init__()

        self.objects_detected = 0

    def run(self):
        global queue

        while True:
            settings.condition.acquire()
            if not settings.queue:
                print("Info: Nothing in queue, consumer will wait.")
                settings.condition.wait()
                print("Info: Producer added something to queue - consumer will stop waiting.")

            data = settings.queue.pop(0)
            if data is settings._sentinel:
                break
            self.process(data)

            settings.condition.release()

    def process(self, data):
        if any(data) and len(data) > 0:
            data.sort(key=lambda x: x.id)

            for obj in data:
                if self.objects_detected < (obj.id + 1):
                    self.objects_detected += 1

                    print("Info: Object {} detected.".format(obj.id))
