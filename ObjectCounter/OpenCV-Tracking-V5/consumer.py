import threading
import settings
import requests
import traceback
import datetime


class ConsumerThread(threading.Thread):
    def __init__(self):
        super(ConsumerThread, self).__init__()

        self.objects_detected = 0

        self.header = {"Authorization": "Bearer " + settings.auth_token}

    def run(self):
        global queue

        while True:
            settings.condition.acquire()
            if not settings.queue:
                print("Info: Nothing in queue, consumer will wait.")
                settings.condition.wait()
                print(
                    "Info: Producer added something to queue - consumer will stop waiting."
                )

            data = settings.queue.pop(0)
            if data is settings._sentinel:
                break
            self.process(data)

            settings.condition.release()

    def process(self, data):
        data = data[0]
        if len(data) > 0:
            for obj in data:
                id = int(obj[4])
                if self.objects_detected < (id + 1):
                    self.objects_detected += 1

                    print(obj)

                    print("Info: Object {} detected.".format(id))
                    self.post_data(
                        id=id,
                        object_class=int(obj[5]),
                        confidence_score=obj[8],
                        direction=obj[7],
                        measured_at=datetime.datetime.utcfromtimestamp(obj[6]),
                    )

    def post_data(self, id, object_class, confidence_score, direction, measured_at):
        data = {
            "measurements": [
                {
                    "object_class": str(object_class),
                    "confidence_score": str(confidence_score),
                    "direction": str(direction),
                    "measured_at": str(measured_at),
                }
            ]
        }

        try:
            response = requests.post(
                settings.backend_url + "/" + settings.checkpoint_id,
                json=data,
                headers=self.header,
            )

            if response.status_code != 200:
                print("Error: {}".format(response.text))
                raise Exception("Error: {}".format(response.text))
        except Exception:
            traceback.print_exc()
