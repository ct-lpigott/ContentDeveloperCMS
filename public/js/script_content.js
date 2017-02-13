var userID;
var projectID;
var projectStructure;
var draggingElement;
var dragStartY;

function customWindowOnload(){
    userID = document.getElementById("userID").value;
    projectID = document.getElementById("projectID").value;
    sendAjaxRequest("/feeds/" + projectID, {}, function(responseObject){
        updateProjectHTML(responseObject);
        refreshDraggableContainers();
        getProjectHistory(true);
    });   
}

function customSetupEventListeners(){
    
}

function customClickEventHandler(e){
    switch(e.target.id){
        case "updateProjectContent": {
            var projectContent = parseProjectContentToJSON();
            if(jsonToObject(projectContent)){
                var requestBodyParams = {content: projectContent};
                
                if(e.target.getAttribute("data-short_commit_id") != null){
                    requestBodyParams.short_commit_id = e.target.getAttribute("data-short_commit_id");
                }

                sendAjaxRequest("/feeds/" + projectID, requestBodyParams, function(responseObject){
                    getProjectHistory(true);
                    if(e.target.getAttribute("data-short_commit_id") != null){
                        e.target.removeAttribute("data-short_commit_id");
                    }
                }, "PUT");
            } else {
                console.log("There is an issue with this content");
            }
             
            break;
        }
        case "resetProjectContent": {
           sendAjaxRequest("/feeds/" + projectID, {}, function(responseObject){
               updateProjectHTML(responseObject);
               if(document.getElementById("projectContentHistory").getElementsByClassName("selected")[0] != undefined){
                    removeClass(document.getElementById("projectContentHistory").getElementsByClassName("selected")[0], "selected");
               }
               document.getElementById("updateProjectContent").removeAttribute("data-short_commit_id");
            });  
        }
    }

    if(hasClass(e.target, "add")){
        var collection = e.target.parentNode.getAttribute("data-collection");
        var collectionContainer = document.getElementsByClassName("collection " + collection)[0];
        var draggableContainer = collectionContainer.getElementsByClassName("draggableContainer")[0];
        var newItemIndex = document.querySelectorAll(".item-container." + collection + "-item").length;
        var newItemContainerElement = createItemInputElements(collection, null, newItemIndex);
        draggableContainer.append(newItemContainerElement);
        refreshDraggableContainerChildren(draggableContainer);
    } else if(hasClass(e.target, "delete")){
        var collection = e.target.parentNode.querySelector("[data-collection]").getAttribute("data-collection");
        var itemIndex = e.target.parentNode.querySelector("[data-index]").getAttribute("data-index");
        sendAjaxRequest("/feeds/" + projectID + "/" + collection + "/" + itemIndex, {}, function(responseObject){
            e.target.parentNode.remove();
            getProjectHistory(true);
        }, "DELETE");
    } else if(e.target.parentNode.id == "projectCollections"){
        var collectionToActivate = e.target.getAttribute("for-collection");
        console.log(collectionToActivate);
        removeClass(e.target.parentNode.getElementsByClassName("active")[0], "active");
        addClass(e.target, "active");

        removeClass(document.getElementById("projectCollectionsContent").getElementsByClassName("visible")[0], "visible");
        addClass(document.getElementById("projectCollectionsContent").getElementsByClassName(collectionToActivate)[0], "visible");
    } else if(hasClass(e.target, "previewHistory")){
        previewCommitHistory(e.target);
    }
}

function parseProjectContentToJSON(){
    var projectContent = {};

    var projectContentContainer = document.getElementById("projectCollectionsContent");

    for(var collection in projectStructure){
        switch(projectStructure[collection].type){
            case "array": {
                projectContent[collection] = [];
                var collectionItems = document.getElementsByClassName(collection + "-item");

                for(var i=0; i < collectionItems.length; i++){
                    var itemElements = collectionItems[i].querySelectorAll("[data-key]");
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