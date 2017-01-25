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
var dbconn = require("../database/connection.js");

// Requiring the custom google OAuth module, which exports an object with 
// a method to generate a new oauth url, and a method which returns
// a new OAuth2Client.
var googleOAuth = require("../google/googleOAuth");

// All
router.use(require("./components/feeds/request-validation.js"));
router.use(require("./components/feeds/preload-filedata.js"));

// CREATE (post)
router.use(require("./components/feeds/feeds-create.js"));

// READ (get)
router.use(require("./components/feeds/feeds-read.js"));

// UPDATE (put)
router.use(require("./components/feeds/feeds-update.js"));

// DELETE (delete)
router.use(require("./components/feeds/feeds-delete.js"));

//---------------------------------------------------------------------------------------------------------

// Request to get the list of projects accessible by this user
router.get("/", function(req, res, next){
    console.log("GET request from " + req.userID + " to view all projects");

    // Checking that a userID has been provided within the request
    if(req.userID != null){
        // Querying the database, to find the projects that this user has access to, by joining
        // the user table to the user_projects table. Returning only the columns needed for the 
        // reponse to the user
        dbconn.query("SELECT up.project_id, p.project_name, up.user_access_level FROM Project p LEFT JOIN User_Project as up ON p.id = up.project_id WHERE up.user_id =" + dbconn.escape(req.userID), function(err, rows, fields){
            if(err){
                // Logging this error to the console
                console.log(err);

                // An error has occurred in the database. Adding this as an error to the feedsErrors array.
                req.feedsErrors.push("Server error - unable to access this users projects");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                next(new Error());
            } else {
                // Checking that at least one project has been returned from the database
                if(rows.length > 0){
                    // Sending the resulting rows from the database query, as the response
                    // to the user. These rows will only contain the columns specified in the 
                    // query i.e. project ID, project name and user acces level
                    res.send(rows);
                } else {
                    res.send("This user has no projects");
                }
            }
        });
    } else {
        // This request has no userID, and so it was not possible to find this
        // users projects. Adding this as an error to the feedsErrors array.
        req.feedsErrors.push("No body provided in the request");

        // Since this is a significant issue, passing this request to the feeds-errors
        // route, by calling the next method with an empty error (as all errors will be
        // accessible from the feedsErrors array).
        next(new Error());
    }
    
});

