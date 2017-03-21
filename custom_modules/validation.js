function checkIfPropertyMatchesAttributes(propertyName, propertyValue, structureAttributes, structureType, responseObject){
    var propertyMatchesAttributes = true;
    propertyName = propertyName != null ? propertyName : "Content";
    for(var attribute in structureAttributes){
        if(propertyValue == null || propertyValue.length == 0){
            if(attribute == "required"){
                if(structureType != null){
                    responseObject.errors.push(propertyName + " is a required field for every item in this " + structureType);
                } else {
                    responseObject.errors.push(propertyName + " is a required field");
                }                
                propertyMatchesAttributes = false;
            } 
        }
        
        if(propertyValue != null) {
            if(attribute == "options"){
                if(enumMatch(propertyValue, structureAttributes["options"]) == false){
                    responseObject.errors.push(propertyName + " value does not match with the allowed options");
                    propertyMatchesAttributes = false;
                }
            } else if(attribute == "type"){
                if(typeof propertyValue == "string" || isNaN(propertyValue) == false){
                    switch(structureAttributes["type"]){
                        case "file":
                        case "text": {
                            if(propertyValue.constructor.name.toLowerCase() != "string"){
                                responseObject.errors.push(propertyName + " contained unexpected data. Expected string.");
                                propertyMatchesAttributes = false;
                            }
                            break;
                        }
                        case "tel":{
                            if(isNaN(propertyValue.replace(/-| |\+/g, ""))){
                                responseObject.errors.push(propertyName + " contained unexpected data. Expected telephone number.");
                                propertyMatchesAttributes = false;
                            }
                            break;
                        }
                        case "number":{
                            if(isNaN(propertyValue)){
                                responseObject.errors.push(propertyName + " contained unexpected data. Expected number.");
                                propertyMatchesAttributes = false;
                            }
                            break;
                        }
                        case "email": {
                            if(propertyValue.indexOf("@") < 0 || propertyValue.indexOf(".") < 0){
                                responseObject.errors.push(propertyName + " contained unexpected data. Expected email address.");
                                propertyMatchesAttributes = false;
                            }
                        }
                    }
                } else {
                    responseObject.errors.push(propertyName + " value is not defined to contain anything other than a single value");
                    propertyMatchesAttributes = false;
                }                
            }
        }
    }  
    return propertyMatchesAttributes;
}

function checkIfPropertyHasStructure(property, structureProperties, structureType, responseObject){
    var structureExists = false;
    for(var structure in structureProperties){
        if(structure == property){
            structureExists = true;
            break;
        }
    }
    if(structureExists == false){
        if(structureType != null){
            responseObject.errors.push(property + " does not have a structure defined for items within this " + structureType);                
        } else {
            responseObject.errors.push(property + " does not have a structure defined and has been removed");
        }
    }
    return structureExists;
}

function validateNewStructure(structureName, structure){
    var responseObject = {
        sanitisedStructure: structure,
        errors: [],
        allowed: true
    };

    if(typeof structure != "string"){
        if(responseObject.sanitisedStructure.items != null || responseObject.sanitisedStructure.attributes != null){
            var itemsValidation = validateStructureItem(structureName, responseObject.sanitisedStructure);
            if(itemsValidation.allowed){
                responseObject.sanitisedStructure = itemsValidation.sanitisedStructure;
            } else {
                responseObject.allowed = false;
            }
            for(var i=0; i<itemsValidation.errors.length; i++){
                responseObject.errors.push(itemsValidation.errors[i]);
            }
        } else {
            for(var property in responseObject.sanitisedStructure){
                var propertyValidation = validateStructureItem(property, responseObject.sanitisedStructure[property]);
                if(propertyValidation.allowed){
                    responseObject.sanitisedStructure[property] = propertyValidation.sanitisedStructure;
                } else {
                    delete responseObject.sanitisedStructure[property];
                }
                for(var i=0; i<propertyValidation.errors.length; i++){
                    responseObject.errors.push(propertyValidation.errors[i]);
                }
            }
        }
    } else {
        if(structureName != null){
            responseObject.allowed = checkAttributeAllowed(structureName, responseObject.errors);
        } else {
            responseObject.allowed = false;
        }
    }    
    
    return responseObject;
}

function validateStructureItem(itemName, itemStructure){
    var responseObject = {
        sanitisedStructure: itemStructure,
        errors: [],
        allowed: true
    }
    if(responseObject.sanitisedStructure.attributes != undefined){
        responseObject.sanitisedStructure.attributes = removeSuspiciousAttributes(responseObject.sanitisedStructure.attributes, responseObject.errors);
    } else if(responseObject.sanitisedStructure.items != undefined){
        for(var item in responseObject.sanitisedStructure.items){
            var itemValidation = validateStructureItem(item, responseObject.sanitisedStructure.items[item]);
            if(itemValidation.allowed){
                responseObject.sanitisedStructure.items[item] = itemValidation.sanitisedStructure;
            } else {
                delete responseObject.sanitisedStructure.items[item];
            }
            for(var i=0; i<itemValidation.errors.length; i++){
                responseObject.errors.push(itemValidation.errors[i]);
            }
        }
    } else {
        responseObject.allowed = checkAttributeAllowed(itemName, responseObject.errors);
    }
    return responseObject;
}

function removeSuspiciousAttributes(structureAttributes, feedsErrors){
    for(var attribute in structureAttributes){
        if(checkAttributeAllowed(attribute, feedsErrors) == false){
            delete structureAttributes[attribute];
        }
    }
    return structureAttributes;
}

