function checkIfPropertyMatchesAttributes(propertyName, propertyValue, structureAttributes, structureType, responseObject){
    // Creating a response object to return to the caller. Not inculding an errors property 
    // on this object, as all errors will be pushed directly to the response object passed 
    // to the function. Keeping these two objects seperate, as just because a property fails
    // in here, does not mean the entire request will fail (i.e. the property can just be
    // removed from the content)
    var response = {
        allowed: true,
        sanitisedContent: null
    };

    // Sanitising the content, based on the type
    if((structureType != null && structureType == "html") || (structureAttributes != null && (structureAttributes.type == "file" || structureAttributes.type == "link" ))){
        // Allowing HTML characters
        response.sanitisedContent = removeSuspiciousContent(propertyValue, true);
    } else {
        // Removing all suspicious content/characters
        response.sanitisedContent = removeSuspiciousContent(propertyValue);
    } 

    // Ensuring the "property name" has a value, for use in errors. Content that was at the
    propertyName = propertyName != null ? propertyName : "Content";

    // Looping through all attributes of the content structure
    for(var attribute in structureAttributes){
        // Ensuring that "required" content was provided
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
            // Checking for specific attributes
            if(attribute == "options"){
                // Checking that the value provided matches one of the "options" in the structure
                if(enumMatch(response.sanitisedContent, structureAttributes["options"]) == false){
                    responseObject.errors.push(propertyName + " value does not match with the allowed options - '" + structureAttributes["options"].join(", ") + "'");
                    response.allowed = false;
                }
            } else if(attribute == "maxlength"){
                // Checking that the value provided is not longer than the maximum length
                 if(response.sanitisedContent.length > structureAttributes["maxlength"]){
                     responseObject.errors.push(propertyName + "'s length exceeded the maximum length of " + structureAttributes["maxlength"]);
                     response.allowed = false;
                 }
            } else if(attribute == "max"){
                // Checking that the value provided is not greater than the maximum value
                if(isNaN(response.sanitisedContent) == false && Number(response.sanitisedContent) > structureAttributes["max"]){
                    responseObject.errors.push(propertyName + "'s length exceeded the maximum value of " + structureAttributes["max"]);
                    response.allowed = false;
                }
            } else if(attribute == "min"){
                // Checking that the value provided is not less than the minimum value
                if(isNaN(response.sanitisedContent) == false && Number(response.sanitisedContent) < structureAttributes["min"]){
                    responseObject.errors.push(propertyName + "'s length was less than the minimum value of " + structureAttributes["min"]);
                    response.allowed = false;
                }
            } else if(attribute == "type"){
                // Checking against input "types"
                if(typeof response.sanitisedContent == "string" || isNaN(response.sanitisedContent) == false){
                    // Switching the type, to determine which checks to preform
                    switch(structureAttributes["type"]){
                        case "file":
                        case "text": {
                            // Making sure the content is a string
                            if(response.sanitisedContent.constructor.name.toLowerCase() != "string"){
                                responseObject.errors.push(propertyName + " contained unexpected data. Expected string.");
                                response.allowed = false;
                            }
                            break;
                        }
                        case "tel":{
                            // Checking that if all "-", " " and "+" symbols are removed, the result
                            // is a number i.e. a valid telephone value
                            if(isNaN(response.sanitisedContent.replace(/-| |\+/g, ""))){
                                responseObject.errors.push(propertyName + " contained unexpected data. Expected telephone number.");
                                response.allowed = false;
                            }
                            break;
                        }
                        case "number":{
                            // Checking if the value is a number
                            if(isNaN(response.sanitisedContent)){
                                responseObject.errors.push(propertyName + " contained unexpected data. Expected number.");
                                response.allowed = false;
                            }
                            break;
                        }
                        case "email": {
                            // Checking that the value resembles an email address
                            if(response.sanitisedContent.indexOf("@") < 0 || response.sanitisedContent.indexOf(".") < 0){
                                responseObject.errors.push(propertyName + " contained unexpected data. Expected email address.");
                                response.allowed = false;
                            }
                        }
                    }
                } else {
                    // Since the value is not a string, then it cannot be stored in a single value
                    responseObject.errors.push(propertyName + " value is not defined to contain anything other than a single value");
                    response.allowed = false;
                }                
            }
        }
    }  
    // Returning the response to the caller
    return response;
}

