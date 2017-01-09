function updateProjectHTML(projectDetails, includeContent=true){
    projectStructure = projectDetails.projectStructure;
    var projectContent = projectDetails.projectContent;
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
            default: {
                var itemContainerElement = createItemInputElements(collection, null, 0);
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
                    
                    for(var inputAttribute in projectStructure[collection][itemDefinition][itemInput]["attributes"] && itemContent != null){
                        newElement.setAttribute(inputAttribute, projectStructure[collection][itemDefinition][itemInput]["attributes"][inputAttribute]);
                    }
                    
                    switch(projectStructure[collection][itemDefinition][itemInput]["input_type"]){
                        case "select": {
                            for(var option in projectStructure[collection][itemDefinition][itemInput]["options"]){
                                var newOption = document.createElement("option");
                                newOption.innerHTML = projectStructure[collection][itemDefinition][itemInput]["options"][option];
                                if(itemContent != null && itemContent[itemInput] != null){
                                    if(projectStructure[collection][itemDefinition][itemInput]["options"][option] == itemContent[itemInput]){
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
            
            for(var inputAttribute in projectStructure[collection]["attributes"] && itemContent != null){
                newElement.setAttribute(inputAttribute, projectStructure[collection]["attributes"][inputAttribute]);
            }

            itemContainerElement.appendChild(newLabel);
            itemContainerElement.appendChild(newInputElement);
        }              
                                
    }

    if(itemContent != null){
        var deleteButtonElement = document.createElement("button");
        deleteButtonElement.innerHTML = "Delete";
        deleteButtonElement.setAttribute("class", "delete");
        itemContainerElement.appendChild(deleteButtonElement);
    }

    return itemContainerElement;
}