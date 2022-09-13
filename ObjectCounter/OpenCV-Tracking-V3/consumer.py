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
            data.sort(key=lambda x: x.id)

            for obj in data:
                if self.objects_detected < (obj.id + 1):
                    self.objects_detected += 1

                    print("Info: Object {} detected.".format(obj.id))
                    self.post_data(
                        id=obj.id,
                        object_class=obj.class_id,
                        confidence_score=obj.score,
                        direction=obj.direction,
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
            requests.post(
                settings.backend_url + "/" + settings.checkpoint_id,
                json=data,
                headers=self.header,
            )
        except Exception:
            traceback.print_exc()
