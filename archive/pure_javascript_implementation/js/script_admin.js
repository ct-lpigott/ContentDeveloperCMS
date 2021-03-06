var projectID;
var draggingElement;
var dragStartY;
var projectStructureHistoryPreviewTextarea;
var projectContentHistoryPreviewTextarea;

function customAdminWindowOnload(){

    if(document.getElementById("userProjects")){
        sendAjaxRequest("/feeds/?action=collaborators", {}, function(responseObject){
            updateUserProjects(responseObject);
        });
    }

    if(document.getElementById("projectID")){
        projectID = document.getElementById("projectID").value;
        projectStructureHistoryPreviewTextarea = document.getElementById("projectStructureHistoryPreview");
        projectContentHistoryPreviewTextarea = document.getElementById("projectContentHistoryPreview");
        resetProjectStructure();
        getAccessLevels();
        getProjectCollaborators();
        getProjectHistory(false);
    }  
}

function customAdminSetupEventListeners(){
    if(document.getElementById("projectStructure")){
        document.getElementById("projectStructure").addEventListener("keydown", projectStructureKeyDownHandler);
    }
}

function customAdminClickEventHandler(e){
    // BY ID
    switch(e.target.id){
        case "updateProjectStructure": {
            parsedProjectStructure = parseProjectStructureToJSON();

            if(jsonToObject(parsedProjectStructure)){
                sendAjaxRequest("/feeds/" + projectID, {structure: parsedProjectStructure}, function(responseObject){
                    updateProjectJSON(responseObject);
                    getProjectHistory(false);
                    document.getElementById("previewProjectStructure").click();
                    updateProjectHTML({structure: responseObject, content: currentProjectContent}, true);
                }, "PUT");
            } else {
                console.log("This is not valid JSON");
            }            

            break;
        }
        case "addNewCollab": {
            var email = document.getElementById("newCollabEmail").value;
            var accessLevel = document.getElementById("accessLevel").value;

            if(email.length > 0 && accessLevel > 0){
                sendAjaxRequest("/feeds/" + projectID + "?action=collaborators", {email: email, accessLevelInt: accessLevel}, function(responseObject){
                    updateProjectCollaborators(responseObject);
                }, "POST");
            }
            break;
        }
        case "previewProjectStructure": {
            var tempProjectObj = {
                structure: JSON.parse(parseProjectStructureToJSON())
            }
            
            updateProjectHTML(tempProjectObj, false);
            reformatJSON();
            break;
        }
        case "resetProjectStructure": {
            resetProjectStructure();
            break;
        }
        case "revertContent": {
            if(jsonToObject(projectContentHistoryPreviewTextarea.value)){
                sendAjaxRequest("/feeds/" + projectID, {content: projectContentHistoryPreviewTextarea.value, short_commit_id: projectContentHistoryPreviewTextarea.getAttribute("data-short_commit_id")}, function(responseObject){
                    console.log("Content updated");
                    getProjectHistory(false);
                    projectContentHistoryPreviewTextarea.value = "";
                }, "PUT");
            } else {
                console.log("This is not valid JSON");
            }  
            break;
        }
        case "revertStructure": {
            if(jsonToObject(projectStructureHistoryPreviewTextarea.value)){
                sendAjaxRequest("/feeds/" + projectID, {structure: projectStructureHistoryPreviewTextarea.value, short_commit_id: projectStructureHistoryPreviewTextarea.getAttribute("data-short_commit_id")}, function(responseObject){
                    updateProjectJSON(responseObject);
                    getProjectHistory(false);
                    projectStructureHistoryPreviewTextarea.value = "";
                    document.getElementById("previewProjectStructure").click();
                }, "PUT");
            } else {
                console.log("This is not valid JSON");
            }  

            break;
        }
        case "addNewAccessLevel": {
            newCustomAccessLevelRow();
            break;
        }
        case "updateProjectName":{
            var newProjectName = document.getElementById("newProjectName").value;
            if(newProjectName != null && newProjectName.length > 0){
                sendAjaxRequest("/feeds/" + projectID + "?action=projectName", {projectName: newProjectName}, function(responseObject){
                    console.log("Project name updated");
                    document.getElementById("pageTitle").innerHTML = newProjectName;
                }, "PUT");
            }
            break;
        }
        case "updateMaxCacheAge":{
            var maxCacheAge = document.getElementById("maxCacheAge").value;
            if(maxCacheAge != null && isNaN(maxCacheAge) == false){
                sendAjaxRequest("/feeds/" + projectID + "?action=cache", {max_cache_age: maxCacheAge}, function(responseObject){
                }, "PUT");
            }
            break;
        }
        case "updateCustomCss":{
            var customCssTextarea = document.getElementById("customCss");
            sendAjaxRequest("/feeds/" + projectID + "?action=css", {custom_css: customCssTextarea.value}, function(responseObject){
                console.log("css updated");
                if(responseObject.custom_css != undefined){
                    customCssTextarea.value = responseObject.custom_css;
                }
            }, "PUT");
            break;
        }
    }

    // BY CLASS
    if(hasClass(e.target, "removeCollaborator")){
        
        sendAjaxRequest("/feeds/" + projectID + "?action=collaborators", {collaboratorID: e.target.getAttribute("data-userID")}, function(responseObject){
            console.log("Deleted Collab " + e.target.getAttribute("data-userID"));
            updateProjectCollaborators(responseObject);
        }, "DELETE");
    } else if(hasClass(e.target, "createNewProject")){
        var newProjectName = document.getElementById("newProjectName").value;
        if(newProjectName != null && newProjectName.length > 0){
            sendAjaxRequest("/feeds?action=createProject", {projectName: newProjectName, template: e.target.getAttribute("data-template")}, function(responseObject){
                document.getElementById("newProjectName").value = "";
                updateUserProjects(responseObject);
            }, "POST");
        }
    } else if(hasClass(e.target, "previewHistory")){
        previewCommitHistory(e.target);
    } else if(hasClass(e.target, "addAccessLevel")){
        var parentRow = e.target.parentNode.parentNode;
        var newAccessLevelName = parentRow.getElementsByClassName("access_level_name")[0].textContent;
        var newAccessLevelInt = parentRow.getElementsByClassName("access_level_int")[0].textContent;
        sendAjaxRequest("/feeds/" + projectID + "?action=accessLevels", {access_level_name: newAccessLevelName, access_level_int: newAccessLevelInt}, function(responseObject){
            console.log("New access level added");
            getAccessLevels();
        }, "POST");
    } else if(hasClass(e.target, "deleteAccessLevel")){
        var parentRow = e.target.parentNode.parentNode;
        var newAccessLevelInt = parentRow.getElementsByClassName("access_level_int")[0].getAttribute("data-access_level_int");
        sendAjaxRequest("/feeds/" + projectID + "?action=accessLevels", {access_level_int: newAccessLevelInt}, function(responseObject){
            console.log("Access level deleted");
            getAccessLevels();
        }, "DELETE");
    } else if(hasClass(e.target, "updateAccessLevel")){
        var parentRow = e.target.parentNode.parentNode;
        var newAccessLevelName = parentRow.getElementsByClassName("access_level_name")[0].textContent;
        var newAccessLevelInt = parentRow.getElementsByClassName("access_level_int")[0].getAttribute("data-access_level_int");
        sendAjaxRequest("/feeds/" + projectID + "?action=accessLevels", {access_level_name: newAccessLevelName, access_level_int: newAccessLevelInt}, function(responseObject){
            console.log("Access level updated");
            getAccessLevels();
        }, "PUT");
    } else if(hasClass(e.target, "view")){
        hide(document.querySelector("#adminPanel > .visible"));
        show(document.getElementById(e.target.getAttribute("data-view") + "_view"));
        removeClass(e.target.parentNode.getElementsByClassName("active")[0], "active");
        addClass(e.target, "active");
    }
}

