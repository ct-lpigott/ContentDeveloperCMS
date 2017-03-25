var fs = require("fs");
var rimraf = require("rimraf");
var projectsDirectory = "projects/";

function deleteProject(projectId, cb){
    fs.exists(projectsDirectory + projectId + "/content.json", function(exists){
        if(exists){
            rimraf(projectsDirectory + projectId, function(err){
                if(err){ console.log(err); }
                cb(err, true);
            });
        } else {
            cb("Dir does not exist", false);
        }
    });
}

module.exports = {
    deleteProject: deleteProject
}