// Request to add a collaborator to a project
router.put("/:projectID/addCollaborator", function(req, res, next){
    // Checking that an email address has been included in the request object
    if(req.body.email != null && req.body.email.length > 0){
        // Querying the database, to see if a user with this email address already exists
        dbconn.query("SELECT id FROM User WHERE email_address=" + dbconn.escape(req.body.email), function(err, rows, fields){
            if(err){
                // Logging the error to the console
                console.log("Error checking if user exists " + err);

                // Unable to check if this user already exists. Adding this as an error to the 
                // feedsErrors array.
                req.feedsErrors.push("Server error - unable to add collaborator to project");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                next(new Error());
            } else {
                // Checking if any results were returned from the database i.e. does this user
                // already exist
                if(rows.length > 0){
                    console.log("This is an existing user");
                    
                    // This is an existing user. Setting the newCollaboratorID to be equal to
                    // the ID of this user
                    req.newCollaboratorID = rows[0].id;

                    // Passing this request on to the next stage of this route, so that 
                    // this existing user can be added to the project
                    next();
                } else {
                    console.log("This is a new user");

                    // Creating a new user in the database, using the email provided in the request body
                    dbconn.query("INSERT INTO User(email_address) VALUES(" + dbconn.escape(req.body.email) +")", function(err, result){
                        if(err){
                            // Logging the error to the console
                            console.log("Error adding new user " + err);

                            // Unable add this new user to the database. Adding this as an error to the 
                            // feedsErrors array.
                            req.feedsErrors.push("Server error - unable to add collaborator to project");

                            // Since this is a significant issue, passing this request to the feeds-errors
                            // route, by calling the next method with an empty error (as all errors will be
                            // accessible from the feedsErrors array).
                            next(new Error());
                        } else {
                            // Setting the newCollaboratorID to the ID of the newly created user
                            req.newCollaboratorID = result.insertId;

                            // Passing this request on to the next stage of this route, so that 
                            // this new user can be added to the project
                            next();
                        }
                    });
                }
            }
        });
    }
});
// Continued - Continuation of route for request to add a collaborator to a project
router.put("/:projectID/addCollaborator", function(req, res, next){
    // Checking if an access level property was provided in the request, and that the
    // value of that property is greater than 0
    if(req.body.accessLevel != null && req.body.accessLevel > 0){
        // Querying the database, to check if this user is already connected with this project
        dbconn.query("SELECT * FROM User_Project WHERE user_id=" + req.newCollaboratorID + " AND project_id=" + req.params.projectID, function(err, rows, fields){
            if(err){
                // Logging the error to the console
                console.log("Error checking if user is already a contributor to project " + err);

                // Unable to check if this user is already connected to this project. Adding this as 
                // an error to the feedsErrors array.
                req.feedsErrors.push("Server error - unable to add collaborator to project");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                next(new Error());
            } else {
                // Checking if any results were returned from the database i.e. if this user is
                // already a collaborator on this project
                if(rows.length > 0){
                    // Determining if this users current access level is the same as the one
                    // included in the request i.e. to see if any change of access level is necessary
                    if(req.body.accessLevel == rows[0].user_access_level){
                        // Logging the error to the console
                        console.log("This user is already a collaborator on this project");

                        // This user already has this access level to the proejct. Adding this as 
                        // an error to the feedsErrors array.
                        req.feedsErrors.push("This user already has the requested access level for this project");

                        // Since this is a significant issue, passing this request to the feeds-errors
                        // route, by calling the next method with an empty error (as all errors will be
                        // accessible from the feedsErrors array).
                        next(new Error());
                    } else {
                        // As this is a different access level for this user, for this project, updating the
                        // user_project table to reflect this i.e. changing this users level for this project
                        dbconn.query("UPDATE User_Project SET user_access_level=" + dbconn.escape(req.body.accessLevel) + "WHERE user_id=" + req.newCollaboratorID, function(err, result) {
                            if(err){
                                // Logging the error to the console
                                console.log("Error updating user on project " + err);

                                // Unable to update this users access level to this project. Adding this as 
                                // an error to the feedsErrors array.
                                req.feedsErrors.push("Server error - unable update this users access level to this project");

                                // Since this is a significant issue, passing this request to the feeds-errors
                                // route, by calling the next method with an empty error (as all errors will be
                                // accessible from the feedsErrors array).
                                next(new Error());
                            } else {
                                console.log("Collaborators access level updated on project");

                                // Returning an empty JSON string, as the users access level has been updated
                                res.send("{}");
                            }
                        });
                    }
                } else {
                    // This user has not previously been a collaborator on this project, so creating a new
                    // relationship between the user and the project, using the access level provided
                    dbconn.query("INSERT INTO User_Project(user_id, project_id, user_access_level) VALUES(" + req.newCollaboratorID + ", " + req.params.projectID + ", " + dbconn.escape(req.body.accessLevel) + ")", function(err, result) {
                        if(err){
                            // Logging the error to the console
                            console.log("Error adding user to project " + err);

                            // Unable to create new entry in the user_project table. Adding this as 
                            // an error to the feedsErrors array.
                            req.feedsErrors.push("Server error - unable to add collaborator to project");

                            // Since this is a significant issue, passing this request to the feeds-errors
                            // route, by calling the next method with an empty error (as all errors will be
                            // accessible from the feedsErrors array).
                            next(new Error());
                        } else {
                            console.log("New collaborator added to project");

                            // Sending a response with an empty JSON string, as the collaborator
                            // has been successfully added to the project
                            res.send("{}");
                        }
                    });
                }
            }
        });
    } else {
        // Logging the error to the console
        console.log("No access level provided in the request");

        // No access level was provided in the request, unable to add collaborator. Adding this as 
        // an error to the feedsErrors array.
        req.feedsErrors.push("Unable to add collaborator to project - no access level provided in the request");

        // Since this is a significant issue, passing this request to the feeds-errors
        // route, by calling the next method with an empty error (as all errors will be
        // accessible from the feedsErrors array).
        next(new Error());
    }
});

// Exporting the router that was set up in this file, so that it can be included
// in the app.js file and specified as the route for all requests to the "/feeds" route
module.exports = router;