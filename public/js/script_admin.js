var userID;
var projectID;

function customWindowOnload(){
    userID = document.getElementById("userID").value;

    if(document.getElementById("userProjects")){
        sendAjaxRequest("/feeds/", {}, function(responseObject){
            updateUserProjects(responseObject);
        });
    }

    if(document.getElementById("projectID")){
        projectID = document.getElementById("projectID").value;
        resetProjectStructure();
        getProjectCollaborators();
    }    
}

function customSetupEventListeners(){
    if(document.getElementById("projectStructure")){
        document.getElementById("projectStructure").addEventListener("keydown", projectStructureKeyDownHandler);
    }
}

function customClickEventHandler(e){
    // BY ID
    switch(e.target.id){
        case "createNewProject": {
            var newProjectName = document.getElementById("newProjectName").value;
            if(newProjectName != null && newProjectName.length > 0){
                sendAjaxRequest("/feeds/", {projectName: newProjectName}, function(responseObject){
                    updateUserProjects(responseObject);
                }, "POST");
            }
            break;
            
        }
        case "updateProjectStructure": {
            parsedProjectStructure = parseProjectStructureToJSON();

            if(jsonToObject(parsedProjectStructure)){
                sendAjaxRequest("/feeds/" + projectID, {projectStructure: parsedProjectStructure}, function(responseObject){
                    updateProjectJSON(responseObject);
                    document.getElementById("previewProjectStructure").click();
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
                sendAjaxRequest("/feeds/" + projectID + "?action=addCollaborator", {email: email, accessLevel: accessLevel}, function(responseObject){
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
    }

    // BY CLASS
    if(e.target.classList.contains("removeCollaborator")){
        
        sendAjaxRequest("/feeds/" + projectID + "?action=removeCollaborator", {collaboratorID: e.target.getAttribute("data-userID")}, function(responseObject){
            console.log("Deleted Collab " + e.target.getAttribute("data-userID"));
            updateProjectCollaborators(responseObject);
        }, "DELETE");
    }
}

function updateUserProjects(userProjects){
    var userProjectsUL = document.getElementById("userProjects");
    userProjectsUL.innerHTML = "";

    for(var i=0; i<userProjects.length; i++){
        var newLi = document.createElement("li");

        var newA = document.createElement("a");
        newA.setAttribute("href", "/admin/" + userProjects[i].project_id + "?userID=" + userID);
        newA.innerHTML = userProjects[i].project_name;
        newLi.appendChild(newA);

        userProjectsUL.appendChild(newLi);
    }
}

function updateProjectJSON(projectStructureOBJ){
    var formattedJSON = JSON.stringify(projectStructureOBJ, null, 4);
    document.getElementById("projectStructure").value = formattedJSON;
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