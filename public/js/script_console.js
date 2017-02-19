function updateProjectHTML(projectDetails, includeContent=true){
    // Every time the project HTML is updated, updating the global projectStructure
    // variable, as it will be used for pulling the content from the content admin
    // page, and rebuilding it back into a JSON object 
    projectStructure = projectDetails.structure;
    var projectContent = projectDetails.content;

    if(includeContent){
        imagePreviewContainer = document.getElementById("imagePreviewContainer");
        imagePreviewContainerNext = document.getElementById("next");
        var projectCollections = document.getElementById("projectCollections");
        projectCollections.innerHTML = "";
        document.getElementById("projectCollectionsContent").innerHTML = "";
    } else {
        document.getElementById("projectContent").innerHTML = "";
        document.getElementById("projectContent").setAttribute("class", "draggableContainer");
    }

    // Looping through every collection contained in the project structure
    for(var collection in projectStructure){

        // Creating a container for this collection
        var collectionContainer = document.createElement("div");
        collectionContainer.setAttribute("class", "collection " + collection);
        collectionContainer.setAttribute("data-collection", collection);

        // Checking whether or not content is being displayed
        if(includeContent){
            // Creating the side bar nav button for this collection
            var collectionNavButton = document.createElement("button");
            collectionNavButton.setAttribute("for-collection", collection);
            collectionNavButton.innerHTML = upperCamelCaseAll(underscoreToSpace(collection));
            projectCollections.appendChild(collectionNavButton);
        }

        // Creating the heading for this collection
        var collectionHeading = document.createElement("h3");
        collectionHeading.innerHTML = upperCamelCaseAll(underscoreToSpace(collection));
        collectionContainer.appendChild(collectionHeading);
        
        // Determining what type of object this will be stored as i.e. array, object or other
        switch(projectStructure[collection]["type"]){
            case "array": {
                // Checking whether content will be displayed or not
                if(includeContent){
                    // Creating an item index, which will be increased with each itteration of the Looping
                    // below, to define the item index of each item in the array (so that it can be used to
                    // delete the item individually later on)
                    var itemIndex = 0;

                    // Creating individual draggable containers for each of the items in the array
                    var draggableContainerElement = document.createElement("div");
                    draggableContainerElement.setAttribute("class", "draggableContainer");
                    collectionContainer.appendChild(draggableContainerElement);

                    // Looping through each of the items that current exist in the content file of the 
                    // project, creating a new container and elements for each one 
                    for(var item in projectContent[collection]){
                        var itemContainerElement = createItemInputElements(collection, projectContent[collection][item], itemIndex);
                        draggableContainerElement.appendChild(itemContainerElement);

                        itemIndex++;
                    }
                } else {
                    // Since no content is to be displayed, creating empty inputs for this collection
                    // i.e. to be displayed as a preview in the admin JSON preview panel
                    var itemContainerElement = createItemInputElements(collection, null, 0);
                    collectionContainer.appendChild(itemContainerElement);
                }
                
                // Creating an "add" button, so that new elements can be added to this array
                var addButtonElement = document.createElement("button");
                addButtonElement.innerHTML = "Add " + collection;
                addButtonElement.setAttribute("class", "add");
                collectionContainer.appendChild(addButtonElement);
                break;
            }
            case "object":{
                // Checking whether content is to be displayed, and if content currently exists
                // for this collection
                if(includeContent && projectContent[collection] != null){
                    var itemIndex = 0;
                    for(var item in projectContent[collection]){
                        var itemContainerElement = createItemInputElements(collection, projectContent[collection][item], itemIndex);
                        collectionContainer.appendChild(itemContainerElement);

                        itemIndex++;
                    }
                } else {
                    // Since the content is not to be displayed, or no content currently exists for this
                    // collection, creating empty input elmenets for this collection
                    var itemContainerElement = createItemInputElements(collection, null, 0);
                    collectionContainer.appendChild(itemContainerElement);
                }
                break;
            }
            default: {
                // Since this is neither an array or an object, this content will be stored as a property
                // which will contain no items within it
                var elementValue = includeContent ? projectContent[collection] : null;
                var itemContainerElement = createItemInputElements(collection, elementValue, 0);
                collectionContainer.appendChild(itemContainerElement);
                break;
            }
        }

        // Determining where to append the collection to, depending on whether the content
        // is being displayed within it or not
        if(includeContent){
            document.getElementById("projectCollectionsContent").appendChild(collectionContainer);
        } else {
            document.getElementById("projectContent").appendChild(collectionContainer);
        }
    }
    
    // Determining whether to highlight an active category, depending on whether or not the content
    // is being included or not
    if(includeContent){
        // Checking that there is at least one collection defined within this project
        if(projectCollections.children.length > 0){
            // Setting the first collection of the project to be active in the sidebar navigation, as
            // well as making the content visible in the project content panel
            addClass(projectCollections.children[0], "active");
            addClass(document.getElementById("projectCollectionsContent").children[0], "visible");
        }
    }

    // Refreshing the draggable containers, so that each element in a draggable container will
    // have the "draggable" attribute, and each container will have the appropriate event listeners
    // set up on it 
    refreshDraggableContainers();    
}

