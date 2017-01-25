// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Requiring the file system module, so that this route can have access
// to the file system of the server i.e. to be able to create, open, edit 
// and save project files to the /projects directory
var fs = require("fs");

// Request to delete a project
router.delete("/:projectID", function(req, res, next){
    res.send("DELETE request received from userID=" + req.userID + " for projectID=" + req.params.project);
});

// Request to delete a collection from a project
router.delete("/:projectID/:collection", function(req, res, next){
    res.send("DELETE request received from userID=" + req.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection);
});

// Request to delete an item from a collection within a project
router.delete("/:projectID/:collection/:item", function(req, res, next){
    // Temporarily storing the collection name (as requested in the URL parameters) on
    // the request object, so that it can be used throughout this route. Transforming
    // the collection name to lowercase, for use within the route. 
    req.collectionName = req.params.collection.toLowerCase();

    // Temporarily storing the item name (as requested in the URL parameters) on
    // the request object, so that it can be used throughout this route. Transforming
    // the item name to lowercase, for use within the route. 
    req.itemName = req.params.item.toLowerCase();

    // Checking if the user has the appropriate access level to be able to delete
    // an item from this project
    switch(req.user_access_level) {
        default: {
            // Creating a temporary variable, to store the current project content, so
            // that it can be updated based on the request
            var updatedProjectContent = req.fileData.content;
                    
            // Determining what data type the collection that this item exists within is,
            // so as to decide how best to remove this item from it
            switch(updatedProjectContent[req.collectionName].constructor){
                case Array: {
                    console.log("array");
                    // Accessing the requested collection, from the temporary project content
                    // file, and splicing the requested item from it (removing only 1)
                    updatedProjectContent[req.collectionName].splice([req.itemName], 1);
                }
            }

            
            // Checking that a change has been made to the project content i.e. that it
            // is not the same as it was when the file was first read in at the beginning of
            // this request
            if(JSON.stringify(updatedProjectContent) != req.fileData.content){
                // Updating the content.json file of the project, with the updated project content
                // as a JSON string
                fs.writeFile("./projects/" + req.params.projectID + "/content.json", JSON.stringify(updatedProjectContent), function(err){
                    if(err) {
                        // Logging the error to the console
                        console.log("Error updating content.json file " + err);

                        // Unable to update the project content.json file. Adding this as 
                        // an error to the feedsErrors array.
                        req.feedsErrors.push("Server error - unable to update the project content");

                        // Since this is a significant issue, passing this request to the feeds-errors
                        // route, by calling the next method with an empty error (as all errors will be
                        // accessible from the feedsErrors array).
                        next(new Error());
                    } else {
                        console.log("Project content file updated");

                        // Returning the updated project collection, that no longer contains this item,
                        // as the response to the request
                        res.send(updatedProjectContent[req.collectionName]);
                    }
                });
            }

            break;
        }
    }          
});

// Exporting the router that was set up in this file, so that it can be included
// in the feeds.js route and specified as the route for all delete requests to delete
// elements from a project
module.exports = router;