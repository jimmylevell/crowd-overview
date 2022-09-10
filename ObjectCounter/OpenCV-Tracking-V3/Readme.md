# Combination of Deep Learning (YOLO) for Detection and Machine Learning (Euclidian Distance Tracker) for Tracking

# Detection - YOLO
YOLO detector firstly developed 2015 using the darknet framework

As illustrated below, YOLO leverages the CNN receptive field to divide the image into a S x S grid. For each cell in the grid,
it estimates the centre (x, y), size (w, h) and objectness score for each of B bounding boxes per cell (boundin g boxes + confidence)
it emits the probabilities of all C object classes (class probability map)

For a given input image, this large search space yields a three-dimensional tensor of size S x S x (B x 5 + C). Arriving at the final detections requires the filtering of high-confidence predictions, followed by non-maximum suppression (NMS) to keep those that meet a certain maximum overlap threshold.

The YOLOv3 detector was originally trained with the Common Objects in Context (COCO) dataset, a large object detection, segmentation and captioning compendium released by Microsoft in 20144. The dataset features a total of 80 object classes YOLOv3 learned to identify and locate. To give a perspective of their diversity, here is a graphical representation of a random sample.


# Tracking - Euclidian Distance
Using machine learning approach Eucledian Distance

See [OpenCV-Tracking-V2](../OpenCV-Tracking-V2/Readme.md) for more details.

![OpenCV Tracking v3](../../Documentation/OpenCV3.gif)
