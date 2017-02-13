// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Requiring the file system module, so that this route can have access
// to the file system of the server i.e. to be able to create, open, edit 
// and save project files to the /projects directory
var fs = require("fs");

var simpleGit = require("simple-git");

var validation = require("./../validation.js");

router.use(function(req, res, next){
    if(req.updateFile != null) {
        if(req.updateFile == "content") {
            // Checking that the fileData content is still a valid object, by attempting
            // to parse it to JSON. Since the new item that was created will have been reflected
            // in this object (as it was passed by reference to a function) completing this recheck
            // to ensure that creating the new item did not corrupt the existing content
            if(validation.objectToJson(req.fileData.content)){
                // Updating this project's content.json file, passing the JSON stringified version
                // of the fileData content object as the contents
                fs.writeFile("./projects/" + req.projectID + "/content.json", JSON.stringify(req.fileData.content), function(err){
                    if(err) {
                        // Logging the error to the console
                        console.log("Error updating project content file " + err);

                        // As it has not been possible to update the content.json file for this 
                        // project, adding this as an error to the feedsErrors array.
                        req.feedsErrors.push("Server error - unable to update project content data file");

                        // Since this is a significant issue, passing this request to the feeds-errors
                        // route, by calling the next method with an empty error (as all errors will be
                        // accessible from the feedsErrors array).
                        return next(new Error());
                    } else {
                        req.gitCommitMessage = req.gitCommitMessage != null ? req.gitCommitMessage : "Project content updated";
                        req.resultData = req.resultData != null ? req.resultData : req.fileData.content;

                        var projectGitRepo = simpleGit("./projects/" + req.projectID);
                        projectGitRepo
                            .addConfig("user.name", req.user_display_name)
                            .addConfig("user.email", req.user_email_address)
                            .add("./content.json")
                            .commit(req.gitCommitMessage, function(){
                                console.log("Project content file successfully updated");
                                res.send(req.resultData);
                            });
                    }
                });
            } else {
                // As it has not been possible parse the updated object to JSON, the content
                // cannot be updated. Adding this as an error to the feeds errors array.
                req.feedsErrors.push("The content included is not valid JSON.");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                return next(new Error());
            }            
        } else {
            next();
        }
    } else {
        next(new Error);
    }
});

router.use(function(req, res, next){
    if(req.updateFile == "structure"){
        // Updating the meta data of the admin.json file
        req.fileData.admin.date_updated = Date.now();
        req.fileData.admin.last_updated_by = req.userID;

        // Checking that the fileData admin is still a valid object, by attempting
        // to parse it to JSON. Since the new item that was created will have been reflected
        // in this object (as it was passed by reference to a function) completing this recheck
        // to ensure that creating the new item did not corrupt the existing project_structure
        if(validation.objectToJson(req.fileData.admin)){
            // Updating this project's admin.json file, passing the JSON stringified version
            // of the fileData object as the contents
            fs.writeFile("./projects/" + req.projectID + "/admin.json", JSON.stringify(req.fileData.admin), function(err){
                if(err) {
                    // Logging the error to the console
                    console.log("Error updating project admin file " + err);

                    // As it has not been possible to update the admin.json file for this 
                    // project, adding this as an error to the feedsErrors array.
                    req.feedsErrors.push("Server error - unable to update project structure data file");

                    // Since this is a significant issue, passing this request to the feeds-errors
                    // route, by calling the next method with an empty error (as all errors will be
                    // accessible from the feedsErrors array).
                    return next(new Error());
                } else {
                    console.log("Project admin file updated");

                    req.gitCommitMessage = req.gitCommitMessage != null ? req.gitCommitMessage : "Project structure updated";
                    req.resultData = req.resultData != null ? req.resultData : req.fileData.admin.project_structure;
                    
                    var projectGitRepo = simpleGit("./projects/" + req.projectID);
                    projectGitRepo
                        .addConfig("user.name", req.user_display_name)
                        .addConfig("user.email", req.user_email_address)
                        .add("./admin.json")
                        .commit(req.gitCommitMessage, function(){
                            // Sending the new item as the response to the caller, so that they can
                            // see the result of their request
                            res.send(req.resultData);
                        });                    
                }
            });
        } else {
            // As it has not been possible parse the updated object to JSON, the project structure
            // cannot be updated. Adding this as an error to the feeds errors array.
            req.feedsErrors.push("The content included is not valid JSON");

            // Since this is a significant issue, passing this request to the feeds-errors
            // route, by calling the next method with an empty error (as all errors will be
            // accessible from the feedsErrors array).
            return next(new Error());
        }
    } else {
        next();
    }
});

// Exporting the router that was set up in this file, so that it can be included
// in the feeds.js route and used to update the project files (if any changes were made)
module.exports = router;