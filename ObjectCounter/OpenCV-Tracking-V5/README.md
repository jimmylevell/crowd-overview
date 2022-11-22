# OpenCV Tracking using a Deep Learning Approach v5

## Pre-Requirements

- PyTorch with CUDA support
- OpenCV with CUDA support

## Setup

Activate the virtual env using the following commands.

```bash
%conda env create -f conda-gpu.yml
%conda activate opencv-tracking-v1
```

Furthermore OpenCV must be compiled with CUDA support. This can be done by following the instructions on the [Pre-Requisites Read Me](../_Prerequisite_OpenCV_CUDA/Readme.md).

All configurations for the app can be made within the [settings.py](settings.py) file.

- StrongSort: strong_sort/configs/strong_sort.yaml

## Components

### Detection using a Deep Machine Learning Approach - YOLOv5

### Tracking using a Deep Machine Learning Approach - StrongSort

## Usage

## Results

![OpenCV Tracking v5](../../Documentation/OpenCV5.gif)

## Evaluation

```bash
# comparing the different tracking algorithms
python val.py --tracking-method strongsort --yolo-weights yolov5n.pt
python val.py --tracking-method bytetrack --yolo-weights yolov5n.pt
python val.py --tracking-method ocsort --yolo-weights yolov5n.pt

# comparing the different yolo weights
python val.py --tracking-method strongsort --yolo-weights yolov5n.pt
python val.py --tracking-method strongsort --yolo-weights yolov5s.pt
python val.py --tracking-method strongsort --yolo-weights yolov5m.pt
python val.py --tracking-method strongsort --yolo-weights yolov5l.pt
python val.py --tracking-method strongsort --yolo-weights yolov5x.pt

```

Speed: 1.5ms pre-process, 57.3ms inference, 2.4ms NMS, 469.3ms strong sort update per image at shape (1, 3, 1280, 1280)
Speed: 1.5ms pre-process, 57.3ms inference, 2.4ms NMS, 469.3ms strong sort update per image at shape (1, 3, 1280, 1280)
Results saved to runs\track\exp73
4 tracks saved to runs\track\exp73\tracks
Results saved to runs\track\exp73
4 tracks saved to runs\track\exp73\tracks

Eval Config:
USE_PARALLEL : True
NUM_PARALLEL_CORES : 4
BREAK_ON_ERROR : True
RETURN_ON_ERROR : False
LOG_ON_ERROR : C:\Daten\git\crowd-overview\ObjectCounter\OpenCV-Tracking-V5\val_utils\error_log.txt
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
GT_FOLDER : C:\Daten\git\crowd-overview\ObjectCounter\OpenCV-Tracking-V5\val_utils\data/gt/mot_challenge/
TRACKERS_FOLDER : C:\Daten\git\crowd-overview\ObjectCounter\OpenCV-Tracking-V5\val_utils\data/trackers/mot_challenge/
OUTPUT_FOLDER : None
TRACKERS_TO_EVAL : ['exp73']
CLASSES_TO_EVAL : ['pedestrian']
BENCHMARK : MOT20
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

Evaluating 1 tracker(s) on 4 sequence(s) for 1 class(es) on MotChallenge2DBox dataset using the following metrics: HOTA, CLEAR, Identity, Count

Evaluating exp73

All sequences for exp73 finished in 34.17 seconds

HOTA: exp73-pedestrian HOTA DetA AssA DetRe DetPr AssRe AssPr LocA RHOTA HOTA(0) LocA(0) HOTALocA(0)
MOT20-01 54.584 56.987 52.587 60.101 82.461 56.587 78.35 84.859 56.184 65.788 81.662 53.724
MOT20-02 0.088395 0.01051 0.80378 0.01051 81.316 0.80378 100 89.33 0.088396 0.092757 88.243 0.081852
MOT20-03 22.248 11.482 43.123 11.639 75.062 45.315 77.451 79.336 22.401 29.377 74.945 22.016
MOT20-05 48.842 54.15 44.143 56.64 81.078 46.805 77.497 83.233 50.001 60.75 80.023 48.615
COMBINED 39.616 35.388 44.418 36.537 80.549 47.11 77.672 82.928 40.282 49.186 79.594 39.149

CLEAR: exp73-pedestrian MOTA MOTP MODA CLR_Re CLR_Pr MTR PTR MLR sMOTA CLR_TP CLR_FN CLR_FP IDSW MT PT ML Frag
MOT20-01 67.599 82.791 68.868 70.876 97.245 39.189 48.649 12.162 55.402 14083 5787 399 252 29 36 9 367
MOT20-02 0.01034 88.243 0.01034 0.011632 90 0 0 100 0.0089722 18 154724 2 0 0 0 270 0
MOT20-03 14.429 75.651 14.496 15.001 96.743 4.2735 15.385 80.342 10.777 47053 266605 1584 210 30 108 564 834
MOT20-05 67.031 80.825 67.588 68.723 98.375 31.565 53.892 14.542 53.853 444187 202157 7337 3598 369 630 170 13797
COMBINED 43.359 80.398 43.717 44.539 98.189 19.323 34.944 45.734 34.629 505341 629273 9322 4060 428 774 1013 14998

Identity: exp73-pedestrian IDF1 IDR IDP IDTP IDFN IDFP
MOT20-01 68.031 58.807 80.686 11685 8185 2797
MOT20-02 0.023262 0.011632 90 18 154724 2
MOT20-03 23.768 13.727 88.525 43056 270602 5581
MOT20-05 61.527 52.255 74.801 337745 308599 113779
COMBINED 47.597 34.594 76.264 392504 742110 122159

Count: exp73-pedestrian Dets GT_Dets IDs GT_IDs
MOT20-01 14482 19870 156 74
MOT20-02 20 154742 20 270
MOT20-03 48637 313658 268 702
MOT20-05 451524 646344 2823 1169
COMBINED 514663 1134614 3267 2215

## Conclusion

## References

[1] https://github.com/mikel-brostrom/Yolov5_StrongSORT_OSNet

[2] https://github.com/ultralytics/yolov5.git

[3] https://github.com/KaiyangZhou/deep-person-reid

```

```