function checkIfPropertyHasStructure(property, structureProperties, structureType, responseObject){
    // Assuming no structure exists for this property, until one is found
    var structureExists = false;

    // Looping through all of the properties of the structure
    for(var structure in structureProperties){
        // If this structure property matches the one passed to the function,
        // then a structure exists for this property
        if(structure == property){
            structureExists = true;
            break;
        }
    }

    // If no structure exists for this property, then it will be removed once
    // this function returns, so adding the appropriate errors
    if(structureExists == false){
        if(structureType != null){
            // Pusing the error onto the main response object passed to the function,
            // so that it will be included in the response to the user
            responseObject.errors.push(property + " does not have a structure defined for items within this " + structureType);                
        } else {
            // Pusing the error onto the main response object passed to the function,
            // so that it will be included in the response to the user
            responseObject.errors.push(property + " does not have a structure defined and has been removed");
        }
    }

    // Returning the boolean value from the function, so that the caller can remove
    // the property if this check failed
    return structureExists;
}

function validateNewStructure(structureName, structure){
    // Creating a response object, to contain the sanitised structure,
    // any errors that occured, and if this structure is allowed. Generally,
    // the structure will be allowed (as all suspicious or not allowed properties
    // will have been removed, but if the top level structure is deemed incorrect,
    // no update of the structure will be allowed)
    var responseObject = {
        sanitisedStructure: structure,
        errors: [],
        allowed: true
    };

    // Checking that the structure provided is not a string
    if(typeof structure != "string"){
        // Checking if the structure object has and "items" or "attributes" property
        if(responseObject.sanitisedStructure.items != null || responseObject.sanitisedStructure.attributes != null){
            // Storing the result of the structure item validation
            var itemsValidation = validateStructureItem(structureName, responseObject.sanitisedStructure);
            
            // Checking if this item is allowed
            if(itemsValidation.allowed){
                // Setting the santitised structure to that returned from the validation
                responseObject.sanitisedStructure = itemsValidation.sanitisedStructure;
            } else {
                // Setting the entire request to be disallowed
                responseObject.allowed = false;
            }
            // Looping through any errors returned from the validation, and storing them on the
            // response object (to be sent back to the user in the response). Some of these
            // errors may have been resolved (properties removed/sanitised etc) but still
            // want to notify them, as the structure may have changed to reflect these
            for(var i=0; i<itemsValidation.errors.length; i++){
                responseObject.errors.push(itemsValidation.errors[i]);
            }
        } else {
            // Looping through every property in the structure object
            for(var property in responseObject.sanitisedStructure){
                // Storing the result of the structure item validation
                var propertyValidation = validateStructureItem(property, responseObject.sanitisedStructure[property]);
                // Checking if this item is allowed
                if(propertyValidation.allowed){
                    // Setting this property of the santitised structure to that returned from the validation
                    responseObject.sanitisedStructure[property] = propertyValidation.sanitisedStructure;
                } else {
                    // Deleting this property from the structure, as it is not allowed
                    delete responseObject.sanitisedStructure[property];
                    responseObject.errors.push("The '" + property + "' property is not allowed and has been removed");
                }
                // Looping through any errors returned from the validation, and storing them on the
                // response object (to be sent back to the user in the response). Some of these
                // errors may have been resolved (properties removed/sanitised etc) but still
                // want to notify them, as the structure may have changed to reflect these
                for(var i=0; i<propertyValidation.errors.length; i++){
                    responseObject.errors.push(propertyValidation.errors[i]);
                }
            }
        }
    } else {
        // Since this was a string, it may be an attribute of an existing structure item
        if(structureName != null){
            // Checking if this attribute is allowed, and returning this as the boolean
            // for the entire structure check i.e. if this fails, then no update will be allowed
            responseObject.allowed = checkAttributeAllowed(structureName, responseObject.errors);
        } else {
            // This is an unexpected string, with no structure name, and so cannot be allowed
            responseObject.errors.push("This structure is not allowed and has been removed");
            responseObject.allowed = false;
        }
    }    
    
    // Returning the response to the feeds route that requested it
    return responseObject;
}

