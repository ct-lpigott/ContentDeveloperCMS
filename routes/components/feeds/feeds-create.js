// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Requiring the file system module, so that this route can have access
// to the file system of the server i.e. to be able to create, open, edit 
// and save project files to the /projects directory
var fs = require("fs");

// Requiring the custom database connection module, so that the one
// connection to the database can be reused throughout the application.
var dbconn = require("../../../database/connection.js");

// Request to create a new project
router.post("/", function(req, res, next){
    console.log("POST to create new project");

    // Checking that a project name has been included in the request body
    if(req.body.projectName != null){
        // Creating a new project in the database, using the project name provided 
        // in the request body, escaping this value before passing it to the database
        dbconn.query("INSERT INTO Project(project_name) VALUES(" + dbconn.escape(req.body.projectName) + ")", function(err, result){
            if(err){
                // Logging the error to the console
                console.log(err);

                // As it has not been possible to create the new project in the 
                // projects table, adding this as an error to the feedsErrors array.
                req.feedsErrors.push("Unable to create this project");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                next(new Error());
            } else {
                // Storing the ID of the newly created project, as returned in the result object
                // from the database query, as a temporary variable on the request object, so that
                // it can be used throughout the rest of this requests routing
                req.projectID = result.insertId;

                // Creating a new entry in the User_Project database, to add the current user as an
                // administrator of this project. Defaulting this user to have the highest level
                // of access to this project i.e. 1
                dbconn.query("INSERT INTO User_Project(user_id, project_id, user_access_level) VALUES(" + req.userID + ", " + req.projectID + ", 1)", function(err, result){
                    if(err){
                        // Logging the error to the console
                        console.log("Error - Unable to link this new project with the current user", err);

                        // As it has not been possible to create the relationship between the new 
                        // project and this user, adding this as an error to the feedsErrors array.
                        req.feedsErrors.push("Server error - unable to create project");

                        // Since this is a significant issue, passing this request to the feeds-errors
                        // route, by calling the next method with an empty error (as all errors will be
                        // accessible from the feedsErrors array).
                        next(new Error());
                    } else {
                        // Creating a new directory within the /projects directory, so that all files
                        // relating to this project can be stored within it. Setting the directory name
                        // to be equal to the ID of the new project i.e. the first project created on this
                        // server will have all of its project files stores in /projects/1/
                        fs.mkdir("./projects/" + req.projectID, function(err){
                            if(err){
                                // Logging the error to the console
                                console.log("Error making folder " + err);

                                // As it has not been possible to create the folder for this project, 
                                // adding this as an error to the feedsErrors array.
                                req.feedsErrors.push("Server error - unable to create project");

                                // Since this is a significant issue, passing this request to the feeds-errors
                                // route, by calling the next method with an empty error (as all errors will be
                                // accessible from the feedsErrors array).
                                next(new Error());
                            } else {
                                // Loading in the project template file, which will be used to instantiate the
                                // admin.json file for this project 
                                fs.readFile("./projects/project_template.json", function(err, data){
                                    // Creating a projectTemplate object. Defaulting this to be an empty
                                    // object, which will be replaced by the contents of the template file,
                                    // if this was loaded without error.
                                    var projectTemplate = {};

                                    // Checking if an error occurred when loading the template
                                    if(err){
                                        // Logging this to the console
                                        console.log("Error reading project template file " + err);
                                    } else {
                                        // Setting the project template to be equal to the contents
                                        // of the template file, parsed from JSON to be an object
                                        projectTemplate = JSON.parse(data);
                                    }
                                        
                                    // Setting the default values for the properties of the project template 
                                    // file i.e. the ID and name of the project, the date it was created,
                                    // as well as the date it was last updated (both will be the same date
                                    // as this is a new project). Finally, setting the last_updated_by
                                    // property to the current users ID
                                    projectTemplate.project_id = req.projectID;
                                    projectTemplate.project_name = req.body.projectName;
                                    projectTemplate.date_created = projectTemplate.date_updated = Date.now();
                                    projectTemplate.last_updated_by = req.userID;

                                    // Creating the admin.json file for this project, within the directory that
                                    // was created above. Passing in a JSON string of the projectTemplate
                                    // object created above, so that this will be the initial content for this
                                    // file.
                                    fs.writeFile("./projects/" + req.projectID + "/admin.json", JSON.stringify(projectTemplate), function(err){
                                        if(err) {
                                            // Logging the error to the console
                                            console.log("Error making admin.json file " + err);

                                            // As it has not been possible to create the admin.json file for this 
                                            // project, adding this as an error to the feedsErrors array.
                                            req.feedsErrors.push("Server error - unable to create project");

                                            // Since this is a significant issue, passing this request to the feeds-errors
                                            // route, by calling the next method with an empty error (as all errors will be
                                            // accessible from the feedsErrors array).
                                            next(new Error());
                                        } else {
                                            console.log("Project admin file created");

                                            // Creating a new content.json file for this project, within the project
                                            // directory created above. Passing in an empty object (as a JSON string)
                                            // as this file will not yet contain any content
                                            fs.writeFile("./projects/" + req.projectID + "/content.json", "{}", function(err){
                                                if(err) {
                                                    // Logging the error to the console
                                                    console.log("Error making file " + err);

                                                    // As it has not been possible to create the content.json file for this 
                                                    // project, adding this as an error to the feedsErrors array.
                                                    req.feedsErrors.push("Server error - unable to create project");

                                                    // Since this is a significant issue, passing this request to the feeds-errors
                                                    // route, by calling the next method with an empty error (as all errors will be
                                                    // accessible from the feedsErrors array).
                                                    next(new Error());
                                                } else {
                                                    console.log("Project content file created");

                                                    // As this project has now successfully been created, redirecting this request
                                                    // to the /feeds/userID route, so that the list of projects belonging to this
                                                    // user (which will now include this new project) will be returned in the
                                                    // response object
                                                    res.redirect("/feeds/" + req.userID);
                                                }
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    } else {
        // This request has no project name, and so cannot continue through this
        // route. Adding this as an error to the feedsErrors array.
        req.feedsErrors.push("No new project name provided in the request");

        // Since this is a significant issue, passing this request to the feeds-errors
        // route, by calling the next method with an empty error (as all errors will be
        // accessible from the feedsErrors array).
        next(new Error());
    }
    
});

// Request to add a collection to a project
router.post("/:projectID", function(req, res, next){
    res.send("POST request received from userID=" + req.userID + " for projectID=" + req.params.project);
});

// Request to add an item to a collection within a project
router.post("/:projectID/:collection", function(req, res, next){
    res.send("POST request received from userID=" + req.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection);
});

// Exporting the router that was set up in this file, so that it can be included
// in the feeds.js route and specified as the route for all post requests to create
// elements in a project
module.exports = router;