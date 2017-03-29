// Requiring the file system module, so that this module can access
// the server's file system
var fs = require("fs");

// Creating an array of directories that are required, but may need to 
// be created dynamically i.e. they are ignored by Git, and so will not
// exist in a remote location by default
var requiredDirectories = [
    "./uploads",
    "./projects"
];

// Creating a function to check if a directory exists, and creating it
// if it doesn't. Called when the module exports function is invoked,
// and passes each one to the function to be checked/created
function checkDirectory(directoryPath){
    fs.exists(directoryPath, function(exists){
        if(!exists){
            fs.mkdir(directoryPath, function(err){
                console.log(directoryPath + " directory created");
            });
        } else {
            console.log(directoryPath + " directory already exists");
        }
    });
}

// Setting the module exports to be equal to an anon function, so that
// this module can be invoked directly, as it only does one thing
module.exports = function(){
    for(var i=0; i<requiredDirectories.length; i++){
        checkDirectory(requiredDirectories[i]);
    }
}