function createItemInputElements(collection, itemContent=null, itemIndex=-1){
    // Creaing a container to hold all the elements for this item
    var itemContainerElement = document.createElement("div");
    itemContainerElement.setAttribute("class", "item-container " + collection + "-item");

    // Checking if this structure has "attributes", "items" or itself is the definition
    // for the content
    if(projectStructure[collection]["attributes"] != null){ 
        // Determining the element which will be used to request input for this
        // collection i.e. either the one defined in the project structure, 
        // or <input> as a default 
        var elementType = projectStructure[collection]["input_type"] || "input";

        // Defaulting the item id of this input to be the collection name with "0" appended
        // as a collection that has attributes will only ever have itself i.e. it will
        // no contain multiple items, in the way that an array would
        var itemID = collection + "-0";
        
        // Creating a label for this input
        var newLabel = document.createElement("label");
        newLabel.innerHTML = upperCamelCaseAll(underscoreToSpace(collection));
        newLabel.setAttribute("for", itemID);

        // Creating a new input element, based ont he element type defined above
        var newInputElement = document.createElement(elementType);
        newInputElement.setAttribute("data-collection", collection);
        newInputElement.setAttribute("id", itemID);
        
        // Looping through all of the attributes specified for this collection
        for(var inputAttribute in projectStructure[collection]["attributes"]){
            // Checking whether this attribute is for "options" 
            if(inputAttribute == "options"){
                // Looping through all of the options defined in the project structure
                for(var option of projectStructure[collection]["attributes"]["options"]){
                    // Creating a new <option> element for each one
                    var newOption = document.createElement("option");
                    newOption.innerHTML = upperCamelCaseAll(underscoreToSpace(option));
                    newOption.setAttribute("value", option);

                    // Checking that content exists for this collection
                    if(itemContent != null){
                        // Checking if the current option is equal to the value of the collection,
                        // And if so, then setting this as the selected value
                        if(option == itemContent){
                            newOption.setAttribute("selected", "selected");
                        }
                    }

                    // Checking that the parent for this options element is infact a <select> element
                    // before appending it
                    if(elementType == "select") {
                        newInputElement.appendChild(newOption);
                    }   
                }
            } else {
                // For all other attributes defined in the project structure (excluding "options", which
                // are dealt with above) setting them as attributes on the new element
                newInputElement.setAttribute(inputAttribute, projectStructure[collection]["attributes"][inputAttribute]);
            }
        }

        // If item content exists, setting the value of this element to be equal to the content provided
        if(itemContent != null){
            newInputElement.setAttribute("value", itemContent);
            if(newInputElement.getAttribute("type") == "file"){
                newInputElement.setAttribute("data-file_url", itemContent);
            }
        }

        // If this is an <input> element, and no type has been defined, defaulting
        // it to "text"
        if(elementType == "input" && newInputElement.getAttribute("type") == null){
            newInputElement.setAttribute("type", "text");
        }

        // Appending the new label and input element to the items container
        itemContainerElement.appendChild(newLabel);
        itemContainerElement.appendChild(newInputElement);

        if(newInputElement.getAttribute("type") == "file"){
            if(itemContent != null){
                appendFileUploadElements(itemContainerElement, itemContent);
            } else {
                appendFileUploadElements(itemContainerElement);
            }  
        }  
    } else if(projectStructure[collection]["items"] != null){
        for(var itemInput in projectStructure[collection]["items"]){
            // Determining the element which will be used to request input for this
            // collections items i.e. either the one defined in the project structure, 
            // or <input> as a default 
            var elementType = projectStructure[collection]["items"][itemInput]["input_type"] || "input";
            var itemID = collection + "-" + itemIndex + "-" + itemInput;

            // Creating a new label for this input
            var newLabel = document.createElement("label");
            newLabel.innerHTML = upperCamelCaseAll(underscoreToSpace(itemInput));
            newLabel.setAttribute("for", itemID);

            // Creating a new element, based on the type defined above
            var newElement = document.createElement(elementType);
            newElement.setAttribute("data-collection", collection);
            newElement.setAttribute("data-index", itemIndex);
            newElement.setAttribute("data-key", itemInput);
            newElement.setAttribute("id", itemID);
            
            // Looping throuh all the attributes for each of the items properties, as defined
            // in the project structure
            for(var inputAttribute in projectStructure[collection]["items"][itemInput]["attributes"]){
                // Checking whether this attribute is for "options"
                if(inputAttribute == "options"){
                    // Looping through all of the options defined in the project structure
                    for(var option of projectStructure[collection]["items"][itemInput]["attributes"]["options"]){
                        // Creating a new <option> element for each one
                        var newOption = document.createElement("option");
                        newOption.innerHTML = upperCamelCaseAll(underscoreToSpace(option));
                        newOption.setAttribute("value", option);

                        // Checking that content exists for this collections item
                        if(itemContent != null && itemContent[itemInput] != null){
                            // Checking if the current option is equal to the value of the collections item,
                            // And if so, then setting this as the selected value
                            if(option == itemContent[itemInput]){
                                newOption.setAttribute("selected", "selected");
                            }
                        }

                        // Checking that the parent for this options element is infact a <select> element
                        // before appending it
                        if(elementType == "select"){
                            newElement.appendChild(newOption); 
                        }
                    }
                } else {
                    // For all other attributes defined in the project structure (excluding "options", which
                    // are dealt with above) setting them as attributes on the new element
                    newElement.setAttribute(inputAttribute, projectStructure[collection]["items"][itemInput]["attributes"][inputAttribute]);
                    
                    // Checking whether content has been provided for this item, and if it has, setting 
                    // the value of this element to be equal to it
                    if(itemContent != null && itemContent[itemInput] != null){
                        newElement.setAttribute("value", itemContent[itemInput]);
                        if(newElement.getAttribute("type") == "file"){
                            newElement.setAttribute("data-file_url", itemContent);
                        }
                    }
                }
            }


            // If this is an <input> element, and no type has been defined, defaulting
            // it to "text"
            if(elementType == "input" && newElement.getAttribute("type") == null){
                newElement.setAttribute("type", "text");
            }
            
            // Appending the new label and input element to the items container
            itemContainerElement.appendChild(newLabel);
            itemContainerElement.appendChild(newElement);  

            if(newElement.getAttribute("type") == "file"){
                if(itemContent != null){
                    appendFileUploadElements(itemContainerElement, itemContent);
                } else {
                    appendFileUploadElements(itemContainerElement);
                }  
            }              
        }
    }

    // Checking whether content is being displayed for this structure, and that
    // there are items to display within it, before adding a delete button beside
    // each item
    if(itemContent != null && projectStructure[collection]["items"] != null){
        var deleteButtonElement = document.createElement("button");
        deleteButtonElement.innerHTML = "Delete";
        deleteButtonElement.setAttribute("class", "delete");
        itemContainerElement.appendChild(deleteButtonElement);
    }

    // Returning the item container, which will contain all of the input elements, labels
    // and buttons required for this item
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

        var removeCollaboratorTdElement = document.createElement("td");
        var removeCollaboratorButtonElement = document.createElement("button");
        removeCollaboratorButtonElement.innerHTML = "x";
        removeCollaboratorButtonElement.setAttribute("class", "removeCollaborator");
        removeCollaboratorButtonElement.setAttribute("data-userID", collaborators[i].user_id);
        removeCollaboratorTdElement.appendChild(removeCollaboratorButtonElement);

        newRow.appendChild(nameTdElement);
        newRow.appendChild(accessLevelNameTdElement);
        newRow.appendChild(removeCollaboratorTdElement);

        collaboratorsTableBody.appendChild(newRow);
    }
}

