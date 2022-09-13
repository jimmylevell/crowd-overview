# Object Tracking using a combinatory Machine and Deep Learning Approach

## Pre-Requirements
OpenCV with CUDA support

## Setup
Activate the virtual env using the following commands.
```bash
%conda env create -f conda-gpu.yml
%conda activate opencv-tracking-v1
```

Furthermore OpenCV must be compiled with CUDA support. This can be done by following the instructions on the [Pre-Requisites Read Me](../_Prerequisite_OpenCV_CUDA/Readme.md).

All configurations for the app can be made within the [settings.py](settings.py) file.

## Components
### Detection using a Deep Machine Learning Approach - YOLO
YOLO detector firstly developed 2015 using the darknet framework

As illustrated below, YOLO leverages the CNN receptive field to divide the image into a S x S grid. For each cell in the grid,
it estimates the centre (x, y), size (w, h) and objectness score for each of B bounding boxes per cell (boundin g boxes + confidence)
it emits the probabilities of all C object classes (class probability map)

For a given input image, this large search space yields a three-dimensional tensor of size S x S x (B x 5 + C). Arriving at the final detections requires the filtering of high-confidence predictions, followed by non-maximum suppression (NMS) to keep those that meet a certain maximum overlap threshold.

The YOLOv3 detector was originally trained with the Common Objects in Context (COCO) dataset, a large object detection, segmentation and captioning compendium released by Microsoft in 20144. The dataset features a total of 80 object classes YOLOv3 learned to identify and locate. To give a perspective of their diversity, here is a graphical representation of a random sample.

Is to perform object detection and recognition at the same time
is a detector applying a single neural network for a) predict bounding boxes, multi-label classification

### Tracking using a Machine Learning Approach - Euclidian Distance
Using machine learning approach Euclidian Distance as implemented in [OpenCV-Tracking-V2](../OpenCV-Tracking-V2/Readme.md). Please see the following readme for more information.

## Usage
The `main.py` file is the entry point for the application. It initializes the two components `EuclidianDistTracker` and `YOLO` and starts the video capture.

## Results
![OpenCV Tracking v3](../../Documentation/OpenCV3.gif)

## Evaluation

HOTA: C:\Daten\git\crowd-overview\ObjectCounter\OpenCV-Tracking-V3\runs\tracks\exp7-pedestrianHOTA      DetA      AssA      DetRe     DetPr     AssRe     AssPr     LocA      RHOTA     HOTA(0)   LocA(0)   HOTALocA(0)
MOT16-02                           17.518    16.05     19.253    16.379    79.654    19.748    84.368    83.571    17.716    20.975    79.572    16.69
MOT16-04                           25.382    24.069    26.988    24.921    79.38     27.823    87.209    83.761    25.873    30.685    78.367    24.047
MOT16-05                           26.784    27.613    26.14     29.495    69.107    27.589    74.777    78.603    27.731    37.583    68.865    25.881
MOT16-09                           27.001    35.478    20.665    37.058    80.105    21.393    83.329    83.955    27.641    33.195    79.765    26.478
MOT16-10                           21.616    27.911    16.905    28.954    75.387    17.426    76.602    79.831    22.069    27.908    74.32     20.741
MOT16-11                           30.24     40.672    22.558    42.36     83.321    23.03     88.543    85.7      30.897    35.897    82.05     29.453
MOT16-13                           19.861    13.647    29.494    14.006    73.228    31.195    77.675    80.613    20.159    24.473    75.402    18.453
COMBINED                           24.059    24.286    24.056    25.169    78.223    24.855    84.539    82.928    24.54     29.534    77.575    22.911

CLEAR: C:\Daten\git\crowd-overview\ObjectCounter\OpenCV-Tracking-V3\runs\tracks\exp7-pedestrianMOTA      MOTP      MODA      CLR_Re    CLR_Pr    MTR       PTR       MLR       sMOTA     CLR_TP    CLR_FN    CLR_FP    IDSW      MT        PT        ML        Frag
MOT16-02                           18.045    81.153    18.735    19.649    95.555    0         38.889    61.111    14.342    3504      14329     163       123       0         21        33        171
MOT16-04                           25.513    81.942    25.973    28.683    91.366    4.8193    39.759    55.422    20.333    13641     33916     1289      219       4         33        46        330
MOT16-05                           29.466    75.546    31.123    36.902    86.46     2.4       46.4      51.2      20.442    2516      4302      394       113       3         58        64        192
MOT16-09                           38.71     82.367    40.213    43.238    93.462    0         80        20        31.086    2273      2984      159       79        0         20        5         82
MOT16-10                           32.181    76.659    33.471    35.939    93.574    3.7037    44.444    51.852    23.792    4427      7891      304       159       2         24        28        252
MOT16-11                           43.329    84.805    44.495    47.667    93.761    2.8986    43.478    53.623    36.086    4373      4801      291       107       2         30        37        112
MOT16-13                           15.284    77.104    16.175    17.651    92.283    2.8037    22.43     74.766    11.243    2021      9429      169       102       3         24        80        149
COMBINED                           26.343    80.766    27.16     29.668    92.205    2.7079    40.619    56.673    20.636    32755     77652     2769      902       14        210       293       1288

Identity: C:\Daten\git\crowd-overview\ObjectCounter\OpenCV-Tracking-V3\runs\tracks\exp7-pedestrianIDF1      IDR       IDP       IDTP      IDFN      IDFP
MOT16-02                           20.056    12.09     58.795    2156      15677     1511
MOT16-04                           26.261    17.253    54.956    8205      39352     6725
MOT16-05                           36.349    25.931    60.756    1768      5050      1142
MOT16-09                           36.858    26.955    58.265    1417      3840      1015
MOT16-10                           26.559    18.38     47.855    2264      10054     2467
MOT16-11                           32.375    24.417    48.027    2240      6934      2424
MOT16-13                           20.909    12.454    65.114    1426      10024     764
COMBINED                           26.692    17.64     54.825    19476     90931     16048

Count: C:\Daten\git\crowd-overview\ObjectCounter\OpenCV-Tracking-V3\runs\tracks\exp7-pedestrianDets      GT_Dets   IDs       GT_IDs
MOT16-02                           3667      17833     138       54
MOT16-04                           14930     47557     299       83
MOT16-05                           2910      6818      185       125
MOT16-10                           4731      12318     184       54
MOT16-11                           4664      9174      162       69
MOT16-13                           2190      11450     135       107
COMBINED                           35524     110407    1203      517

Timing analysis:
MotChallenge2DBox.get_raw_seq_data                                     1.6205 sec
MotChallenge2DBox.get_preprocessed_seq_data                            1.4258 sec
HOTA.eval_sequence                                                     2.3388 sec
CLEAR.eval_sequence                                                    0.3455 sec
Identity.eval_sequence                                                 0.1476 sec
Count.eval_sequence                                                    0.0000 sec
eval_sequence                                                          5.9142 sec
Evaluator.evaluate                                                     7.2806 sec

## Conclusion
Based on the above evaluation the following conclusions can be drawn:
- limited approach
- manual selection of the object to be tracked is required, therefore no object detection
- object classses can not be determined
- SOT approach is not suitable for real-time applications

## References
[1] https://pysource.com/2021/10/05/object-tracking-from-scratch-opencv-and-python/

[2] https://github.com/JonathonLuiten/TrackEval#official-evaluation-code
