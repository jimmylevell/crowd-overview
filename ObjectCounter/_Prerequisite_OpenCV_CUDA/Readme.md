# Prerequisites
The neural network is performing badly when executed on only on a CPU.
To improve the performance, a GPU is required. OpenCV supports CUDA and OpenCV but one is required to manually compile it.
During this process the CUDA setting must be enabled in the OpenCV configuration file, allowing the creation of a CUDA-enabled OpenCV library.

Files can be downloaded [here](https://1drv.ms/u/s!AkVVh8y1e1vuqc14hHj5UIIxbiEx_g?e=AfCOgG)

## How it works
1) Download and install python
2) Download and install Visual Studio 2019 Community Edition. During the setup of Visual Studio enable the feature "Destkop development with C++".
3) Download [Cuda](https://developer.nvidia.com/cuda-11.0-download-archive?target_os=Windows&target_arch=x86_64) for Windows 10. Do not use the latest version as it is not compatible throughout the whole toolkit. Once downloaded install it with default options.
4) Download [cuDNN](https://developer.nvidia.com/rdp/cudnn-archive#a-collapse805-110) for Windows 10. Do not use the latest version as it is not compatible throughout the whole toolkit. Ensure that you select the version which is compatible with CUDA.
4.1) Once downloaded extract the files. Copy the content of the files to the root of the NVIDIA CUDA toolkit (e.g C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.0). Replace the files if prompted.
5) Download and install [cmake](https://cmake.org/download/).
6) Create a OpenCV BUILD folder.
7) Download the source file of [OpenCV](https://opencv.org/releases/) and extract the files to the BUILD folder.
8) Download opencv_contrib from [GitHub](https://github.com/opencv/opencv_contrib/tags) and extract the files to the BUILD folder. Ensure that the version is compatible with the version of OpenCV.
9) Open cmake GUI and select the extracted opencv folder as the source folder.
10) Create a new folder as build and select it as the build folder.
11) Hit configure and select Visual Studio 2019 as the generator.
12) Enable the following configurations
- WITH_CUDA
- OPENCV_DNN_CUDA
- ENABLE_FAST_MATH
- BUILD_opencv_world
- OPENCV_EXTRA_MODULES_PATH=<BUILD\opencv_contrib\modules>
13) Hit configure.
14) Enable the following configuration
- CUDA_ARCH_BIN=<6.1> # based on the GPU you have, see [wiki](https://en.wikipedia.org/wiki/CUDA) for more information
- CUDA_FAST_MATH
15) Hit generate.
16) Use the following command to build the library:
```
"C:\Program Files\CMake\bin\cmake.exe" --build "C:\OpenCV_Build\build" --target INSTALL --config Release
```
