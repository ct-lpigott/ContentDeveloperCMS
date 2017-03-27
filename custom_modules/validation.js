function checkIfPropertyMatchesAttributes(propertyName, propertyValue, structureAttributes, structureType, responseObject){
    var response = {
        allowed: true,
        sanitisedContent: null
    };

    if((structureType != null && (structureType == "html" || structureType == "link")) || structureAttributes.type == "file"){
        response.sanitisedContent = removeSuspiciousContent(propertyValue, true);
    } else {
        response.sanitisedContent = removeSuspiciousContent(propertyValue);
    } 

    propertyName = propertyName != null ? propertyName : "Content";

    for(var attribute in structureAttributes){
        if(response.sanitisedContent == null || response.sanitisedContent.length == 0){
            if(attribute == "required"){
                if(structureType != null){
                    responseObject.errors.push(propertyName + " is a required field for every item in this " + structureType);
                } else {
                    responseObject.errors.push(propertyName + " is a required field");
                }                
                response.allowed = false;
            } 
        }
        
        if(response.sanitisedContent != null) { 
            if(attribute == "options"){
                if(enumMatch(response.sanitisedContent, structureAttributes["options"]) == false){
                    responseObject.errors.push(propertyName + " value does not match with the allowed options");
                    response.allowed = false;
                }
            } else if(attribute == "maxlength"){
                 if(response.sanitisedContent.length > structureAttributes["maxlength"]){
                     responseObject.errors.push(propertyName + "'s length exceeded the maximum length of " + structureAttributes["maxlength"]);
                     response.allowed = false;
                 }
            } else if(attribute == "max"){
                if(isNaN(response.sanitisedContent) == false && Number(response.sanitisedContent) > structureAttributes["max"]){
                    responseObject.errors.push(propertyName + "'s length exceeded the maximum value of " + structureAttributes["max"]);
                    response.allowed = false;
                }
            } else if(attribute == "min"){
                if(isNaN(response.sanitisedContent) == false && Number(response.sanitisedContent) < structureAttributes["min"]){
                    responseObject.errors.push(propertyName + "'s length was less than the minimum value of " + structureAttributes["min"]);
                    response.allowed = false;
                }
            } else if(attribute == "type"){
                if(typeof response.sanitisedContent == "string" || isNaN(response.sanitisedContent) == false){
                    switch(structureAttributes["type"]){
                        case "file":
                        case "text": {
                            if(response.sanitisedContent.constructor.name.toLowerCase() != "string"){
                                responseObject.errors.push(propertyName + " contained unexpected data. Expected string.");
                                response.allowed = false;
                            }
                            break;
                        }
                        case "tel":{
                            if(isNaN(response.sanitisedContent.replace(/-| |\+/g, ""))){
                                responseObject.errors.push(propertyName + " contained unexpected data. Expected telephone number.");
                                response.allowed = false;
                            }
                            break;
                        }
                        case "number":{
                            if(isNaN(response.sanitisedContent)){
                                responseObject.errors.push(propertyName + " contained unexpected data. Expected number.");
                                response.allowed = false;
                            }
                            break;
                        }
                        case "email": {
                            if(response.sanitisedContent.indexOf("@") < 0 || response.sanitisedContent.indexOf(".") < 0){
                                responseObject.errors.push(propertyName + " contained unexpected data. Expected email address.");
                                response.allowed = false;
                            }
                        }
                    }
                } else {
                    responseObject.errors.push(propertyName + " value is not defined to contain anything other than a single value");
                    response.allowed = false;
                }                
            }
        }
    }  
    return response;
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
                    responseObject.errors.push("The '" + property + "' property is not allowed and has been removed");
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
            responseObject.errors.push("This structure is not allowed and has been removed");
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

    if(responseObject.sanitisedStructure.attributes != undefined || responseObject.sanitisedStructure.items != undefined){
        responseObject.sanitisedStructure = removeSuspiciousProperties(responseObject.sanitisedStructure, responseObject.errors);
    }


    if(responseObject.sanitisedStructure.attributes != undefined){
        responseObject.sanitisedStructure.attributes = removeSuspiciousAttributes(responseObject.sanitisedStructure.attributes, responseObject.errors);
    } else if(responseObject.sanitisedStructure.items != undefined){
        for(var item in responseObject.sanitisedStructure.items){
            var itemValidation = validateStructureItem(item, responseObject.sanitisedStructure.items[item]);
            if(itemValidation.allowed){
                responseObject.sanitisedStructure.items[item] = itemValidation.sanitisedStructure;
            } else {
                responseObject.errors.push("The '" + item + "' property is not allowed in items and has been removed");
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

function removeSuspiciousProperties(structure, feedsErrors){
    for(var property in structure){
        if(checkPropertyAllowed(property, feedsErrors) == false){
            delete structure[property];
        }
    }
    return structure;
}

function removeSuspiciousContent(propertyValue, htmlAllowed=false){
    var sanitisedContent;

    if(htmlAllowed){
        sanitisedContent = sanitise(propertyValue, false, true);
    } else {
        sanitisedContent = sanitise(propertyValue);
    }

    return sanitisedContent;
}

function sanitise(data, cssAllowed=false, htmlAllowed=false){
    var sanitisedData = data;
    if(data != undefined && data != null){
        sanitisedData = sanitisedData.toString();

        if(htmlAllowed == false){
            sanitisedData = sanitisedData.replace(/&/g, "&amp;");
            sanitisedData = sanitisedData.replace(/=/g, "&equals;");
            sanitisedData = sanitisedData.replace(/</g, "&lt;");
            sanitisedData = sanitisedData.replace(/>/g, "&gt;");
            sanitisedData = sanitisedData.replace(/\//g, "&sol;");
            sanitisedData = sanitisedData.replace(/\\/g, "&bsol;");
        }  

        if(cssAllowed == false){
            sanitisedData = sanitisedData.replace(/{/g, "&lcub;");
            sanitisedData = sanitisedData.replace(/}/g, "&rcub;"); 
        }

        sanitisedData = sanitisedData.replace(/<script/g, "");
        sanitisedData = sanitisedData.replace(/script>/g, "");
        sanitisedData = sanitisedData.replace(/'on(\w+)'=/g, "");
        sanitisedData = sanitisedData.replace(/"on(\w+)"=/g, "");
        sanitisedData = sanitisedData.replace(/`/g, "&grave;");
        sanitisedData = sanitisedData.replace(/\(/g, "&lpar;");
        sanitisedData = sanitisedData.replace(/\)/g, "&rpar;");
        sanitisedData = sanitisedData.replace(/\[/g, "&lsqb;");
        sanitisedData = sanitisedData.replace(/\]/g, "&rbrack;");
    }
    return sanitisedData;
}

function checkAttributeAllowed(attributeName, feedsErrors){
    var allowed = true;
    var allowedAttributes = ["class", "id", "type", "required", "options", "maxlength", "max", "min", "alt"];
    if(allowedAttributes.indexOf(attributeName) < 0){
        allowed = false;
        feedsErrors.push("The '" + attributeName + "' attribute is not allowed and has been removed");
    }
    return allowed;
}

function checkPropertyAllowed(propertyName, feedsErrors){
    var allowed = true;
    var allowedProperties = ["attributes", "items", "input_type", "type"];
    if(allowedProperties.indexOf(propertyName) < 0){
        allowed = false;
        feedsErrors.push("The '" + propertyName + "' property is not allowed and has been removed");
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

function validateNewContent(content, structure, accessLevel){
    var responseObject = {
        sanitisedContent: content,
        errors: [],
        allowed: true
    };

    if(typeof structure == "object"){
        if(structure.attributes != null || structure.items != null){
            if(content != null){
                if(checkAccessLevelAllowedUpdate(structure, accessLevel, responseObject)){
                    var contentValidation = validateContentAgainstStructure(content, structure, accessLevel);
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
                    responseObject.allowed = false;
                }
            }
        } else {
            for(var property in structure){
                if(content[property] != null){
                    if(structure[property].items != null || structure[property].attributes != null){
                        var itemsValidation = validateContentAgainstStructure(content[property], structure[property], accessLevel);
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
        }
    } else {
        responseObject.sanitisedContent = "";
        responseObject.allowed = false;
    }
    

    return responseObject;
}

function checkAccessLevelAllowedUpdate(structure, accessLevel, responseObject){
    var allowedUpdate = false;
    if(accessLevel <= 2 || structure.no_access == null || (structure.no_access != null && accessLevel != 3 && structure.no_access.indexOf(accessLevel) < 0)){
        allowedUpdate = true;
    } else {
        responseObject.errors.push("This user does not have the appropriate access level to update this content");
    }
    return allowedUpdate;
}

function validateContentAgainstStructure(content, structure, accessLevel){
    var responseObject = {
        allowed: true,
        errors: [],
        sanitisedContent: content
    };

    if(structure.type != null && structure.type != "html" && structure.type != "link"){
        if(content.constructor.name.toLowerCase() != structure.type){
            responseObject.errors.push("Incorrect content type provided in request. Expected " + structure.type);
            responseObject.allowed = false;
            return responseObject;
        }
    }

    if(checkAccessLevelAllowedUpdate(structure, accessLevel, responseObject)){
        if(structure.attributes != null){
            var attributeCheck = checkIfPropertyMatchesAttributes(null, content, structure.attributes, structure.type, responseObject);
            if(attributeCheck.allowed){
                responseObject.sanitisedContent = attributeCheck.sanitisedContent;
            }else {
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
                                var attributeCheck = checkIfPropertyMatchesAttributes(property, content[i][property], structure["items"][property]["attributes"], structure["items"][property].type, responseObject);
                                if(attributeCheck.allowed){
                                    responseObject.sanitisedContent[i][property] = attributeCheck.sanitisedContent;
                                } else {
                                    responseObject.sanitisedContent[i][property] = "";
                                }
                            } else if(structure["items"][property]["items"] != null){         
                                var contentValidation = validateContentAgainstStructure(content[i][property], structure["items"][property], accessLevel);
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
                        if(checkAccessLevelAllowedUpdate(structure["items"][property], accessLevel, responseObject)){
                            if(structure["items"][property]["attributes"] != null){
                                var attributeCheck = checkIfPropertyMatchesAttributes(property, content[property], structure["items"][property]["attributes"], structure["items"][property].type, responseObject);
                                if(attributeCheck.allowed){
                                    responseObject.sanitisedContent[property] = attributeCheck.sanitisedContent;
                                } else {
                                    responseObject.sanitisedContent[property] = "";
                                }
                            } else if(structure["items"][property]["items"] != null){
                                if(content[property] != null){
                                    var contentValidation = validateContentAgainstStructure(content[property], structure["items"][property], accessLevel);
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
                        } else {
                            delete content[property];
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
                            var attributeCheck = checkIfPropertyMatchesAttributes(property, content[property], structure[property]["attributes"], null, responseObject);
                            if(attributeCheck.allowed){
                                responseObject.sanitisedContent[property] = attributeCheck.sanitisedContent;
                            } else {
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
    } else {
        responseObject.allowed = false;
    }


    return responseObject;
}

module.exports = {
    validateNewStructure: validateNewStructure,
    validateNewContent: validateNewContent,
    jsonToObject: jsonToObject,
    objectToJson: objectToJson,
    sanitise: sanitise
};