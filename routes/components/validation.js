module.exports = {
    jsonToObject: function(jsonString){
        var validJsObject = false;
        var jsObj = {};

        try {
            jsObj = JSON.parse(jsonString);
            validJsObject = true;
        } catch(e) {
            validJsObject = false;
        }
        
        console.log("VALIDATION | Valid object = " + validJsObject);
        return validJsObject;
    },
    objectToJson: function(jsObject){
        var validJson = false;
        var jsonString = "";

        try {
            jsonString = JSON.stringify(jsObject);
            validJson = true;
        } catch(e) {
            validJson = false;
        }
        
        console.log("VALIDATION | Valid JSON = " + validJson);
        return validJson;
    },
    contentStructure: function(content, structure){
        var response = {
            successful: true,
            errors: []
        };
        return response;
    }
};