function getAccessLevels(){
    sendAjaxRequest("/feeds/" + projectID + "?action=accessLevels", {}, function(responseObject){
        var accessLevelSelect = document.getElementById("accessLevel");
        accessLevelSelect.innerHTML = "";
        document.getElementById("customiseAccessLevels").innerHTML = "";

        for(var accessLevel of responseObject){
            var newOption = document.createElement("option");
            newOption.innerHTML = accessLevel.access_level_name;
            newOption.setAttribute("value", accessLevel.access_level_int);
            accessLevelSelect.appendChild(newOption);

            if(document.getElementById("customiseAccessLevels") != null){
                newCustomAccessLevelRow(accessLevel);
            }
        }
    });
}

function newCustomAccessLevelRow(accessLevel=null){
    var customiseAccessLevelsTableBody = document.getElementById("customiseAccessLevels");

    var newRow = document.createElement("tr");

    var accessLevelNameTd = document.createElement("td");
    var accessLevelIntTd = document.createElement("td");
    var accessLevelInUseTd = document.createElement("td");
    var accessLevelOptionsTd = document.createElement("td");

    accessLevelNameTd.setAttribute("contentEditable", true);
    accessLevelNameTd.setAttribute("class", "access_level_name");
    accessLevelIntTd.setAttribute("class", "access_level_int");

    if(accessLevel != null){
        accessLevelNameTd.innerHTML = accessLevel.access_level_name;
        accessLevelIntTd.innerHTML = accessLevel.access_level_int;
        accessLevelIntTd.setAttribute("data-access_level_int", accessLevel.access_level_int);
        accessLevelInUseTd.innerHTML = accessLevel.in_use ? "Yes" : "No";
        accessLevelOptionsTd.innerHTML = "<button class='updateAccessLevel'>Update</button>";
        accessLevelOptionsTd.innerHTML += accessLevel.in_use || accessLevel.access_level_int <= 3? "" : "<button class='deleteAccessLevel'>Delete</button>";
    } else {
        accessLevelIntTd.setAttribute("contentEditable", true);
        accessLevelOptionsTd.innerHTML = "<button class='addAccessLevel'>Save</button><button class='cancelRow'>Cancel</button>";
    }
    
    newRow.appendChild(accessLevelNameTd);
    newRow.appendChild(accessLevelIntTd);
    newRow.appendChild(accessLevelInUseTd);
    newRow.appendChild(accessLevelOptionsTd);

    customiseAccessLevelsTableBody.appendChild(newRow);
}

