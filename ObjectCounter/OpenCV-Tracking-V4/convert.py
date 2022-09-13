import sys
import os
from absl import flags
from absl.flags import FLAGS
import numpy as np
from yolov3_tf2.models import YoloV3, YoloV3Tiny
from yolov3_tf2.utils import load_darknet_weights

# convert yolov3 weights to tensorflow model
def convert(
    tiny=False,
    num_classes=80,
    weights="weights/yolov3.weights",
    output="weights/yolov3.tf",
):
    # reset flags
    for name in ["weights", "output", "tiny", "num_classes"]:
        if name in flags.FLAGS:
            delattr(flags.FLAGS, name)

    # flags must be defined globally for tensorflow to see them
    flags.DEFINE_string("weights", weights, "path to weights file")
    flags.DEFINE_string("output", output, "path to output")
    flags.DEFINE_boolean("tiny", tiny, "yolov3 or yolov3-tiny")
    flags.DEFINE_integer("num_classes", num_classes, "number of classes in the model")

    FLAGS = flags.FLAGS
    FLAGS(sys.argv[:1])

    if FLAGS.tiny:
        if not os.path.exists("weights/yolov3-tiny.tf.index"):
            yolo = YoloV3Tiny(classes=FLAGS.num_classes)
        else:
            print("weights/yolov3-tiny.tf.index already exists")
            return
    else:
        if not os.path.exists("weights/yolov3.tf.index"):
            yolo = YoloV3(classes=FLAGS.num_classes)
        else:
            print("weights/yolov3.tf.index already exists")
            return

    # load model
    yolo.summary()
    print("model created")

    load_darknet_weights(yolo, FLAGS.weights, FLAGS.tiny)
    print("weights loaded")

    img = np.random.random((1, 320, 320, 3)).astype(np.float32)
    data = yolo(img)
    print("sanity check passed")

    # convert
    yolo.save_weights(FLAGS.output)
    print("weights saved")
