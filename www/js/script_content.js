var userID;
var projectID;
var projectStructure;

function customWindowOnload(){
    userID = document.getElementById("userID").value;
    projectID = document.getElementById("projectID").value;
    sendAjaxRequest("/feeds/" + userID + "/" + projectID, {}, function(responseObject){
        updateProjectHTML(responseObject);
    });   
}

function customSetupEventListeners(){
    
}

function customClickEventHandler(e){
    switch(e.target.id){
        case "updateProjectContent": {
            var projectContent = parseProjectContentToJSON();
            sendAjaxRequest("/feeds/" + userID + "/" + projectID, {projectContent: projectContent}, function(responseObject){
                
            }, "PUT");  
            break;
        }
        case "resetProjectContent": {
           sendAjaxRequest("/feeds/" + userID + "/" + projectID, {}, function(responseObject){
               updateProjectHTML(responseObject);
            });  
        }
    }

    if(e.target.classList.contains("add")){
        var collection = e.target.parentNode.getAttribute("data-collection");
        var collectionContainer = document.querySelector(".collection." + collection);
        var newItemIndex = document.querySelectorAll(".item-container." + collection + "-item").length;
        var newItemContainerElement = createItemInputElements(collection, null, newItemIndex);
        collectionContainer.insertBefore(newItemContainerElement, e.target);
    } else if(e.target.classList.contains("delete")){
        var collection = e.target.parentNode.querySelector("[data-collection]").getAttribute("data-collection");
        var itemIndex = e.target.parentNode.querySelector("[data-index]").getAttribute("data-index");
        sendAjaxRequest("/feeds/" + userID + "/" + projectID + "/" + collection + "/" + itemIndex, {}, function(responseObject){
            e.target.parentNode.remove();
        }, "DELETE");
    }
}

function updateProjectHTML(projectDetails){
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
                var itemIndex = 0;
                for(var item in projectContent[collection]){
                    var itemContainerElement = createItemInputElements(collection, projectContent[collection][item], itemIndex);
                    collectionContainer.appendChild(itemContainerElement);

                    itemIndex++;
                }

                var addButtonElement = document.createElement("button");
                addButtonElement.innerHTML = "Add " + collection;
                addButtonElement.setAttribute("class", "add");
                collectionContainer.appendChild(addButtonElement);

                projectContentContainer.appendChild(collectionContainer);
            }
        }
    }
}

function parseProjectContentToJSON(){
    var projectContent = {};

    var projectContentContainer = document.getElementById("projectContent");

    for(var collection in projectStructure){
        switch(projectStructure[collection].type){
            case "array": {
                projectContent[collection] = [];
                var numCollectionItems = document.getElementsByClassName(collection + "-item").length;

                for(var i=0; i < numCollectionItems; i++){
                    var itemElements = projectContentContainer.querySelectorAll("[data-collection='" + collection +"'][data-index='" + i + "']");
                    var itemDetails = {};
                    
                    for(var e=0; e < itemElements.length; e++){
                        itemDetails[itemElements[e].getAttribute("data-key")] = itemElements[e].value;
                    }
                    projectContent[collection].push(itemDetails);
                }
            }
        }
    }
    

    return JSON.stringify(projectContent);
}

function createItemInputElements(collection, itemContent=null, itemIndex=-1){
    var itemContainerElement = document.createElement("div");
    for(var itemDefinition in projectStructure[collection]){  
        itemContainerElement.setAttribute("class", "item-container " + collection + "-item");                     
        for(var itemInput in projectStructure[collection][itemDefinition]){
            if(projectStructure[collection][itemDefinition][itemInput]["input_type"] != null){
                var newElement = document.createElement(projectStructure[collection][itemDefinition][itemInput]["input_type"]);
                newElement.setAttribute("data-collection", collection);
                newElement.setAttribute("data-index", itemIndex);
                newElement.setAttribute("data-key", itemInput);
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
                
                itemContainerElement.appendChild(newElement);
            }                            
        }                        
    }
    var deleteButtonElement = document.createElement("button");
    deleteButtonElement.innerHTML = "Delete";
    deleteButtonElement.setAttribute("class", "delete");
    itemContainerElement.appendChild(deleteButtonElement);

    return itemContainerElement;
}