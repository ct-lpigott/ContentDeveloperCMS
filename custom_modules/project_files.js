// Requiring the file system module, so that this module can access
// the server's file system
var fs = require("fs");

// Requiring the rimraf module, to preform "rm -rf" commands on the
// file system i.e. to force removal of directories recursively. As each
// project will contain a Git repository, there are too many
// files to remove individually.
var rimraf = require("rimraf");

// Storing the path to the projects directory, so that it can be reused
var projectsDirectory = "projects/";

function deleteProject(projectId, cb){
    // Checking that the directory exists by checking for the project's content.json
    // file (as can't run .exists() on a directory)
    fs.exists(projectsDirectory + projectId + "/content.json", function(exists){
        if(exists){
            // Forcing the removal of this directory, and all its contents
            rimraf(projectsDirectory + projectId, function(err){
                if(err){ console.log(err); }
                cb(err, true);
            });
        } else {
            cb("Dir does not exist", false);
        }
    });
}

// Setting the module exports to be an object, with all of the functions
// that will be used outside of this module
module.exports = {
    deleteProject: deleteProject
}