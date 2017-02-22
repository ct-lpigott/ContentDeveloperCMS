var userID;
var projectID;
var projectStructure;
var draggingElement;
var dragStartY;
var imagePreviewContainer;
var imagePreviewContainerNext;
var content;
var projectContentContainer;

function customContentWindowOnload(){
    userID = document.getElementById("userID").value;
    projectID = document.getElementById("projectID").value;
    projectContentContainer = document.getElementById("projectCollectionsContent");
    sendAjaxRequest("/feeds/" + projectID, {}, function(responseObject){
        updateProjectHTML(responseObject);
        refreshDraggableContainers();
        getProjectHistory(true);
    });   
}

function customContentSetupEventListeners(){
    
}

function customContentClickEventHandler(e){
    if(e.target.id == "next"){
        var inputName = imagePreviewContainer.getAttribute("data-for_input");
        var currentInput =  document.getElementById(inputName);
        var inputViewImagesButton = currentInput.parentNode.getElementsByClassName("viewImages")[0];
        inputViewImagesButton.click();
        document.getElementsByClassName("viewImages");
    } else if(hasClass(e.target, "viewImages") == false){
        hide(imagePreviewContainer);
    }
    
    switch(e.target.id){
        case "updateProjectContent": {
            uploadFiles(function(){
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
            });             
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
        var collectionContainer = projectContentContainer.getElementsByClassName("collection " + collection)[0];
        var draggableContainer = collectionContainer.getElementsByClassName("draggableContainer")[0];
        var newItemIndex = projectContentContainer.querySelectorAll(".item-container." + collection + "-item").length;
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

        hide(projectContentContainer.getElementsByClassName("visible")[0]);
        show(projectContentContainer.getElementsByClassName(collectionToActivate)[0]);
    } else if(hasClass(e.target, "previewHistory")){
        previewCommitHistory(e.target);
    }
}

function uploadFiles(cb){
    var fileInputs = projectContentContainer.querySelectorAll("input[type='file']");
    var totalUploaded = 0;

    if(fileInputs.length > 0){
        for(var i=0; i<fileInputs.length; i++){
            if(fileInputs[i].files.length > 0){
                uploadFile(fileInputs[i], function(){
                    totalUploaded++;
                    
                    if(totalUploaded == fileInputs.length){
                        cb();
                    }
                });
            } else {
                totalUploaded++;
            }
            if(totalUploaded == fileInputs.length){
                cb();
            }        
        }
    } else {
        cb();
    }
}

function uploadFile(fileInput, cb){
    console.log(fileInput.files[0]);
    sendAjaxRequest("/feeds/" + projectID + "?action=uploadFile", {file: fileInput.files[0]}, function(responseObject){
        fileInput.setAttribute("data-file_url", responseObject.fileUrl);
        updateThumbnailImage(fileInput, responseObject.fileUrl);
        cb();
    }, "POST");
}

function parseProjectContentToJSON(){
    var projectContent = {};

    for(var collection in projectStructure){
        switch(projectStructure[collection].type){
            case "object":
            case "array": {
                projectContent[collection] = projectStructure[collection].type == "object" ? {} : [];
                var collectionItems = projectContentContainer.getElementsByClassName(collection + "-item");

                for(var i=0; i < collectionItems.length; i++){
                    var itemElements = collectionItems[i].querySelectorAll("[data-key]");
                    var itemDetails = {};
                    
                    for(var e=0; e < itemElements.length; e++){
                        if(projectStructure[collection].type == "object"){
                            projectContent[collection][itemElements[e].getAttribute("data-key")] = itemElements[e].value;
                        } else {
                            itemDetails[itemElements[e].getAttribute("data-key")] = itemElements[e].value;
                        }
                        
                    }

                    if(projectStructure[collection].type == "array"){
                        projectContent[collection].push(itemDetails);
                    }
                }
                break;
            }
            case "html":{
                var collectionItem = projectContentContainer.querySelector("#" + collection + "-0");
                projectContent[collection] = collectionItem.innerHTML.toString().replace(/\"/g, "'");
                break;
            }
            default: {
                var inputElement = projectContentContainer.querySelector("#" + collection + "-0");
                if(inputElement != null){
                    if(inputElement.getAttribute("type") == "file"){
                        projectContent[collection] = inputElement.getAttribute("data-file_url");
                    } else {
                        projectContent[collection] = inputElement.value;
                    }
                }
                
                break;

            }
        }
    }
    
    return JSON.stringify(projectContent);
}