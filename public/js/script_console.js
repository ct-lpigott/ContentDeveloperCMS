function updateProjectHTML(projectDetails, includeContent=true){
    projectStructure = projectDetails.structure;
    var projectContent = projectDetails.content;
    var projectContentContainer = document.getElementById("projectContent");
    projectContentContainer.innerHTML = "";

    for(var collection in projectStructure){
        var collectionContainer = document.createElement("div");
        collectionContainer.setAttribute("class", "collection " + collection);
        collectionContainer.setAttribute("data-collection", collection);

        var collectionHeading = document.createElement("h3");
        collectionHeading.innerHTML = upperCamelCaseAll(underscoreToSpace(collection));
        collectionContainer.appendChild(collectionHeading);
        switch(projectStructure[collection].type){
            case "array": {
                if(includeContent){
                    var itemIndex = 0;
                    for(var item in projectContent[collection]){
                        var itemContainerElement = createItemInputElements(collection, projectContent[collection][item], itemIndex);
                        collectionContainer.appendChild(itemContainerElement);

                        itemIndex++;
                    }
                } else {
                    var itemContainerElement = createItemInputElements(collection, null, 0);
                    collectionContainer.appendChild(itemContainerElement);
                }
                
                var addButtonElement = document.createElement("button");
                addButtonElement.innerHTML = "Add " + collection;
                addButtonElement.setAttribute("class", "add");
                collectionContainer.appendChild(addButtonElement);
                break;
            }
            case "object":{
                if(includeContent && projectContent[collection] != null){
                    var itemIndex = 0;
                    for(var item in projectContent[collection]){
                        var itemContainerElement = createItemInputElements(collection, projectContent[collection][item], itemIndex);
                        collectionContainer.appendChild(itemContainerElement);

                        itemIndex++;
                    }
                } else {
                    var itemContainerElement = createItemInputElements(collection, null, 0);
                    collectionContainer.appendChild(itemContainerElement);
                }
                break;
            }
            default: {
                var elementValue = includeContent ? projectContent[collection] : null;
                var itemContainerElement = createItemInputElements(collection, elementValue, 0);
                collectionContainer.appendChild(itemContainerElement);
                break;
            }
        }
        projectContentContainer.appendChild(collectionContainer);
    }
}

function createItemInputElements(collection, itemContent=null, itemIndex=-1){
    var itemContainerElement = document.createElement("div");
    for(var itemDefinition in projectStructure[collection]){  
        itemContainerElement.setAttribute("class", "item-container " + collection + "-item");
        if(projectStructure[collection]["items"] != null){
            for(var itemInput in projectStructure[collection][itemDefinition]){
                if(projectStructure[collection][itemDefinition][itemInput]["input_type"] != null){
                    var itemID = collection + "-" + itemIndex + "-" + itemInput;

                    var newLabel = document.createElement("label");
                    newLabel.innerHTML = upperCamelCaseAll(underscoreToSpace(itemInput));
                    newLabel.setAttribute("for", itemID);

                    var newElement = document.createElement(projectStructure[collection][itemDefinition][itemInput]["input_type"]);
                    newElement.setAttribute("data-collection", collection);
                    newElement.setAttribute("data-index", itemIndex);
                    newElement.setAttribute("data-key", itemInput);
                    newElement.setAttribute("id", itemID);
                    
                    for(var inputAttribute in projectStructure[collection][itemDefinition][itemInput]["attributes"]){
                        if(inputAttribute != "options"){
                            newElement.setAttribute(inputAttribute, projectStructure[collection][itemDefinition][itemInput]["attributes"][inputAttribute]);
                        }
                    }
                    
                    switch(projectStructure[collection][itemDefinition][itemInput]["input_type"]){
                        case "select": {
                            for(var option of projectStructure[collection][itemDefinition][itemInput]["attributes"]["options"]){
                                var newOption = document.createElement("option");
                                newOption.innerHTML = upperCamelCaseAll(underscoreToSpace(option));
                                newOption.setAttribute("value", option);
                                if(itemContent != null && itemContent[itemInput] != null){
                                    if(option == itemContent[itemInput]){
                                        newOption.setAttribute("selected", "selected");
                                    }
                                }
                                newElement.appendChild(newOption);
                            }
                            break;
                        }
                        default: {
                            if(itemContent != null && itemContent[itemInput] != null){
                                newElement.setAttribute("value", itemContent[itemInput]);
                            }
                            break;
                        }
                    }
                    
                    itemContainerElement.appendChild(newLabel);
                    itemContainerElement.appendChild(newElement);
                }                            
            }
        } else if(projectStructure[collection]["attributes"] != null){
            var inputType = projectStructure[collection]["attributes"]["type"];
            var itemID = collection + "-0";

            var newLabel = document.createElement("label");
            newLabel.innerHTML = upperCamelCaseAll(underscoreToSpace(collection));
            newLabel.setAttribute("for", itemID);

            var newInputElement = document.createElement("input");
            newInputElement.setAttribute("data-collection", collection);
            newInputElement.setAttribute("id", itemID);
            newInputElement.setAttribute("type", inputType);
            
            for(var inputAttribute in projectStructure[collection]["attributes"]){
                newInputElement.setAttribute(inputAttribute, projectStructure[collection]["attributes"][inputAttribute]);
            }
            if(itemContent != null){
                newInputElement.setAttribute("value", itemContent);
            }

            itemContainerElement.appendChild(newLabel);
            itemContainerElement.appendChild(newInputElement);
        }              
                                
    }

    if(itemContent != null && projectStructure[collection]["items"] != null){
        var deleteButtonElement = document.createElement("button");
        deleteButtonElement.innerHTML = "Delete";
        deleteButtonElement.setAttribute("class", "delete");
        itemContainerElement.appendChild(deleteButtonElement);
    }

    return itemContainerElement;
}

