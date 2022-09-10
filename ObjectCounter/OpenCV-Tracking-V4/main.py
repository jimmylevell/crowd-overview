import sys
import settings

from producer import check_tf_cuda, check_cv2_cuda, download_weights, run

settings.init()

# Check if we have a GPU support TF
if check_tf_cuda():
    print("TensorFlow GPU is available")
else:
    print("TensorFlow GPU is NOT available")
    sys.exit(1)

# Check if we have a GPU support OpenCV
if check_cv2_cuda():
    print("CV2 GPU is available")
else:
    print("CV2 GPU is NOT available")
    sys.exit(1)

# check if weights are downloaded
download_weights()

# check if weights have been converted
from convert import convert
convert()
convert(tiny=True, weights="weights/yolov3-tiny.weights", output="weights/yolov3-tiny.tf")

run(use_video_file=True, video_file_path="data/video/los_angeles.mp4", roi_selection=True)
