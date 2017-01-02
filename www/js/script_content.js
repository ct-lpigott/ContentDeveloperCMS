var userID;
var projectID;

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
    }
}

function updateProjectHTML(projectDetails){
    var projectContentContainer = document.getElementById("projectContent");
    var projectStructure = projectDetails.projectStructure;
    var projectContent = projectDetails.projectContent;

    for(var collection in projectStructure){
        var collectionHeading = document.createElement("h3");
        collectionHeading.innerHTML = collection;
        projectContentContainer.appendChild(collectionHeading);
        switch(projectStructure[collection].type){
            case "array": {
                for(var item in projectContent[collection]){
                    for(var itemDefinition in projectStructure[collection]){                       
                        for(var itemInput in projectStructure[collection][itemDefinition]){
                            if(projectStructure[collection][itemDefinition][itemInput]["input_type"] != null){
                                var newElement = document.createElement(projectStructure[collection][itemDefinition][itemInput]["input_type"]);
                                for(var inputAttribute in projectStructure[collection][itemDefinition][itemInput]["attributes"]){
                                    newElement.setAttribute(inputAttribute, projectStructure[collection][itemDefinition][itemInput]["attributes"][inputAttribute]);
                                }
                                if(projectContent[collection][item][itemInput] != null){
                                    switch(projectStructure[collection][itemDefinition][itemInput]["input_type"]){
                                        case "select": {
                                            console.log(projectStructure[collection][itemDefinition][itemInput]);
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
                                projectContentContainer.appendChild(newElement);
                            }                            
                        }                        
                    }
                    projectContentContainer.appendChild(document.createElement("br"));
                }
            }
        }
    }
}