function updateUserProjects(userProjects){
    var userProjectsTableBody = document.getElementById("userProjects").getElementsByTagName("tbody")[0];
    userProjectsTableBody.innerHTML = "";

    if(userProjects.length == undefined || userProjects.length == 0){
        var newTr = document.createElement("tr");
        var newTd = document.createElement("td");
        newTd.innerHTML = "You have no projects. Please create one!";
        newTd.setAttribute("colspan", "5");
        newTr.appendChild(newTd);
        userProjectsTableBody.appendChild(newTd);
    } else {
        for(var i=0; i<userProjects.length; i++){
            var newTr = document.createElement("tr");
            var newTd_projectName = document.createElement("td");
            var newTd_accessLevel = document.createElement("td");
            var newTd_lastModified = document.createElement("td");
            var newTd_modifiedBy = document.createElement("td");
            var newTd_options = document.createElement("td");

            newTd_projectName.innerHTML = userProjects[i].project_name

            newTd_accessLevel.innerHTML = userProjects[i].access_level_name;

            var newA = document.createElement("a");
            newA.setAttribute("href", "/admin/" + userProjects[i].project_id);
            newA.innerHTML = "Edit";
            newTd_options.appendChild(newA);

            newTr.appendChild(newTd_projectName);
            newTr.appendChild(newTd_accessLevel);
            newTr.appendChild(newTd_lastModified);
            newTr.appendChild(newTd_modifiedBy);
            newTr.appendChild(newTd_options);
            userProjectsTableBody.appendChild(newTr);
        }
    }
    
}

