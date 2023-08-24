# roboflow-red
A visual way to interact with computer vision using Node-RED

`roboflow-red` is an extension to Node-RED a visual programming interface, designed to make it easier to integrate computer vision into everyday workflows. From home automation to business use cases, you can now easily harness the power of machine learning to empower your devices. 


`roboflow-red` is simple to use by design. It has two nodes, `inference` and `upload`. You can use `roboflow-red` with any model trained on or uploaded to [Roboflow](https://roboflow.com/).

## Examples

Check out our example flow by uploading the JSON [here](https://github.com/stellasphere/roboflow-red/blob/main/examples/licenseplate.json) to Node-RED!

## Documentation

Unless stated otherwise, all inputs are from `msg.payload`. 

## Inference
<img width="143" alt="inference node" src="https://github.com/stellasphere/roboflow-red/assets/29011058/a6687b55-e66a-4c0b-835f-e502b437b324">

Use this node to infer on your Roboflow models. 

## Upload
<img width="143" alt="upload node" src="https://github.com/stellasphere/roboflow-red/assets/29011058/42e7443e-1394-4ae4-8c84-c7a76b9cba64">

Use this node to upload images to your Roboflow projects.
