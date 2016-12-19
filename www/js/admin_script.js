function customWindowOnload(){
    loadDataFromURL("/feeds/1", function(responseText){
        var userProjects = responseText;
        var userProjectsUL = document.getElementById("userProjects");
        console.log(userProjects);

        for(var i=0; i<userProjects.length; i++){
            var newLi = document.createElement("li");
            newLi.innerHTML = userProjects[i].project_name;
            userProjectsUL.appendChild(newLi);
        }
    });  
}

function customClickEventHandler(e){
}