function updateProjectJSON(projectStructureOBJ, textareaContainer="projectStructure"){
    var formattedJSON = JSON.stringify(projectStructureOBJ, null, 4);
    document.getElementById(textareaContainer).value = formattedJSON;
}

function projectStructureKeyDownHandler(e){
    var projectStructureContainer = e.target;
    var contents = projectStructureContainer.value;
    var insertionPoint = projectStructureContainer.selectionStart;
    var deletePrevChar = false;
    var appendChar = "";

    if(e.key.toLowerCase() == "enter" || e.keyCode == 13){
        e.preventDefault();
        appendChar = "\n";
    }

    if(e.key.toLowerCase() == "tab" || e.keyCode == 9){
        e.preventDefault();
        if(e.shiftKey){
            deletePrevChar = true;
        } else {
            appendChar = "\t";
        }
    }

    if(deletePrevChar){
        prevChar = contents.slice(insertionPoint-1, insertionPoint);
        console.log(prevChar.replace(/\s/g, "").length);
        if(prevChar.replace(/\s/g, "").length == 0){
            projectStructureContainer.value = contents.slice(0, insertionPoint-1) + contents.slice(insertionPoint);
            updateSelectionRange(insertionPoint-1);
        }
        
    } else if(appendChar.length > 0) {
        projectStructureContainer.value = contents.slice(0, insertionPoint) + appendChar + contents.slice(insertionPoint);
        updateSelectionRange(insertionPoint+1);
    }
}

function parseProjectStructureToJSON(){
    var projectStructure = document.getElementById("projectStructure").value;
    var escapeCharsRemoved = projectStructure.replace(/\n/gm, "").replace(/\t/gm, "");

    if(escapeCharsRemoved == null || escapeCharsRemoved.length == 0){
        escapeCharsRemoved = "{}";
    }

    return escapeCharsRemoved;
}

function resetProjectStructure(){
    sendAjaxRequest("/feeds/" + projectID, {}, function(responseObject){
        updateProjectJSON(responseObject.structure);
        updateProjectHTML(responseObject, false);
        refreshDraggableContainers();
    }); 
}

function reformatJSON(){
    var projectStructureContainer = document.getElementById("projectStructure");
    try{
        var updatedJSON = JSON.parse(projectStructureContainer.value);
        updateProjectJSON(updatedJSON);
    } catch(e){}
}

function updateSelectionRange(insertionPoint){
    var projectStructureContainer = document.getElementById("projectStructure").setSelectionRange(insertionPoint, insertionPoint);
}

function adminDropEvent(collectionName, newIndexPosition){
    var originalStructure = JSON.parse(parseProjectStructureToJSON());
    var newStructure = {};

    var index = 0;
    for(var collection in originalStructure){
        if(index == newIndexPosition){
            newStructure[collectionName] = originalStructure[collectionName];
        }

        if(collectionName != collection){
            newStructure[collection] = originalStructure[collection];
        }

        index++;
    }
    updateProjectJSON(newStructure);
    console.log(collectionName + " is now at " + newIndexPosition);
}