function validateStructureItem(itemName, itemStructure){
    // Creating a response object, to contain the sanitised content item,
    // any errors that occured, and if this content item is allowed. Generally,
    // the content will be allowed (as all suspicious or not allowed values
    // will have been removed, but if the top level content is deemed incorrect,
    // no update of this content item will be allowed)
    var responseObject = {
        sanitisedStructure: itemStructure,
        errors: [],
        allowed: true
    }

    // If this structure item has attributes/items, then removing any other suspicious 
    // properites at the same level as them
    if(responseObject.sanitisedStructure.attributes != undefined || responseObject.sanitisedStructure.items != undefined){
        responseObject.sanitisedStructure = removeSuspiciousProperties(responseObject.sanitisedStructure, responseObject.errors);
    }

    if(responseObject.sanitisedStructure.attributes != undefined){
        // Removing any suspicious attributes
        responseObject.sanitisedStructure.attributes = removeSuspiciousAttributes(responseObject.sanitisedStructure.attributes, responseObject.errors);
    } else if(responseObject.sanitisedStructure.items != undefined){
        // Looping through all items of the structure
        for(var item in responseObject.sanitisedStructure.items){
            // Calling this function on itself, as each of the "items" in a structure will
            // have attributes and items of their own to be checked
            var itemValidation = validateStructureItem(item, responseObject.sanitisedStructure.items[item]);
            // Checking if this item is allowed
            if(itemValidation.allowed){
                // Setting this item to be equal to tthe sanitised structure returned from the validation
                responseObject.sanitisedStructure.items[item] = itemValidation.sanitisedStructure;
            } else {
                // Since this item is not allowed, deleteing it from the structure's items
                delete responseObject.sanitisedStructure.items[item];
                responseObject.errors.push("The '" + item + "' property is not allowed in items and has been removed");
            }
            // Looping through any errors returned from the validation, and storing them on the
            // response object (to be sent back to the user in the response). Some of these
            // errors may have been resolved (properties removed/sanitised etc) but still
            // want to notify them, as the structure may have changed to reflect these
            for(var i=0; i<itemValidation.errors.length; i++){
                responseObject.errors.push(itemValidation.errors[i]);
            }
        }
    } else {
        // Since this structure has neither attributes not items, then this must be 
        // an attriubute. Checking if this attriubte is allowed
        responseObject.allowed = checkAttributeAllowed(itemName, responseObject.errors);
    }

    // Returning the response to the caller (either the validateNewStructure method, or 
    // a call from within this funciton i.e. for "items")
    return responseObject;
}

function removeSuspiciousAttributes(structureAttributes, feedsErrors){
    // Looping through all attributes of the structure
    for(var attribute in structureAttributes){
        // Checking if this is an allowed attributes
        if(checkAttributeAllowed(attribute, feedsErrors) == false){
            // Deleting this attribute if it is not allowed
            delete structureAttributes[attribute];
        }
    }
    // Returning the updated structure attributes to the caller.
    // No need to return the feeds errors, as this will have been 
    // updated directly
    return structureAttributes;
}

function removeSuspiciousProperties(structure, feedsErrors){
    // Looping through all properties of the structure
    for(var property in structure){
        // Checking if this is an allowed property
        if(checkPropertyAllowed(property, feedsErrors) == false){
            // Deleting this property if it is not allowed
            delete structure[property];
        }
    }
    // Returning the updated structure to the caller.
    // No need to return the feeds errors, as this will have been 
    // updated directly
    return structure;
}