function refreshDraggableContainerChildren(draggableContainer){
    for(var c=0; c<draggableContainer.children.length; c++){
        // Setting the draggable property of each child of the draggable 
        // container to true, so that it can be dragged
        draggableContainer.children[c].setAttribute("draggable", "true");
    }    
}

function refreshDraggableContainers(){
    var draggableContainers = document.getElementsByClassName("draggableContainer");
    
    for(var i=0; i<draggableContainers.length; i++){
        refreshDraggableContainerChildren(draggableContainers[i]);

        draggableContainers[i].addEventListener("dragstart", function(e){
            if(hasClass(e.target.parentNode, "draggableContainer")){
                draggingElement = e.target;
                dragStartY = e.screenY;
                addClass(draggingElement, "dragging");
                //console.log("start drag");
            }
        });
        
        draggableContainers[i].addEventListener("dragend", function(e){
            if(hasClass(e.target.parentNode, "draggableContainer")){
                removeClass(e.target, "dragging");
                //console.log("stop drag");
            }
        });
        
        draggableContainers[i].addEventListener("dragover", function(e) {
            // The default action of this event is to reset the drag operation
            // to none. Preventing this from happening, so that the "drop" event
            // will occur, so the item can be moved within the DOM
            e.preventDefault();
        });
        
        draggableContainers[i].addEventListener("drop", function(e){
            if(draggingElement != null && e.target.parentNode == draggingElement.parentNode){
                e.target.parentNode.removeChild(draggingElement);
                if(e.screenY < dragStartY){
                    e.target.parentNode.insertBefore(draggingElement, e.target);
                } else {
                    e.target.parentNode.insertBefore(draggingElement, e.target.nextSibling);
                }

                if(typeof adminDropEvent == "function"){
                    var draggingElementNewIndex = getChildIndex(e.target.parentNode, draggingElement);
                    adminDropEvent(draggingElement.getAttribute("data-collection"), draggingElementNewIndex);
                }

                draggingElement = null;
                dragStartY = null;
                //console.log("drop");
            }	
            removeClass(e.target, "dragging");					
        });
        
        draggableContainers[i].addEventListener("dragenter", function(e) {
            if(e.target.parentNode == draggingElement.parentNode){
                addClass(e.target, "dragging");
            }
        });
        
        draggableContainers[i].addEventListener("dragleave", function(e) {
            if(hasClass(e.target.parentNode, "draggableContainer")){
                removeClass(e.target, "dragging");
            }
        });
    }
}

