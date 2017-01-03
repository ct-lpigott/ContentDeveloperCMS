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
                updateProjectHTML(responseObject);
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
        var collection = e.target.parentNode.querySelector("[data-collection]").getAttribute("data-collection");
        console.log(collection);
    } else if(e.target.classList.contains("delete")){
        e.target.parentNode.remove();
    }
}

function updateProjectHTML(projectDetails){
    projectStructure = projectDetails.projectStructure;
    var projectContent = projectDetails.projectContent;
    var projectContentContainer = document.getElementById("projectContent");
    projectContentContainer.innerHTML = "";

    for(var collection in projectStructure){
        var collectionHeading = document.createElement("h3");
        collectionHeading.innerHTML = upperCamelCaseAll(underscoreToSpace(collection));
        projectContentContainer.appendChild(collectionHeading);
        switch(projectStructure[collection].type){
            case "array": {
                var itemIndex = 0;
                for(var item in projectContent[collection]){
                    for(var itemDefinition in projectStructure[collection]){  
                        var itemContainerElement = document.createElement("div");
                        itemContainerElement.setAttribute("class", "item-container " + collection + "-item");                     
                        for(var itemInput in projectStructure[collection][itemDefinition]){
                            if(projectStructure[collection][itemDefinition][itemInput]["input_type"] != null){
                                var newElement = document.createElement(projectStructure[collection][itemDefinition][itemInput]["input_type"]);
                                newElement.setAttribute("data-collection", collection);
                                newElement.setAttribute("data-index", itemIndex);
                                newElement.setAttribute("data-key", itemInput);
                                for(var inputAttribute in projectStructure[collection][itemDefinition][itemInput]["attributes"]){
                                    newElement.setAttribute(inputAttribute, projectStructure[collection][itemDefinition][itemInput]["attributes"][inputAttribute]);
                                }
                                if(projectContent[collection][item][itemInput] != null){
                                    switch(projectStructure[collection][itemDefinition][itemInput]["input_type"]){
                                        case "select": {
                                            for(var option in projectStructure[collection][itemDefinition][itemInput]["options"]){
                                                var newOption = document.createElement("option");
                                                newOption.innerHTML = projectStructure[collection][itemDefinition][itemInput]["options"][option];
                                                if(projectStructure[collection][itemDefinition][itemInput]["options"][option] == projectContent[collection][item][itemInput]){
                                                    newOption.setAttribute("selected", "selected");
                                                }
                                                newElement.appendChild(newOption);
                                            }
                                            break;
                                        }
                                        default: {
                                            newElement.setAttribute("value", projectContent[collection][item][itemInput]);
                                            break;
                                        }
                                    }
                                }
                                
                                itemContainerElement.appendChild(newElement);
                                projectContentContainer.appendChild(itemContainerElement);
                            }                            
                        }                        
                    }
                    var deleteButtonElement = document.createElement("button");
                    deleteButtonElement.innerHTML = "Delete";
                    deleteButtonElement.setAttribute("class", "delete");
                    itemContainerElement.appendChild(deleteButtonElement);

                    projectContentContainer.appendChild(document.createElement("br"));
                    itemIndex++;
                }

                var addButtonElement = document.createElement("button");
                addButtonElement.innerHTML = "Add " + collection;
                addButtonElement.setAttribute("class", "add");
                projectContentContainer.appendChild(addButtonElement);
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