function removeSuspiciousContent(propertyValue, htmlAllowed=false){
    // Creating a temporary variable to store the sanitised content
    var sanitisedContent;

    // Determining the level of sanitising required, based on whether
    // HTML characters are allowed or not
    if(htmlAllowed){
        sanitisedContent = sanitise(propertyValue, false, true);
    } else {
        sanitisedContent = sanitise(propertyValue);
    }

    // Returning the sanitised content to the caller
    return sanitisedContent;
}

function sanitise(data, cssAllowed=false, htmlAllowed=false){
    // Setting the sanitised data to the data provided
    var sanitisedData = data;
    // Checking that the data is not null or undefined, as 
    // none of the checks below will work if it is
    if(sanitisedData != undefined && sanitisedData != null){

        // Parsing the data to a string (to ensure the replace method
        // will work, even if this is a number)
        sanitisedData = sanitisedData.toString();

        // Allowing certain characters if HTML is allowed
        if(htmlAllowed == false){
            sanitisedData = sanitisedData.replace(/(&)(?!(amp|equals|lt|gt|sol|bsol|lcub|rcub|grave|lpar|rpar|lsqb|rbrack|nbsp))/g, "&amp;");
            sanitisedData = sanitisedData.replace(/=/g, "&equals;");
            sanitisedData = sanitisedData.replace(/</g, "&lt;");
            sanitisedData = sanitisedData.replace(/>/g, "&gt;");
            sanitisedData = sanitisedData.replace(/\//g, "&sol;");
            sanitisedData = sanitisedData.replace(/\\/g, "&bsol;");
        }  

        // Allowing curly braces if CSS is allowed
        if(cssAllowed == false){
            sanitisedData = sanitisedData.replace(/{/g, "&lcub;");
            sanitisedData = sanitisedData.replace(/}/g, "&rcub;"); 
        }

        // Removing all instances of the following strings i.e.
        // any opening or closing script tag, and any string that
        // contains "on" and is followed by "=" i.e. "onclick"=
        // "onkeydown=" etc will all be removed
        sanitisedData = sanitisedData.replace(/<script/g, "");
        sanitisedData = sanitisedData.replace(/script>/g, "");
        sanitisedData = sanitisedData.replace(/'on(\w+)'=/g, "");
        sanitisedData = sanitisedData.replace(/"on(\w+)"=/g, "");

        // Replacing all instanceso of the following characters
        // with their HTML entities equivalents
        sanitisedData = sanitisedData.replace(/`/g, "&grave;");
        sanitisedData = sanitisedData.replace(/\(/g, "&lpar;");
        sanitisedData = sanitisedData.replace(/\)/g, "&rpar;");
        sanitisedData = sanitisedData.replace(/\[/g, "&lsqb;");
        sanitisedData = sanitisedData.replace(/\]/g, "&rbrack;");
    }

    // Returning the sanitised data to the caller
    return sanitisedData;
}

function checkAttributeAllowed(attributeName, feedsErrors){
    // Assuming the attribute is allowed until proved otherwise
    var allowed = true;
    // Creating an array of allowed attributes
    var allowedAttributes = ["class", "id", "type", "required", "options", "maxlength", "max", "min", "alt"];
    // Checking if this attribute is in the array of allowed attributes
    if(allowedAttributes.indexOf(attributeName) < 0){
        allowed = false;
        // Since this function will return false, and the attriubute will be removed
        // by the caller, adding the appropriate error to the feeds errors array
        feedsErrors.push("The '" + attributeName + "' attribute is not allowed and has been removed");
    }
    // Returning true/false to the caller, so they know whether to remove the attribute or not
    return allowed;
}

function checkPropertyAllowed(propertyName, feedsErrors){
    // Assuming the property is allowed until proved otherwise
    var allowed = true;
    // Creating an array of allowed properites
    var allowedProperties = ["attributes", "items", "input_type", "type", "no_access"];
    // Checking if this property is in the array of allowed property
    if(allowedProperties.indexOf(propertyName) < 0){
        allowed = false;
        // Since this function will return false, and the property will be removed
        // by the caller, adding the appropriate error to the feeds errors array
        feedsErrors.push("The '" + propertyName + "' property is not allowed and has been removed");
    }
    return allowed;
}

function enumMatch(propertyValue, allowedValues){
    // Assuming that the property does not match any of the allowed values until proven otherwise
    var enumMatch = false;

    // Looping through all of the allowed values to see if this properties
    // value matches one of them
    for(var option of allowedValues){
        if(propertyValue == option){
            enumMatch = true;
        }
    }
    // Returning true/false
    return enumMatch;
}

function jsonToObject(jsonString){
    // Assuming this is not be turned into a valid object, until the
    // attempt to parse the JSON string is successful
    var validJsObject = false;
    var jsObj = {};

    try {
        jsObj = JSON.parse(jsonString);
        validJsObject = true;
    } catch(e) {
        validJsObject = false;
    }

    // Returning true/false
    return validJsObject;
}

function objectToJson(jsObject){
    // Assuming this is cannot be turned into a valid JSON string, until the
    // attempt to stringify the object is successful
    var validJson = false;
    var jsonString = "";

    try {
        jsonString = JSON.stringify(jsObject);
        validJson = true;
    } catch(e) {
        validJson = false;
    }

    // Returning true/false to the caller
    return validJson;
}

function checkAccessLevelAllowedUpdate(structure, accessLevel, responseObject, itemName="this content"){
    // Assuming that this user does not have the appropriate access level to update
    // the content, until proved otherwise
    var allowedUpdate = false;

    // If this users access level is 1 or 2, then they are always allowed update all content.
    // If this contents structure has a "no_access" array attatched to it, then anyone in
    // this array will not be allowed to update this content. Finally, access level 3 is never
    // allowed to update content, as they have "view only" access
    if(accessLevel <= 2 || structure.no_access == null || (structure.no_access != null && accessLevel != 3 && structure.no_access.indexOf(accessLevel) < 0)){
        allowedUpdate = true;
    } else {
        // Pusing the error onto the main response object passed to the function,
        // so that it will be included in the response to the user
        responseObject.errors.push("This user does not have the appropriate access level to update '" + itemName + "'");
    }

    // Returning true/false
    return allowedUpdate;
}

function validateNewContent(content, structure, accessLevel){
    // Creating a response object, to contain the sanitised content,
    // any errors that occured, and if this content is allowed. Generally,
    // the content will be allowed (as all suspicious or not allowed values
    // will have been removed from content items, but if the top level content 
    // is deemed incorrect, no update of this content will be allowed)
    var responseObject = {
        sanitisedContent: content,
        errors: [],
        allowed: true
    };

    // Checking that a valid structure object has been included
    if(typeof structure == "object"){
        // Checking if this structure has "attributes" or "items"
        if(structure.attributes != null || structure.items != null){
            if(content != null){
                // Checking that this user has the appropriate access level to update this content
                if(checkAccessLevelAllowedUpdate(structure, accessLevel, responseObject)){
                    // Checking that the content matches the structure
                    var contentValidation = validateContentAgainstStructure(content, structure, accessLevel);
                    if(contentValidation.allowed){
                        responseObject.sanitisedContent = contentValidation.sanitisedContent;
                    } else {
                        responseObject.sanitisedContent = "";
                        responseObject.allowed = false;
                    }
                    // Looping through any errors returned from the validation, and storing them on the
                    // response object (to be sent back to the user in the response). Some of these
                    // errors may have been resolved (values removed/sanitised etc) but still
                    // want to notify them, as the content may have changed to reflect these
                    for(var i=0; i<contentValidation.errors.length; i++){
                        responseObject.errors.push(contentValidation.errors[i]);
                    }
                } else {
                    responseObject.allowed = false;
                }
            }
        } else {
            if(typeof content != "string"){
                // Looping through all properties of the structure
                for(var property in structure){ 
                    // Checking that this property has either "items" or "attriubtes"
                    if(structure[property].items != null || structure[property].attributes != null){
                        // Checking that the content matches the structure
                        var itemsValidation = validateContentAgainstStructure(content[property], structure[property], accessLevel, property);
                        if(itemsValidation.allowed){
                            responseObject.sanitisedContent[property] = itemsValidation.sanitisedContent;
                        } else {
                            delete responseObject.sanitisedContent[property];
                        }
                        // Looping through any errors returned from the validation, and storing them on the
                        // response object (to be sent back to the user in the response). Some of these
                        // errors may have been resolved (values removed/sanitised etc) but still
                        // want to notify them, as the content may have changed to reflect these
                        for(var i=0; i<itemsValidation.errors.length; i++){
                            responseObject.errors.push(itemsValidation.errors[i]);
                        }
                    } else {
                        // Since this items structure has neither "attributes" or "items" 
                        // then it cannot be updated
                        responseObject.sanitisedContent[property] = "";
                        responseObject.allowed = false;
                    } 
                }                
            } else {
                responseObject.errors.push(property + " contained unexpected content");
                responseObject.allowed = false;
            } 
        }
    } else {
        // Since there appears to be no valid structure for this content, it cannot
        // be created/updated
        responseObject.sanitisedContent = "";
        responseObject.allowed = false;
    }
    

    // Returning the response object to the feeds api
    return responseObject;
}

function validateContentAgainstStructure(content, structure, accessLevel, contentName=null){
    // Creating a response object, to contain the sanitised content,
    // any errors that occured, and if this content is allowed. Generally,
    // the content will be allowed (as all suspicious or not allowed values
    // will have been removed from content items, but if the top level content 
    // is deemed incorrect, no update of this content will be allowed)
    var responseObject = {
        allowed: true,
        errors: [],
        sanitisedContent: content
    };

    // Checking if the content type matches that of the structure (apart from "html"
    // or "link" types, as this will just be strings)
    if(content != null && structure.type != null && structure.type != "html"){
        if(content.constructor.name.toLowerCase() != structure.type){
            responseObject.errors.push("Incorrect content type provided in request. Expected " + structure.type);
            responseObject.allowed = false;
            return responseObject;
        }
    }

    // Checking that the user has to appropriate access level to update this content
    if(checkAccessLevelAllowedUpdate(structure, accessLevel, responseObject, contentName)){
        if(content != null){
            if(structure.attributes != null){
                // Checking if the content matches the attriubtes
                var attributeCheck = checkIfPropertyMatchesAttributes(contentName, content, structure.attributes, structure.type, responseObject);
                if(attributeCheck.allowed){
                    responseObject.sanitisedContent = attributeCheck.sanitisedContent;
                } else {
                    responseObject.allowed = false;
                }
            } else if(structure.items != null){
                // Determing whether these items are to be stored in an array or an object
                // based on whether or not a structure type has been defined (no type = object)
                switch(structure.type){
                    case "array": {
                        // Looping through the content array
                        for(var i=0; i<content.length; i++){
                            
                            // Checking for properties that are not defined
                            for(var itemProperty in content[i]){
                                var structureExists = checkIfPropertyHasStructure(itemProperty, structure["items"], structure.type, responseObject);
                                if(structureExists == false){
                                    // Removing any properties that do not have a structure
                                    delete responseObject.sanitisedContent[i][itemProperty];
                                }
                            }
                            
                            // Checking for properties that are defined
                            for(var property in structure["items"]){
                                if(structure["items"][property]["attributes"] != null){
                                    // If the properties in the items have attriubtes, then checking 
                                    // if the value matches the attriubtes
                                    var attributeCheck = checkIfPropertyMatchesAttributes(property, content[i][property], structure["items"][property]["attributes"], structure["items"][property].type, responseObject);
                                    if(attributeCheck.allowed){
                                        responseObject.sanitisedContent[i][property] = attributeCheck.sanitisedContent;
                                    } else {
                                        responseObject.sanitisedContent[i][property] = "";
                                    }
                                } else if(structure["items"][property]["items"] != null){  
                                    // If the properties in the items have items themselves, then
                                    // calling this function on itself, as these will need to be checked
                                    // seperatley       
                                    var contentValidation = validateContentAgainstStructure(content[i][property], structure["items"][property], accessLevel, property);
                                    if(contentValidation.allowed){
                                        responseObject.sanitisedContent[i][property] = contentValidation.sanitisedContent;
                                    } else {
                                        // Deleting any properties from the array items that are not allowed
                                        delete responseObject.sanitisedContent[i][property];
                                    }
                                    // Looping through any errors returned from the validation, and storing them on the
                                    // response object (to be sent back to the user in the response). Some of these
                                    // errors may have been resolved (values removed/sanitised etc) but still
                                    // want to notify them, as the content may have changed to reflect these
                                    for(var i=0; i<contentValidation.errors.length; i++){
                                        responseObject.errors.push(contentValidation.errors[i]);
                                    }
                                } else {
                                    // Since this items structure had neither "item" nor "attributes", 
                                    // this content cannot be created/updated
                                    responseObject.errors(property + " does not have a structure defined");
                                    delete responseObject.sanitisedContent[i][property];
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
                                // Removing any properties that do not have a structure defined
                                delete responseObject.sanitisedContent[key];
                            }                     
                        }
                        // Checking for properties that are defined
                        for(var property in structure["items"]){
                            // Checking that the user has the appropriate access level to update
                            // the next level of content
                            if(checkAccessLevelAllowedUpdate(structure["items"][property], accessLevel, responseObject, property)){
                                if(structure["items"][property]["attributes"] != null){
                                    // If the property in the items has attriubtes, then checking if the content
                                    // matches the attriubtes
                                    var attributeCheck = checkIfPropertyMatchesAttributes(property, content[property], structure["items"][property]["attributes"], structure["items"][property].type, responseObject);
                                    if(attributeCheck.allowed){
                                        responseObject.sanitisedContent[property] = attributeCheck.sanitisedContent;
                                    } else {
                                        responseObject.sanitisedContent[property] = "";
                                    }
                                } else if(structure["items"][property]["items"] != null){
                                    // If the properties in the items have items themselves, then
                                    // calling this function on itself, as these will need to be checked
                                    // seperatley 
                                    var contentValidation = validateContentAgainstStructure(content[property], structure["items"][property], accessLevel, property);
                                    if(contentValidation.allowed){
                                        responseObject.sanitisedContent[property] = contentValidation.sanitisedContent;
                                    } else {
                                        // Deleting this property from the content, as it is not allowed
                                        delete responseObject.sanitisedContent[property];
                                    }
                                    // Looping through any errors returned from the validation, and storing them on the
                                    // response object (to be sent back to the user in the response). Some of these
                                    // errors may have been resolved (values removed/sanitised etc) but still
                                    // want to notify them, as the content may have changed to reflect these
                                    for(var i=0; i<contentValidation.errors.length; i++){
                                        responseObject.errors.push(contentValidation.errors[i]);
                                    }
                                } else {
                                    // Since this items structure had neither "item" nor "attributes", 
                                    // this content cannot be created/updated
                                    delete responseObject.sanitisedContent[property];
                                    responseObject.errors.push(property + " does not have a structure defined and has been removed");
                                }
                            } else {
                                // This user did not have permission to update/create this content
                                // An error will already have been added to the response object
                                delete content[property];
                            }
                        }
                        break;
                    }
                }
            }  else {
                // Since this items structure doesnt have "attributes" or "items", it cannot be
                // updated or created
                responseObject.errors.push("This content does not have a structure defined");
                responseObject.allowed = false;
            }
        }
    } else {
        // Since this user does not have the appropriate access level to update this
        // content, the update is not allowed (an error will already have been added
        // to the response object)
        responseObject.allowed = false;
    }

    // Returning the response object to the caller (either the validateNewContent method,
    // or a call from within this function)
    return responseObject;
}

// Setting the module exports to be an object, with all of the functions
// that will be used outside of this module (some functions will remain
// private and will not be included)
module.exports = {
    validateNewStructure: validateNewStructure,
    validateNewContent: validateNewContent,
    jsonToObject: jsonToObject,
    objectToJson: objectToJson,
    sanitise: sanitise
};