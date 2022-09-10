import sys
import settings

from producer import run, check_cv2_cuda, check_torch_cuda

settings.init()

# Check if we have a GPU support TF
if check_torch_cuda():
    print("Torch GPU is available")
else:
    print("Torch GPU is NOT available")
    sys.exit(1)

# Check if we have a GPU support OpenCV
if check_cv2_cuda():
    print("CV2 GPU is available")
else:
    print("CV2 GPU is NOT available")
    sys.exit(1)

run(source=0)