function updateProjectHistory(contentCommitHistory, structureCommitHistory=null){
    var projectContentHistoryTableBody = document.getElementById("projectContentHistory");

    generateHistoryTable(contentCommitHistory.all, projectContentHistoryTableBody, "content");

    if(structureCommitHistory != null){
        var projectStructureHistoryTableBody = document.getElementById("projectStructureHistory");
        
        generateHistoryTable(structureCommitHistory.all, projectStructureHistoryTableBody, "structure");
    }
}

function generateHistoryTable(arrayOfCommits, tableBody, historyOf){
    tableBody.innerHTML = "";
    for(var i=0; i< arrayOfCommits.length; i++){
        var dateOfCommit = new Date(arrayOfCommits[i].date);
        var shortCommitId = arrayOfCommits[i].hash.slice(0, 6);

        var newCommitRow = document.createElement("tr");

        var commitTd = document.createElement("td");
        commitTd.innerHTML = shortCommitId;

        var dateTd = document.createElement("td");
        dateTd.innerHTML = customDateFormat(dateOfCommit, false, true);

        var changesTd = document.createElement("td");
        changesTd.innerHTML = arrayOfCommits[i].message.indexOf("(HEAD ->") > -1 ? arrayOfCommits[i].message.split("(HEAD ->")[0] : arrayOfCommits[i].message;

        var byTd = document.createElement("td");
        byTd.innerHTML = arrayOfCommits[i].author_name;

        var optionsTd = document.createElement("td");
        optionsTd.innerHTML = "<button data-hash=" + arrayOfCommits[i].hash + " data-historyof=" + historyOf + " data-short_commit_id=" + shortCommitId + " class='previewHistory'>Preview</button>";


        newCommitRow.appendChild(commitTd);
        newCommitRow.appendChild(dateTd);
        newCommitRow.appendChild(changesTd);
        newCommitRow.appendChild(byTd);
        newCommitRow.appendChild(optionsTd);

        tableBody.appendChild(newCommitRow);
    }
}