function checkAttributeAllowed(attributeName, feedsErrors){
    var allowed = true;
    var allowedAttributes = ["class", "id", "type", "required", "options"];
    if(allowedAttributes.indexOf(attributeName) < 0){
        allowed = false;
        feedsErrors.push("The '" + attributeName + "' attribute is not allowed and has been removed");
    }
    return allowed;
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

function jsonToObject(jsonString){
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
}

function objectToJson(jsObject){
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
}

function validateNewContent(content, structure){
    var responseObject = {
        sanitisedContent: content,
        errors: [],
        allowed: true
    };

    if(typeof structure == "object"){
        if(structure.attributes != null || structure.items != null){
            var contentValidation = validateContentAgainstStructure(content, structure);
            if(contentValidation.allowed){
                responseObject.sanitisedContent = contentValidation.sanitisedContent;
            } else {
                responseObject.sanitisedContent = "";
                responseObject.allowed = false;
            }
            for(var i=0; i<contentValidation.errors.length; i++){
                responseObject.errors.push(contentValidation.errors[i]);
            }
        } else {
            for(var property in structure){
                if(structure[property].items != null || structure[property].attributes != null){
                    var itemsValidation = validateContentAgainstStructure(content[property], structure[property]);
                    if(itemsValidation.allowed){
                        responseObject.sanitisedContent[property] = itemsValidation.sanitisedContent;
                    } else {
                        delete responseObject.sanitisedContent[property];
                    }
                    for(var i=0; i<itemsValidation.errors.length; i++){
                        responseObject.errors.push(itemsValidation.errors[i]);
                    }
                } else {
                    //responseObject.sanitisedContent[property] = "";
                    //responseObject.allowed = false;
                }          
            }
        }
    } else {
        responseObject.sanitisedContent = "";
        responseObject.allowed = false;
    }
    

    return responseObject;
}

function validateContentAgainstStructure(content, structure){
    var responseObject = {
        allowed: true,
        errors: [],
        sanitisedContent: content
    };

    if(structure.type != null && structure.type != "html" && structure.type != "link"){
        if(content.constructor.name.toLowerCase() != structure.type){
            responseObject.errors.push("Incorrect content type provided in request. Expected " + structure.type);
            responseObject.allowed = false;
            return response;
        }
    }

    if(structure.attributes != null){
        var allowed = checkIfPropertyMatchesAttributes(null, content, structure["attributes"], null, responseObject);
        if(allowed == false){
            responseObject.allowed = false;
        }
    } else if(structure.items != null){
        switch(structure.type){
            case "array": {
                for(var i=0; i<content.length; i++){
                    // Checking for properties that are not defined
                    for(var itemProperty in content[i]){
                        var structureExists = checkIfPropertyHasStructure(itemProperty, structure["items"], structure.type, responseObject);
                        if(structureExists == false){
                            delete responseObject.sanitisedContent[i][itemProperty];
                        }
                    }
                    
                    // Checking for properties that are defined
                    for(var property in structure["items"]){
                        if(structure["items"][property]["attributes"] != null){
                            var allowed = checkIfPropertyMatchesAttributes(property, content[i][property], structure["items"][property]["attributes"], structure.type, responseObject);
                            if(allowed == false){
                                responseObject.sanitisedContent[i][property] = "";
                            }
                        } else if(structure["items"][property]["items"] != null){         
                            var contentValidation = validateContentAgainstStructure(content[i][property], structure["items"][property]);
                            if(contentValidation.allowed){
                                responseObject.sanitisedContent[i][property] = contentValidation.sanitisedContent;
                            } else {
                                delete responseObject.sanitisedContent[i][property];
                            }
                            for(var i=0; i<contentValidation.errors.length; i++){
                                responseObject.errors.push(contentValidation.errors[i]);
                            }
                        }
                    }
                    
                }
                break;
            }
            default: {
                // Checking for properties that are not defined
                for(var key in content){
                    var structureExists = checkIfPropertyHasStructure(key, structure["items"], structure.type, responseObject);
                    if(structureExists == false){
                        delete responseObject.sanitisedContent[key];
                    }                     
                }
                // Checking for properties that are defined
                for(var property in structure["items"]){
                    if(structure["items"][property]["attributes"] != null){
                        var allowed = checkIfPropertyMatchesAttributes(property, content[property], structure["items"][property]["attributes"], structure.type, responseObject);
                        if(allowed == false){
                            responseObject.sanitisedContent[property] = "";
                        }
                    } else if(structure["items"][property]["items"] != null){
                        if(content[property] != null){
                            var contentValidation = validateContentAgainstStructure(content[property], structure["items"][property]);
                            if(contentValidation.allowed){
                                responseObject.sanitisedContent[property] = contentValidation.sanitisedContent;
                            } else {
                                delete responseObject.sanitisedContent[property];
                            }
                            for(var i=0; i<contentValidation.errors.length; i++){
                                responseObject.errors.push(contentValidation.errors[i]);
                            }
                        } 
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
                    var structureExists = checkIfPropertyHasStructure(key, structure, structure.type, responseObject);       
                    if(structureExists == false){
                        delete responseObject.sanitisedContent[key];
                    }                
                }
                // Checking for properties that are defined
                for(var property in structure){
                    if(structure[property]["attributes"] != null){
                        var allowed = checkIfPropertyMatchesAttributes(property, content[property], structure[property]["attributes"], null, responseObject);
                        if(allowed == false){
                            responseObject.sanitisedContent[property] = "";
                        }
                    }   
                }                     
                break;
            }
            default: {
                responseObject.errors.push("Content contained unexpected data");
                responseObject.allowed = false;
                break;
            }                
        }
    }


    return responseObject;
}

module.exports = {
    validateNewStructure: validateNewStructure,
    validateNewContent: validateNewContent,
    jsonToObject: jsonToObject,
    objectToJson: objectToJson
};