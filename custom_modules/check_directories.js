var fs = require("fs");

var requiredDirectories = [
    "./uploads",
    "./projects"
];

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

module.exports = function(){
    for(var i=0; i<requiredDirectories.length; i++){
        checkDirectory(requiredDirectories[i]);
    }
}