var userID;
var projectID;

function customWindowOnload(){
    userID = document.getElementById("userID").value;

    if(document.getElementById("userProjects")){
        sendAjaxRequest("/feeds/" + userID, {}, function(responseObject){
            updateUserProjects(responseObject);
        });
    }

    if(document.getElementById("projectID")){
        projectID = document.getElementById("projectID").value;
        sendAjaxRequest("/feeds/" + userID + "/" + projectID, {}, function(responseObject){
            updateProjectJSON(responseObject);
        }); 
    }    
}

function customSetupEventListeners(){
    if(document.getElementById("projectStructure")){
        document.getElementById("projectStructure").addEventListener("keydown", projectStructureKeyDownHandler);
    }
}

function customClickEventHandler(e){
    switch(e.target.id){
        case "createNewProject": {
            var newProjectName = document.getElementById("newProjectName").value;
            if(newProjectName != null && newProjectName.length > 0){
                sendAjaxRequest("/feeds/" + userID, {projectName: newProjectName}, function(responseObject){
                    updateUserProjects(responseObject);
                }, "POST");
            }
            
        }
        case "updateProjectStructure": {
            var projectStructure = document.getElementById("projectStructure").value;
            var escapeCharsRemoved = projectStructure.replace(/\n/gm, "").replace(/\t/gm, "");

            if(escapeCharsRemoved == null || escapeCharsRemoved.length == 0){
                escapeCharsRemoved = "{}";
            }
            

            sendAjaxRequest("/feeds/" + userID + "/" + projectID, {projectStructure: escapeCharsRemoved}, function(responseObject){
                updateProjectJSON(responseObject);
            }, "PUT");
        }
    }
}

function updateUserProjects(userProjects){
    var userProjectsUL = document.getElementById("userProjects");
    userProjectsUL.innerHTML = "";

    for(var i=0; i<userProjects.length; i++){
        var newLi = document.createElement("li");

        var newA = document.createElement("a");
        newA.setAttribute("href", "/admin/" + userProjects[i].user_id + "/" + userProjects[i].project_id);
        newA.innerHTML = userProjects[i].project_name;
        newLi.appendChild(newA);

        userProjectsUL.appendChild(newLi);
    }
}

function updateProjectJSON(projectStructureOBJ){
    var formattedJSON = JSON.stringify(projectStructureOBJ, null, 4);
    document.getElementById("projectStructure").innerHTML = formattedJSON;
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
        insertionPoint += 1;
    }

    if(e.key.toLowerCase() == "tab" || e.keyCode == 9){
        e.preventDefault();
        if(e.shiftKey){
            deletePrevChar = true;
        } else {
            appendChar = "\t";
            insertionPoint += 1;
        }
    }

    if(deletePrevChar){
        projectStructureContainer.value = contents.slice(0, insertionPoint-2) + contents.slice(insertionPoint);
        projectStructureContainer.setSelectionRange(insertionPoint-2, insertionPoint-2);
    } else if(appendChar.length > 0) {
        projectStructureContainer.value = contents.slice(0, insertionPoint-1) + appendChar + contents.slice(insertionPoint-1);
        projectStructureContainer.setSelectionRange(insertionPoint, insertionPoint);
    }   


    try{
        var updatedJSON = JSON.parse(projectStructureContainer.value);
        updateProjectJSON(updatedJSON);
    } catch(e){}
    
}