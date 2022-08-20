# Master Thesis
Crowd Flow Monitoring – Visualizing crowd movements using information captured on checkpoints.

## Environment
### Python Virtual Env
For the development and execution of the python code virtual environments are provided which simplify the execution. The definition of the virtual environments can be found within the corresponding project folders (e.g conda-gpu.yml).

Using the following command the virtual environment can be created and activated.

```
%conda env create -f conda-gpu.yml
%conda activate conda-gpu.yml
```

### NextJS
For the development of the NextJS a devcontainer is provided which can be used. The devcontainer can be launched using Visual Studio Code.

### Azure Function
By using the Visual Studio Code Extension for [Azure](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) the code for the Azure function can be developed, tested and even run locally. This simplifies the development of the Azure Function tremendously.

## Components
This mono repository contains the following four important components. Each component has an individual readme explaining further details of the component.

### Crowd Manager Web Interface
Purpose: main web interface for the management of the checkpoints and for visualization of the crowd movements. The backend is also the entry point for the checkpoints to upload their measurements.

Technology used: NextJS, React, BootStrap

### Object Counter - Computer Model
Purpose: computer model which is used within the smart checkpoints. The model can detect and track objects within a web cam feed. The model can differ between 80 different classes of objects and can furthermore estimate the direction of the objects. Based on these various information the corresponding checkpoint can count individual classes of objects and report their direction of movement.

Technology: OpenCV, Python, Yolov4

### Measurement Aggregator - Azure Function
Purpose: aggregates the individual measurements to to get a more general and coarse impression of the movement of the crowd. These aggregated information are displayed within the web site.

Technology: JavaScript, Azure Function
### Simulator
Purpose: virtual environment to test the application setup.

Technology: Unity
