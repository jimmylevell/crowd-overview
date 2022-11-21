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

Eval Config:
USE_PARALLEL : False
NUM_PARALLEL_CORES : 8
BREAK_ON_ERROR : True
RETURN_ON_ERROR : False
LOG_ON_ERROR : C:\Daten\git\crowd-overview\ObjectCounter\OpenCV-Tracking-V4\val_utils\error_log.txt
PRINT_RESULTS : True
PRINT_ONLY_COMBINED : False
PRINT_CONFIG : True
TIME_PROGRESS : True
DISPLAY_LESS_PROGRESS : False
OUTPUT_SUMMARY : True
OUTPUT_EMPTY_CLASSES : True
OUTPUT_DETAILED : True
PLOT_CURVES : True

MotChallenge2DBox Config:
PRINT_CONFIG : True
GT_FOLDER : C:\Daten\git\crowd-overview\ObjectCounter\OpenCV-Tracking-V4\val_utils\data/gt/mot_challenge/
TRACKERS_FOLDER : C:\Daten\git\crowd-overview\ObjectCounter\OpenCV-Tracking-V4\val_utils\data/trackers/mot_challenge/
OUTPUT_FOLDER : None
TRACKERS_TO_EVAL : ['C:\\Daten\\git\\crowd-overview\\ObjectCounter\\OpenCV-Tracking-V4\\runs\\tracks\\exp7']
CLASSES_TO_EVAL : ['pedestrian']
BENCHMARK : MOT16
SPLIT_TO_EVAL : train
INPUT_AS_ZIP : False
DO_PREPROC : True
TRACKER_SUB_FOLDER : data
OUTPUT_SUB_FOLDER :
TRACKER_DISPLAY_NAMES : None
SEQMAP_FOLDER : None
SEQMAP_FILE : None
SEQ_INFO : None
GT_LOC_FORMAT : {gt_folder}/{seq}/gt/gt.txt
SKIP_SPLIT_FOL : False

CLEAR Config:
METRICS : ['HOTA', 'CLEAR', 'Identity']
THRESHOLD : 0.5
PRINT_CONFIG : True

Identity Config:
METRICS : ['HOTA', 'CLEAR', 'Identity']
THRESHOLD : 0.5
PRINT_CONFIG : True

Evaluating 1 tracker(s) on 7 sequence(s) for 1 class(es) on MotChallenge2DBox dataset using the following metrics: HOTA, CLEAR, Identity, Count
Evaluating C:\Daten\git\crowd-overview\ObjectCounter\OpenCV-Tracking-V4\runs\tracks\exp7

All sequences for C:\Daten\git\crowd-overview\ObjectCounter\OpenCV-Tracking-V4\runs\tracks\exp7 finished in 7.01 seconds

HOTA: C:\Daten\git\crowd-overview\ObjectCounter\OpenCV-Tracking-V4\runs\tracks\exp7-pedestrianHOTA DetA AssA DetRe DetPr AssRe AssPr LocA RHOTA HOTA(0) LocA(0) HOTALocA(0)
MOT16-02 22.253 19.069 26.146 20.348 63.285 29.424 56.672 77.062 23.024 30.82 68.897 21.234
MOT16-04 33.844 29.369 39.847 31.285 69.314 44.027 65.071 77.807 35.077 46.307 70.144 32.481
MOT16-05 36.302 41.045 32.351 46.843 63.889 51.024 42.922 76.81 38.895 53.138 68.041 36.155
MOT16-09 31.792 43.524 23.43 47.669 71.354 36.917 43.375 79.617 33.375 43.968 72.133 31.716
MOT16-10 25.925 31.784 21.351 34.463 65.502 28.074 50.685 75.9 27.079 38.146 66.769 25.469
MOT16-11 37.213 46.516 29.968 50.577 74.549 43.717 52.783 81.363 38.898 48.907 75.135 36.746
MOT16-13 25.986 21.493 32.555 23.502 58.653 38.995 54.89 74.821 27.317 37.318 64.147 23.939
COMBINED 31.085 30.017 32.724 32.41 67.511 40.557 56.846 77.757 32.422 42.985 69.647 29.938

CLEAR: C:\Daten\git\crowd-overview\ObjectCounter\OpenCV-Tracking-V4\runs\tracks\exp7-pedestrianMOTA MOTP MODA CLR_Re CLR_Pr MTR PTR MLR sMOTA CLR_TP CLR_FN CLR_FP IDSW MT PT ML Frag
MOT16-02 20.703 73.657 21.163 26.658 82.909 11.111 33.333 55.556 13.68 4754 13079 980 82 6 18 30 171
MOT16-04 31.873 74.871 32.233 38.684 85.707 9.6386 45.783 44.578 22.152 18397 29160 3068 171 8 38 37 541
MOT16-05 44.045 73.643 45.365 59.343 80.936 22.4 56.8 20.8 28.404 4046 2772 953 90 28 71 26 138
MOT16-09 50.827 76.859 52.273 59.54 89.123 20 68 12 37.05 3130 2127 382 76 5 17 3 97
MOT16-10 32.643 72.809 33.845 43.229 82.163 16.667 44.444 38.889 20.889 5325 6993 1156 148 9 24 21 300
MOT16-11 51.406 79.804 51.864 59.854 88.223 20.29 34.783 44.928 39.318 5491 3683 733 42 14 24 31 72
MOT16-13 18.777 70.885 20.07 30.07 75.044 9.3458 37.383 53.271 10.022 3443 8007 1145 148 10 40 57 307
COMBINED 32.074 74.823 32.76 40.383 84.12 15.474 44.874 39.652 21.907 44586 65821 8417 757 80 232 205 1626

Identity: C:\Daten\git\crowd-overview\ObjectCounter\OpenCV-Tracking-V4\runs\tracks\exp7-pedestrianIDF1 IDR IDP IDTP IDFN IDFP
MOT16-02 27.513 18.18 56.54 3242 14591 2492
MOT16-04 39.976 29.009 64.272 13796 33761 7669
MOT16-05 47.068 40.789 55.631 2781 4037 2218
MOT16-09 41.487 34.601 51.794 1819 3438 1693
MOT16-10 32.236 24.598 46.752 3030 9288 3451
MOT16-11 42.33 35.524 52.362 3259 5915 2965
MOT16-13 32.959 23.083 57.607 2643 8807 1945
COMBINED 37.415 27.688 57.676 30570 79837 22433

Count: C:\Daten\git\crowd-overview\ObjectCounter\OpenCV-Tracking-V4\runs\tracks\exp7-pedestrianDets GT_Dets IDs GT_IDs
MOT16-02 5734 17833 58 54
MOT16-04 21465 47557 128 83
MOT16-05 4999 6818 59 125
MOT16-09 3512 5257 27 25
MOT16-10 6481 12318 74 54
MOT16-11 6224 9174 48 69
MOT16-13 4588 11450 81 107
COMBINED 53003 110407 475 517

## Conclusion

## Issues

https://github.com/pjreddie/darknet/issues/80

## References

[1] https://github.com/emasterclassacademy/Single-Multiple-Custom-Object-Detection-and-Tracking
