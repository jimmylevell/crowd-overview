# OpenCV Tracking using a Deep Learning Approach

## Pre-Requirements
- Tensorflow with CUDA support
- OpenCV with CUDA support

## Setup
Activate the virtual env using the following commands.
```bash
%conda env create -f conda-gpu.yml
%conda activate opencv-tracking-v1
```

Furthermore OpenCV must be compiled with CUDA support. This can be done by following the instructions on the [Pre-Requisites Read Me](../_Prerequisite_OpenCV_CUDA/Readme.md).

All configurations for the app can be made within the [settings.py](settings.py) file.

## Components
### Detection using a Deep Machine Learning Approach - YOLOv3
[Readme](../OpenCV-Tracking-V3/Readme.md)

## Tracking using a Deep Machine Learning Approach - DeepSORT
Applies Kalman Filtering and Hungarian method to handle motion predictions and data association
improves the matching procedures and reduces the number of identity switches by adding visual appearance descriptor or appearance features
Obtains higher accuracy with the use of
- motion measurement
- appearance features

## Usage

## Results
![OpenCV Tracking v4](../../Documentation/OpenCV4.gif)

## Evaluation

## Conclusion

## Issues
https://github.com/pjreddie/darknet/issues/80

## References
[1] https://github.com/emasterclassacademy/Single-Multiple-Custom-Object-Detection-and-Tracking
