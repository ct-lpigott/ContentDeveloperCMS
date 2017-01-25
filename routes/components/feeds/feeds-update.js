// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Requiring the file system module, so that this route can have access
// to the file system of the server i.e. to be able to create, open, edit 
// and save project files to the /projects directory
var fs = require("fs");

var validation = require("./../validation.js");

// Request to update the entire contents of a project
router.put("/:projectID", function(req, res, next){
    // Determining the level of access this user has to this project
    switch(req.user_access_level){
        case 1: {
            if(req.body.projectStructure != null){
                // Transforming the project structure within the request body to lowercase,
                // as the project structure should not contain uppercase characters
                req.body.projectStructure = req.body.projectStructure.toLowerCase();                   

                // Temporarily storing the file data from the admin.json file, so that
                // it can be updated accordingly
                var adminProjectFile = req.fileData.admin;

                if(validation.jsonToObject(req.body.projectStructure)){
                    // Setting the date updated to the current time, the last_updated_by property to the
                    // ID of the current user, and the project_structure to the structure passed to the 
                    // request body
                    adminProjectFile.date_updated = Date.now();
                    adminProjectFile.last_updated_by = req.userID;
                    adminProjectFile.project_structure = JSON.parse(req.body.projectStructure);

                    // Updating the projects admin.json file, passing the adminProjectFile object created above
                    // (which contains the updated details of the project) as the content for the file as a JSON string
                    fs.writeFile("./projects/" + req.params.projectID + "/admin.json", JSON.stringify(adminProjectFile), function(err){
                        if(err) {
                            // Logging the error to the console
                            console.log("Error updating admin.json file " + err);

                            // Unable to update the admin.json file. Adding this as an error to the 
                            // feedsErrors array.
                            req.feedsErrors.push("Server error - unable to update project structure");

                            // Since this is a significant issue, passing this request to the feeds-errors
                            // route, by calling the next method with an empty error (as all errors will be
                            // accessible from the feedsErrors array).
                            next(new Error());
                        } else {
                            console.log("Project admin file updated");

                            // Sending the new project structure as the response to the request
                            res.send(adminProjectFile.project_structure);
                        }
                    });
                } else {
                    // This is not a valid JSON object. Adding this as an 
                    // error to the feedsErrors array.
                    req.feedsErrors.push("This is not valid JSON. Cannot update the project structure");

                    // Since this is a significant issue, passing this request to the feeds-errors
                    // route, by calling the next method with an empty error (as all errors will be
                    // accessible from the feedsErrors array).
                    next(new Error());
                }

                
            } else if(req.body.projectContent != null){
                // Passing this request to the next stage of the router, so that the content
                // can be updated
                next();
            } else {
                // Logging this error to the console
                console.log(err);

                // No structure or content were included in the request. Adding this as an 
                // error to the feedsErrors array.
                req.feedsErrors.push("No project content or structure included in the request");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                next(new Error());
            }
            break;
        }
        default: {
            // Checking if the user has included content in the request body
            if(req.body.projectContent != null){
                // Passing this request to the next stage of the router, so that the content
                // can be updated
                next();
            } else {
                // Logging this error to the console
                console.log(err);

                // No content were included in the request. Adding this as an error to the 
                // feedsErrors array.
                req.feedsErrors.push("No project content included in the request");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                next(new Error());
            }
            break;
        }
    }
});
// Continued - request to update the contents of an entire project
router.put("/:projectID", function(req, res, next){
    if(validation.jsonToObject(req.body.projectContent)){
        // Updating the projects content.json file to be equal to the content passed to the request
        // body. This content is already in JSON format
        fs.writeFile("./projects/" + req.params.projectID + "/content.json", req.body.projectContent, function(err){
            if(err) {
                // Logging this error to the console
                console.log("Error updating file " + err);

                // No content were included in the request. Adding this as an error to the 
                // feedsErrors array.
                req.feedsErrors.push("No project content included in the request");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                next(new Error());
            } else {
                console.log("Project content file updated");

                // Sending back a response with an empty JSON string, as the content has been
                // successfully updated
                res.send("{}");
            }
        }); 
    } else {
        // This is not a valid JSON object. Adding this as an 
        // error to the feedsErrors array.
        req.feedsErrors.push("This is not valid JSON. Cannot update the project content");

        // Since this is a significant issue, passing this request to the feeds-errors
        // route, by calling the next method with an empty error (as all errors will be
        // accessible from the feedsErrors array).
        next(new Error());
    }
    
});

// Request to update the content of an entire collection within a project
router.put("/:projectID/:collection", function(req, res, next){
    res.send("PUT request received from userID=" + req.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection);
});

// Request to update the content of an item within a collection of a project
router.put("/:projectID/:collection/:item", function(req, res, next){
    res.send("PUT request received from userID=" + req.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection + " and item=" + req.params.item);
});

// Exporting the router that was set up in this file, so that it can be included
// in the feeds.js route and specified as the route for all put requests to update
// elements in a project
module.exports = router;