const axios = require("axios")

async function rfReq(path,apiKey,body,method="GET",baseurl="https://api.roboflow.com") {
    try {
        var url = new URL(path,baseurl)
        if(apiKey) url.searchParams.set("api_key",apiKey)

        // console.log("RF API Request:",method,url.href)

        var reqConfig = {
            method,
            url: url.href,
            responseType: "json",
            data: body
        }

        const response = await axios(reqConfig);
        return response.data;
      } catch (error) {
        if(error.toJSON) // console.log(error.toJSON())
        throw Error(error);
      }
}

module.exports = function(RED) {
    function InferNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', async function(msg) {
            const apiKey = config.apikey
            const modelId = config.model
            // console.log("apikey and model:",apiKey,modelId)

            const projectId = modelId.split("/")[0]
            const versionId = modelId.split("/")[1]
            // console.log("projectId:",projectId)
            // console.log("versionId:",versionId)
            
            const image = msg.payload

            const profile = await rfReq("/",apiKey)
            const workspaceId = profile.workspace
            // console.log("workplaceid:",workspaceId)

            const project = (await rfReq(`${workspaceId}/${projectId}`,apiKey)).project
            // console.log("project",project)

            const projectType = project.type
            // console.log("type:",projectType)

            let endpoint;
            switch (projectType) {
                case 'object-detection':
                    endpoint = 'https://detect.roboflow.com';
                    break;
                case 'instance-segmentation':
                    endpoint = 'https://outline.roboflow.com';
                    break;
                case 'classification':
                    endpoint = 'https://classify.roboflow.com';
                    break;
                default:
                    throw Error("Unsupported model type")
            }            
            // console.log("endpoint:",endpoint)

            const inferenceResult = await rfReq(modelId,apiKey,image,"POST",endpoint)
            // console.log("infer results:",inferenceResult)

            var predictions = inferenceResult.predictions
            // console.log("predictions:",predictions)

            if(projectType == "object-detection") predictions.map(prediction => {
                prediction.center_x = prediction.x
                prediction.center_y = prediction.y
                prediction.x1 = prediction.x - (prediction.width/2)
                prediction.x2 = prediction.x + (prediction.width/2)
                prediction.y1 = prediction.y - (prediction.height/2)
                prediction.y2 = prediction.y + (prediction.height/2)

                delete prediction.x, prediction.y

                return prediction
            })
            // console.log("predictions w xyxy:",predictions)

            msg.payload = predictions
            node.send(msg);
        });
    }
    RED.nodes.registerType("inference",InferNode);
}