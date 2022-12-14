import threading
import settings
import requests
import traceback


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
        if any(data) and len(data) > 0:
            for obj in data:
                if self.objects_detected < (obj.track_id + 1):
                    self.objects_detected += 1

                    print("Info: Object {} detected.".format(obj.track_id))
                    self.post_data(
                        id=obj.track_id,
                        object_class=obj.class_name,
                        confidence_score=obj.get_confidence_score(),
                        direction="",
                        measured_at=obj.measured_at,
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
