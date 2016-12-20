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
            updateProjectJSON(responseObject.project_structure);
        }); 
    }    
}

function customClickEventHandler(e){
    switch(e.target.id){
        case "createNewProject": {
            var newProjectName = document.getElementById("newProjectName").value;
            if(newProjectName != null && newProjectName.length > 0){
                sendAjaxRequest("/feeds/" + userID, {projectName: newProjectName}, function(responseObject){
                    updateUserProjects(responseObject)
                }, "POST");
            }
            
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

function updateProjectJSON(projectJSON){
    var formattedJSON = JSON.stringify(projectJSON, null, 4);
    document.getElementById("projectJSON").innerHTML = formattedJSON;
}