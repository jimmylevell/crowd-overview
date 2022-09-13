# OpenCV Tracking using a Deep Learning Approach v2

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
python eval.py
```


All sequences for exp7 finished in 2.74 seconds

HOTA: exp7-pedestrian              HOTA      DetA      AssA      DetRe     DetPr     AssRe     AssPr     LocA      RHOTA     HOTA(0)   LocA(0)   HOTALocA(0)
MOT16-02                           36.415    36.269    36.741    38.193    76.244    39.185    77.546    81.576    37.432    46.156    77.359    35.706
MOT16-04                           59.316    58.496    60.723    63.272    76.498    64.922    79.486    81.073    61.921    78.831    75.365    59.411
MOT16-05                           39.773    37.371    42.428    40.041    74.488    52.066    67.278    81.847    41.211    50.876    76.947    39.147
MOT16-09                           53.175    57.107    49.571    65.859    74.649    54.871    78.803    85.718    57.132    65.772    82.188    54.057
MOT16-10                           50.055    49.745    50.536    53.631    74.783    54.791    77.585    80.607    52.056    66.414    75.699    50.275
MOT16-11                           62.85     59.766    66.317    71.275    73.652    72.929    82.857    86.831    68.739    74.965    83.452    62.56
MOT16-13                           44.766    41.226    48.961    44.648    72.73     54.575    73.596    80.505    46.706    58.763    75.302    44.25
COMBINED                           52.979    50.952    55.628    55.568    75.451    60.481    79.082    81.926    55.504    68.547    76.837    52.669

CLEAR: exp7-pedestrian             MOTA      MOTP      MODA      CLR_Re    CLR_Pr    MTR       PTR       MLR       sMOTA     CLR_TP    CLR_FN    CLR_FP    IDSW      MT        PT        ML        Frag
MOT16-02                           43.582    78.631    44.463    47.278    94.38     16.667    53.704    29.63     33.479    8431      9402      502       157       9         29        16        376
MOT16-04                           69.794    78.662    69.964    76.338    92.294    49.398    34.94     15.663    53.505    36304     11253     3031      81        41        29        13        581
MOT16-05                           43.018    79.267    43.811    48.783    90.75     17.6      60.8      21.6      32.904    3326      3492      339       54        22        76        27        209
MOT16-09                           61.29     84.187    62.165    75.195    85.231    52        48        0         49.399    3953      1304      685       46        13        12        0         108
MOT16-10                           61.073    77.369    61.698    66.707    93.016    29.63     55.556    14.815    45.976    8217      4101      617       77        16        30        8         548
MOT16-11                           63.451    85.467    63.833    80.303    82.98     53.623    36.232    10.145    51.78     7367      1807      1511      35        37        25        7         147
MOT16-13                           50.323    77.054    51.083    56.236    91.606    25.234    45.794    28.972    37.419    6439      5011      590       87        27        49        31        284
COMBINED                           59.983    79.374    60.469    67.058    91.053    31.915    48.356    19.729    46.151    74037     36370     7275      537       165       250       102       2253

Identity: exp7-pedestrian          IDF1      IDR       IDP       IDTP      IDFN      IDFP
MOT16-02                           47.717    35.81     71.488    6386      11447     2547
MOT16-04                           75.049    68.562    82.893    32606     14951     6729
MOT16-05                           54.068    41.566    77.326    2834      3984      831
MOT16-09                           65.124    61.29     69.47     3222      2035      1416
MOT16-10                           67.691    58.118    81.039    7159      5159      1675
MOT16-11                           74.019    72.825    75.253    6681      2493      2197
MOT16-13                           60.252    48.62     79.2      5567      5883      1462
COMBINED                           67.239    58.379    79.269    64455     45952     16857

Count: exp7-pedestrian             Dets      GT_Dets   IDs       GT_IDs
MOT16-02                           8933      17833     145       54
MOT16-04                           39335     47557     139       83
MOT16-05                           3665      6818      133       125
MOT16-09                           4638      5257      57        25
MOT16-10                           8834      12318     121       54
MOT16-11                           8878      9174      164       69
MOT16-13                           7029      11450     134       107
COMBINED                           81312     110407    893       517

## Conclusion

## References
[1] https://github.com/mikel-brostrom/Yolov5_StrongSORT_OSNet

[2] https://github.com/ultralytics/yolov5.git

[3] https://github.com/KaiyangZhou/deep-person-reid