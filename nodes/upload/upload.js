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
            // console.log("apikey:",apiKey)

            const projectId = config.project
            // console.log("projectId:",projectId)
            
            const image = msg.payload

            const profile = await rfReq("/",apiKey)
            const workspaceId = profile.workspace
            // console.log("workplaceid:",workspaceId)


            const uploadResult = await rfReq(`dataset/${projectId}/upload`,apiKey,image,"POST")
            // console.log("upload results:",uploadResult)

            if(!uploadResult.success) throw Error(uploadResult)
            node.send(msg);
        });
    }
    RED.nodes.registerType("upload",InferNode);
}
