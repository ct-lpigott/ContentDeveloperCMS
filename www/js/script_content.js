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
                break;
            }
            default: {
                projectContent[collection] = document.getElementById(collection + "-0").value;
                break;

            }
        }
    }
    

    return JSON.stringify(projectContent);
}