function previewCommitHistory(targetButton){
    console.log("Previewing " + targetButton.getAttribute("data-hash") + " for " + targetButton.getAttribute("data-historyof"));
        var historyOf = targetButton.getAttribute("data-historyof");
        var commitHash = targetButton.getAttribute("data-hash");
        var shortCommitId = commitHash.slice(0, 6);
        sendAjaxRequest("/feeds/" + projectID + "?action=previewCommit&commit_hash=" + commitHash + "&historyof=" + historyOf, {}, function(responseObject){
            if(historyOf == "content"){
                if(document.getElementById("projectContentHistoryPreview") != undefined){
                    updateProjectJSON(responseObject.commit_content, "projectContentHistoryPreview");
                    document.getElementById("projectContentHistoryPreview").setAttribute("data-short_commit_id", shortCommitId);
                } else {
                    var tempProjectDetails = {
                        content: responseObject.commit_content,
                        structure: responseObject.structure
                    };
                    updateProjectHTML(tempProjectDetails);
                    document.getElementById("updateProjectContent").setAttribute("data-short_commit_id", shortCommitId);
                }
                
                var previouslySelected = document.getElementById("projectContentHistory").getElementsByClassName("selected")[0];
                if(previouslySelected != null){
                    removeClass(previouslySelected, "selected");
                }

            } else if(historyOf == "structure"){
                updateProjectJSON(responseObject.commit_structure, "projectStructureHistoryPreview");
                document.getElementById("projectStructureHistoryPreview").setAttribute("data-short_commit_id", shortCommitId);
                var previouslySelected = document.getElementById("projectStructureHistory").getElementsByClassName("selected")[0];
                if(previouslySelected != null){
                    removeClass(previouslySelected, "selected");
                }
                
            } 

            addClass(targetButton.parentNode.parentNode, "selected");           
        });
}

function getProjectHistory(includeContent) {
    sendAjaxRequest("/feeds/" + projectID, {}, function(responseObject){
        if(includeContent){
            updateProjectHistory(responseObject.content_history);
        } else {
            updateProjectHistory(responseObject.content_history, responseObject.structure_history);
        }
    });
}

function appendFileUploadElements(itemContainerElement, fileUrl=null){
    var viewImagesButton = document.createElement("button");
    viewImagesButton.innerHTML = "View Images";
    viewImagesButton.setAttribute("class", "viewImages");
    itemContainerElement.appendChild(viewImagesButton);

    if(fileUrl != null){
        var thumbnailImage = document.createElement("img");
        thumbnailImage.src = fileUrl;
        itemContainerElement.appendChild(thumbnailImage);
    }
}

function generateAvailableImagesPreview(inputId, files){
    var imageContainer = imagePreviewContainer.getElementsByClassName("images")[0];
    imageContainer.innerHTML = "";
    imagePreviewContainer.setAttribute("data-input_for", inputId);
    for(var i=0; i<files.length; i++){
        var imageElement = document.createElement("img");
        imageElement.setAttribute("src", files[i].url);
        imageElement.setAttribute("class", "previewImage");
        imageElement.setAttribute("width", "100px");
        imageElement.setAttribute("height", "100px");
        imageContainer.appendChild(imageElement);
    }
    addClass(imagePreviewContainer, "visible");
}

function updateThumbnailImage(fileInput, fileUrl){
    var thumbnailImg = fileInput.parentNode.getElementsByTagName("img")[0];
    if(thumbnailImg == null){
        thumbnailImg = document.createElement("img");
        thumbnailImg.setAttribute("width", "100px");
        fileInput.parentNode.appendChild(thumbnailImg);
    }
    thumbnailImg.setAttribute("src", fileUrl);
    thumbnailImg.setAttribute("value", fileUrl);
}