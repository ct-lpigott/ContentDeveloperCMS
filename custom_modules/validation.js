function checkIfPropertyMatchesAttributes(propertyName, propertyValue, structureAttributes, structureType, response){
    for(var attribute in structureAttributes){
        if(propertyValue == null || propertyValue.length == 0){
            if(attribute == "required"){
                if(structureType != null){
                    response.errors.push(propertyName + " is a required field for every item in this " + structureType);
                } else {
                    response.errors.push(propertyName + " is a required field");
                }                
                response.successful = false;
            } 
        }
        
        if(propertyValue != null) {
            if(attribute == "options"){
                if(enumMatch(propertyValue, structureAttributes["options"]) == false){
                    response.errors.push(propertyName + " value does not match with the allowed options");
                    response.successful = false;
                }
            } else if(attribute == "type"){
                switch(structureAttributes["type"]){
                    case "file":
                    case "text": {
                        if(propertyValue.constructor.name.toLowerCase() != "string"){
                            response.errors.push(propertyName + " contained unexpected data. Expected string.");
                            response.successful = false;
                        }
                        break;
                    }
                    case "number":{
                        if(isNaN(propertyValue)){
                            response.errors.push(propertyName + " contained unexpected data. Expected number.");
                            response.successful = false;
                        }
                        break;
                    }
                    case "email": {
                        if(propertyValue.indexOf("@") < 0 || propertyValue.indexOf(".") < 0){
                            response.errors.push(propertyName + " contained unexpected data. Expected email address.");
                            response.successful = false;
                        }
                    }
                }
            }
        }
    }  
}

function checkIfPropertyHasStructure(property, structureProperties, structureType, response){
    var structureExists = false;
    for(var structure in structureProperties){
        if(structure == property){
            structureExists = true;
            break;
        }
    }
    if(structureExists == false){
        if(structureType != null){
            response.errors.push(property + " does not have a structure defined for items within this " + structureType);                
        } else {
            response.errors.push(property + " does not have a structure defined");
        }
        response.successful = false;
    }
}

function enumMatch(propertyValue, allowedValues){
    var enumMatch = false;
    for(var option of allowedValues){
        if(propertyValue == option){
            enumMatch = true;
        }
    }
    return enumMatch;
}

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

        if(structure.type != null){
            if(content.constructor.name.toLowerCase() != structure.type){
                response.errors.push("Incorrect content type provided in request. Expected " + structure.type);
                response.successful = false;
                return response;
            }
        }

        if(structure.attributes != null){
            checkIfPropertyMatchesAttributes("Content", content, structure["attributes"], null, response);
        } else if(structure.items != null){
            switch(content.constructor.name.toLowerCase()){
                case "array": {
                    for(var i=0; i<content.length; i++){
                        // Checking for properties that are not defined
                        for(var itemProperty in content[i]){
                            checkIfPropertyHasStructure(itemProperty, structure["items"], structure.type, response);
                        }
                        
                        // Checking for properties that are defined
                        for(var property in structure["items"]){
                            if(structure["items"][property]["attributes"] != null){
                                checkIfPropertyMatchesAttributes(property, content[i][property], structure["items"][property]["attributes"], structure.type, response);
                            }  
                        }
                        
                    }
                    break;
                }
                case "object": {
                    // Checking for properties that are not defined
                    for(var key in content){
                        checkIfPropertyHasStructure(key, structure["items"], structure.type, response);                             
                    }
                    // Checking for properties that are defined
                    for(var property in structure["items"]){
                        if(structure["items"][property]["attributes"] != null){
                            checkIfPropertyMatchesAttributes(property, content[property], structure["items"][property]["attributes"], structure.type, response);
                        } 
                    }
                    break;
                }
            }
        } else {
            switch(content.constructor.name.toLowerCase()){
                case "object":
                case "array": {
                    // Checking for properties that are not defined
                    for(var key in content){
                        checkIfPropertyHasStructure(key, structure, structure.type, response);                       
                    }
                    // Checking for properties that are defined
                    for(var property in structure){
                        if(structure[property]["attributes"] != null){
                            checkIfPropertyMatchesAttributes(property, content[property], structure[property]["attributes"], null, response);
                        }   
                    }                     
                    break;
                }
                default: {
                    response.errors.push("Content contained unexpected data");
                    response.successful = false;
                    break;
                }                
            }
        }


        return response;
    }
};