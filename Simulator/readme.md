# Simulator

## Why

Creating artificial data has many advantages compared to traditional and time intensive data collection processes or field tests. This advantage decreases the resources required to test hypothesis as data has not to be manually collected and labeled. At first synthetic data does not infringe privacy as it does not include personally identifiable information. Furthermore, the data is created based on parameters the developers of such datasets can ensure that it is balanced with respect to age, gender, race, culture, etc. This allows to support the important topic of removing biases from computer models.

Synthetic datasets can be used to create unlimited amount of data and can therefore be easily integrated in existing training and testing data pipelines. This allows to train and test models on a larger amount of data and to test them on a larger variety of scenarios.

Lastly the dataset can simulate “black swan” events that are rare but significant for the computer model to be trained on (e.g. car crashes). This allows to test the models robustness and to ensure that it can handle rare events.

Based on [1]

## Terminology

Synthetic data is artificial data that mimics real-world observations and is used to train machine learning models when actual data is difficult or expensive to get.

Synthetic data differs from random or augmented data. Augmenting data is the process of changing existing datapoints (e.g by scaling or rotating) and add them as new datapoints to the dataset. This is a cheap way to increase the size of the dataset but does not allow to create new scenarios. Random data is data that is generated randomly and does not resemble real-world observations. This is often used to test the robustness of a model.

But synthetic data gives us true control over the data we are generating. We can create data that is representative of the real world and can be used to train models that can generalize well to the real world.

There are two levels of synthetic data generation:

- The partial type is a data set that includes synthetic data and real data from existing observations or measurements.
- The full type refers to data sets with only synthetic data. An example would be a generated image of a car in a simulated environment

Based on [2]

## Success Stories and Use Cases

### [American Express](https://www.bangkokpost.com/business/2158831/fake-it-to-make-it-companies-beef-up-ai-models-with-synthetic-data)

American Express trained an AI model to prevent fraud. The model was trained on synthetic data. For the data generation process GANs have been used as not enough real world data was available. The goal was to augment the real data set with synthesized data in order to balance the availability of different fraud variations. The process used by American Express did not include any personal data and therefore did not infringe privacy.

### [Mobiliar](https://f.hubspotusercontent10.net/hubfs/3832818/Resources/case_studies/CS_Mobiliere_x_Statice.pdf?hsCtaTracking=de21e86a-a06f-4e3a-b218-015159730149%257C471d7f33-9783-4c15-9607-b2c6fc0ecb3a)

Swiss insurance company La Mobilière used synthetic data to train their churn model. Churn prediction is one of the common machine learning tasks used to identify and forecast customers who are likely to stop using the service. Effective churn prediction gives business time and information to proactively contact customers with better deals to make them stay.

The main problem the company solved with synthetic data was privacy issues. From 2017, new compliance for private data usage in Switzerland started to be established, and so it was complicated and expensive to actually base models on real data. With synthetic tabular data, La Mobilière was able to obtain data for compliance model training.

Within less than two weeks, Mobilar was able to create, generate and utilize highly granular synthetic data that would ensure the continued compliance of their data operations. The performance of the synthetic trained churn models did not compromise the performance.

### [BMW](https://blogs.nvidia.com/blog/2021/04/13/nvidia-bmw-factory-future/)

Virtual factory space for robot navigation and production simulation for BMW was designed by NVIDIA. The aim of the simulation was to prototype a future factory by creating its digital twin. Using the digital twin, the company can test and validate new production processes and robot navigation before they are implemented in the real factory. The simulation is based on real data and uses synthetic data to fill the gaps. The simulation is used to train the robots and to test the new processes.

Based on [2]

## How it works

Using the [Traffic3D](https://traffic3d.org/) which is a traffic simulation program built on top of Unity. Traffic3D should allow us to stress test the developed prototype in an artificial environment, without the requirement of expensive and exhaustive field tests. The program is capable of simulating traffic in a 3D environment, with the ability to add vehicles, pedestrians, and other objects. The program also allows for the creation of custom scenarios, which can be used to test the developed prototype.

## Design

## Development

Client server architecture

Server running Unreal Engine

```bash
.\CarlaUE4.exe -carla-rpc-port=3000

```

Python as Client to interact with the server and influence the simulation

```python.

## Production

## References

[1] https://towardsdatascience.com/peoplesanspeople-generating-synthetic-data-of-virtual-human-beings-in-unity-a1847a56895c
[2] https://www.altexsoft.com/blog/synthetic-data-generation/
```