function getProjectCollaborators(){
    sendAjaxRequest("/feeds/" + projectID + "?action=getCollaborators", {}, function(responseObject){
        updateProjectCollaborators(responseObject)
    });
}

function updateProjectCollaborators(collaborators){
    var collaboratorsTableBody = document.getElementById("collaborators").getElementsByTagName("tbody")[0];
    collaboratorsTableBody.innerHTML = "";

    for(var i=0; i < collaborators.length; i++){
        var newRow = document.createElement("tr");

        var nameTdElement = document.createElement("td");
        nameTdElement.innerHTML = collaborators[i].display_name;

        var accessLevelNameTdElement = document.createElement("td");
        accessLevelNameTdElement.innerHTML = collaborators[i].access_level_name;

        var accessLevelIntTdElement = document.createElement("td");
        accessLevelIntTdElement.innerHTML = collaborators[i].access_level_int;

        var removeCollaboratorTdElement = document.createElement("td");
        var removeCollaboratorButtonElement = document.createElement("button");
        removeCollaboratorButtonElement.innerHTML = "x";
        removeCollaboratorButtonElement.setAttribute("class", "removeCollaborator");
        removeCollaboratorButtonElement.setAttribute("data-userID", collaborators[i].user_id);
        removeCollaboratorTdElement.appendChild(removeCollaboratorButtonElement);

        newRow.appendChild(nameTdElement);
        newRow.appendChild(accessLevelNameTdElement);
        newRow.appendChild(accessLevelIntTdElement);
        newRow.appendChild(removeCollaboratorTdElement);

        collaboratorsTableBody.appendChild(newRow);
    }
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

function getAccessLevels(){
    sendAjaxRequest("/feeds/" + projectID + "?action=getAccessLevels", {}, function(responseObject){
        var accessLevelSelect = document.getElementById("accessLevel");

        for(var accessLevel of responseObject){
            var newOption = document.createElement("option");
            newOption.innerHTML = accessLevel.access_level_name;
            newOption.setAttribute("value", accessLevel.id);
            accessLevelSelect.appendChild(newOption);
        }
    });
}

function addClass(element, className){
    element.className += " " + className;
}

function removeClass(element, className){
    var elementClasses = element.className.split(" ");
    for(var i=0; i<elementClasses.length; i++){
        if(elementClasses[i] == className){
            elementClasses.splice(i, 1);
        }
    }
    element.className = elementClasses.join(" ");
}

function hasClass(element, className){
    var elementHasClass = false;
    var elementClasses = element.className.split(" ");
    for(var i=0; i<elementClasses.length; i++){
        if(elementClasses[i] == className){
            elementHasClass = true;
        }
    }
    return elementHasClass;
}