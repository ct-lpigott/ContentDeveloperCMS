var userID;

function customWindowOnload(){
    userID = document.getElementById("userID").value;

    sendAjaxRequest("/feeds/" + userID, {}, function(responseObject){
        updateUserProjects(responseObject);
    });  
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
        newLi.innerHTML = userProjects[i].project_name;
        userProjectsUL.appendChild(newLi);
    }
}