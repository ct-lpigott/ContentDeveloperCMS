// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Requiring the custom database connection module, so that the one
// connection to the database can be reused throughout the application.
var dbconn = require("../../../database/connection.js");

var sendEmail = require("../../../email/send_email.js");

var googleOAuth = require("../../../google/googleOAuth.js");

var simpleGit = require("simple-git");

var accessLevels = require("../../../custom_modules/access_levels.js");

// Request to get the list of projects accessible by this user
router.get("/", function(req, res, next){
    console.log("GET request from " + req.userID + " to view all projects");  

    // Checking that a userID has been provided within the request
    if(req.userID != null){
        // Querying the database, to find the projects that this user has access to, by joining
        // the user table to the user_projects table. Returning only the columns needed for the 
        // reponse to the user
        dbconn.query("SELECT up.user_id, up.project_id, up.access_level_int, p.project_name FROM User_Project up LEFT JOIN Project p ON p.id = up.project_id WHERE up.user_id =" + dbconn.escape(req.userID), function(err, rows, fields){
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
                    accessLevels.appendAllAccessLevelNames(rows, null, function(fullAccessLevelDetails){
                        res.send(fullAccessLevelDetails);
                    });
                } else {
                    // This user has no projects
                    res.send("{}");
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

router.post("/:projectID", function(req, res, next){
    if(req.query.action != null){
        next();
    } else {
        next("route");
    }
});

// Request to add a collaborator to a project
router.post("/:projectID", function(req, res, next){
    if(req.query.action == "addCollaborator"){
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
    } else {
        next();
    }
});
// Continued - Continuation of route for request to add a collaborator to a project
router.post("/:projectID", function(req, res, next){
    if(req.query.action == "addCollaborator"){
        // Checking if an access level property was provided in the request, and that the
        // value of that property is greater than 0
        if(req.body.accessLevelInt != null){
            // Querying the database, to check if this user is already connected with this project
            dbconn.query("SELECT * FROM User_Project up WHERE user_id=" + req.newCollaboratorID + " AND project_id=" + req.params.projectID, function(err, rows, fields){
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
                        if(req.body.accessLevelInt == rows[0].access_level_int){
                            // Logging the error to the console
                            console.log("This user is already a collaborator on this project");

                            res.redirect(303, "/feeds/" + req.params.projectID + "?action=getCollaborators");
                        } else {
                            // As this is a different access level for this user, for this project, updating the
                            // user_project table to reflect this i.e. changing this users level for this project
                            dbconn.query("UPDATE User_Project SET access_level_int=" + dbconn.escape(req.body.accessLevelInt) + "WHERE user_id=" + req.newCollaboratorID, function(err, result) {
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

                                    dbconn.query("SELECT * FROM User_Project up LEFT JOIN User u ON u.id = up.user_id LEFT JOIN Project p ON p.id = up.project_id WHERE u.id=" + dbconn.escape(req.newCollaboratorID), function(err, rows, fields){
                                        if(err){
                                            console.log(err);
                                        } else {
                                            if(rows.length > 0){
                                                var accessLevelName = accessLevels.getAccessLevelName(rows[0].access_level_int, rows[0].access_levels);
                                                sendEmail.accessLevelChanged(rows[0].email_address, rows[0].display_name, rows[0].project_name, accessLevelName);
                                            } 
                                        }
                                    }); 

                                    res.redirect(303, "/feeds/" + req.params.projectID + "?action=getCollaborators");
                                }
                            });
                        }
                    } else {
                        
                        dbconn.query("SELECT * FROM User_Project up LEFT JOIN User u ON up.user_id = u.id LEFT JOIN Project p ON up.project_id = p.id WHERE up.project_id = " + req.params.projectID + " AND up.user_id = " + req.userID, function(err, rows, fields){
                            if(err){
                                console.log(err);
                            } else {
                                if(rows.length > 0){
                                    googleOAuth.addUserToMediaFolder(rows[0].media_folder_id, req.body.email, rows[0].google_auth_token, "writer", function(newPermissionId){
                                        if(newPermissionId != null){
                                            console.log(newPermissionId);
                                            // This user has not previously been a collaborator on this project, so creating a new
                                            // relationship between the user and the project, using the access level provided
                                            dbconn.query("INSERT INTO User_Project(user_id, project_id, access_level_int, media_folder_permission_id) VALUES(" + req.newCollaboratorID + ", " + req.params.projectID + ", " + dbconn.escape(req.body.accessLevelInt) + ", " + dbconn.escape(newPermissionId) + ")", function(err, result) {
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
                    
                                                    dbconn.query("SELECT u.email_address, u.display_name, p.project_name FROM User_Project up LEFT JOIN User u ON u.id = up.user_id LEFT JOIN Project p ON p.id = up.project_id WHERE u.id=" + dbconn.escape(req.newCollaboratorID), function(err, rows, fields){
                                                        if(err){
                                                            console.log(err);
                                                        } else {
                                                            if(rows.length > 0){
                                                                sendEmail.addedToProject(rows[0].email_address, rows[0].display_name, rows[0].project_name);
                                                            } 
                                                        }
                                                    });                    
                    
                                                    res.redirect(303, "/feeds/" + req.params.projectID + "?action=getCollaborators");
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    console.log("No user could be found");
                                }
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
    } else {
        next();
    }
});

// Request to get all collaborators for a project
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "getCollaborators"){
        // Querying the database, to get all collaborators for this project

        dbconn.query("SELECT u.display_name, up.user_id, up.access_level_int FROM User_Project up LEFT JOIN User u ON up.user_id = u.id WHERE up.project_id=" + dbconn.escape(req.params.projectID), function(err, rows, fields){
            if(err){

            } else {
                if(rows.length > 0){
                    accessLevels.appendAllAccessLevelNames(rows, req.params.projectID, function(fullAccessLevelDetails){
                        res.send(fullAccessLevelDetails);
                    });
                }
            }
        });
    } else {
        next();
    }
});

// Request to delete a collaborator from a project
router.delete("/:projectID", function(req, res, next){
    if(req.query.action == "removeCollaborator"){
        if(req.body.collaboratorID != null){
            dbconn.query("SELECT * FROM User_Project up LEFT JOIN User u ON up.user_id = u.id LEFT JOIN Project p ON up.project_id = p.id WHERE up.project_id = " + req.params.projectID, function(err, rows, fields){
               if(err){
                   console.log(err);
               } else {
                   if(rows.length > 0){
                       var currentUserAuthToken = "";
                       var collaboratorPermissionId = "";
                       for(var i=0; i<rows.length; i++){
                           if(rows[i].user_id == req.userID){
                               currentUserAuthToken = rows[i].google_auth_token;
                           } else if(rows[i].user_id == req.body.collaboratorID){
                               collaboratorPermissionId = rows[i].media_folder_permission_id;
                           }
                       }
                       if(currentUserAuthToken != null && collaboratorPermissionId != null){
                           googleOAuth.removeUserFromMediaFolder(rows[0].media_folder_id, collaboratorPermissionId, currentUserAuthToken, function(){
                                dbconn.query("DELETE FROM User_Project WHERE project_id=" + dbconn.escape(req.params.projectID) + " AND user_id=" + dbconn.escape(req.body.collaboratorID), function(err, rows, fields){
                                    if(err){
                                
                                    } else {
                                        console.log("Collaborator " + req.body.collaboratorID + " has been removed from project " + req.params.projectID);
                                        
                                        dbconn.query("SELECT email_address, display_name FROM User WHERE id=" + dbconn.escape(req.body.collaboratorID), function(err, rows, fields){
                                            if(err){
                                                console.log(err);
                                            } else {
                                                if(rows.length > 0){
                                                    sendEmail.removedFromProject(rows[0].email_address, rows[0].display_name, req.params.projectID);
                                                } 
                                            }
                                        });   
                                
                                        res.redirect(303, "/feeds/" + req.params.projectID + "?action=getCollaborators");
                                    }
                                });
                            });
                       } else {
                           console.log("User could not be found");
                       }
                   } else {
                       console.log("User could not be found");
                   }
               }
            });
        } else {
            // Error - no collaborator specified
        }
        
    } else {
        next();
    }
});

// Request to upload a media item to a project
router.post("/:projectID", function(req, res, next){
    if(req.query.action == "uploadFile"){
        console.log("Uploading file");
        if(req.file != null){
            dbconn.query("SELECT google_auth_token, media_folder_id FROM Project p LEFT JOIN User_Project up on p.id = up.project_id LEFT JOIN User u ON u.id = up.user_id WHERE p.id = " + req.params.projectID + " AND up.user_id = " + req.userID, function(err, rows, fields){
                if(err){
                    console.log(err);
                } else {
                    if(rows.length > 0){
                        googleOAuth.uploadMediaItem(req.file, rows[0].media_folder_id, rows[0].google_auth_token, function(fileUrl){
                            console.log("FILE UPLOAD");
                            req.responseObject.fileUrl = "https://drive.google.com/uc?id=" + fileUrl;
                            //req.responseObject.fileUrl = "../uploads/" + req.file.filename;
                            res.send(req.responseObject);
                        });
                    }
                }
            });
        } else {
            console.log("No file");
            res.send();
        }
    } else {
        next();
    }
});

// Request to get all access levels for a project
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "accessLevels"){
        accessLevels.getProjectAccessLevels(req.params.projectID, function(projectAccessLevels){
            accessLevels.appendAccessLevelsInUse(req.params.projectID, projectAccessLevels, function(updatedProjectAccessLevels){
                res.send(projectAccessLevels);
            });
        });
    } else {
        next();
    }
});

// Request to create new access level
router.post("/:projectID", function(req, res, next){
    if(req.query.action == "accessLevels"){
        if(req.body.access_level_name != null){
            accessLevels.createNewAccessLevel(req.params.projectID, req.body.access_level_name, req.body.access_level_int, function(){
                res.redirect(303, "/feeds/" + req.params.projectID + "?action=accessLevels&userID=" + req.userID);
            });
        } else {
            console.log("Not enough info supplied");
        }
    } else {
        next();
    }
});

// Request to delete an access level
router.delete("/:projectID", function(req, res, next){
    if(req.query.action == "accessLevels"){
        if(req.body.access_level_int != null){
            accessLevels.removeAccessLevel(req.params.projectID, req.body.access_level_int, function(){
                res.redirect(303, "/feeds/" + req.params.projectID + "?action=accessLevels&userID=" + req.userID);
            });
        } else {
            console.log("Not enough info supplied");
        }
    } else {
        next();
    }
});

// Request to update an access level
router.put("/:projectID", function(req, res, next){
    if(req.query.action == "accessLevels"){
        if(req.body.access_level_int != null && req.body.access_level_name != null){
            accessLevels.updateAccessLevelName(req.params.projectID, req.body.access_level_int, req.body.access_level_name, function(){
                res.redirect(303, "/feeds/" + req.params.projectID + "?action=accessLevels&userID=" + req.userID);
            });
        } else {
            console.log("Not enough info supplied");
        }
    } else {
        next();
    }
});

// Request to update an access level
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "mediaFiles"){
        dbconn.query("SELECT * FROM User_Project up LEFT JOIN User u ON up.user_id = u.id LEFT JOIN Project p ON up.project_id = p.id WHERE up.project_id=" + req.params.projectID, function(err, rows, fields){
            if(err){
                console.log(err);
            } else {
                if(rows.length > 0){
                    googleOAuth.getAllProjectImages(req.params.projectID, rows[0].media_folder_id, rows[0].google_auth_token, req.query.numFiles, req.query.nextPageToken, function(results){
                        res.send(results);
                    });
                } else {
                    console.log("Could not find user");
                }
            }
        });
    } else {
        next();
    }
});

// Request to update a projects name
router.put("/:projectID", function(req, res, next){
    if(req.query.action == "projectName"){
        if(req.body.projectName != null){
            dbconn.query("UPDATE Project SET project_name = " + dbconn.escape(req.body.projectName) + " WHERE id=" + req.params.projectID, function(err, rows, fields){
                if(err){
                    console.log(err);
                } else {
                    res.send("{}");
                }
            });
        } else {
            req.feedsErrors.push("No project name provided in the request");
            next(new Error());
        }        
    } else {
        next();
    }
});

router.put("/:projectID", function(req, res, next){
    if(req.query.action == "cache"){
        if(req.body.max_cache_age != null){
            dbconn.query("UPDATE Project SET max_cache_age=" + dbconn.escape(req.body.max_cache_age) + " WHERE id=" + req.params.projectID, function(err, result){
                if(err){
                    console.log(err);
                } else {
                    res.send({max_cache_age: req.body.max_cache_age});
                }
            });
        } else {
            req.feedsErrors.push("No maximum cache age included in the request");
            next(new Error());
        }        
    } else {
        next();
    }
});

router.get("/:projectID", function(req, res, next){
    if(req.query.action == "css"){
        dbconn.query("SELECT * FROM Project WHERE id=" + req.params.projectID, function(err, rows, fields){
            if(err){
                console.log(err);
            } else {
                if(rows.length > 0){
                    res.send({custom_css: rows[0].custom_css})
                } else {
                    console.log("Cannot find project");
                }
            }
        });
    } else {
        next();
    }
});

router.post("/:projectID", function(req, res, next){
    if(req.query.action == "css"){
        if(req.body.custom_css != null){
            dbconn.query("SELECT custom_css FROM Project WHERE id=" + req.params.projectID, function(err, rows, fields){
                if(err){
                    console.log(err);
                } else {
                    if(rows.length > 0){
                        req.custom_css = rows[0].custom_css + " " + req.body.custom_css;
                        next();
                    } else {
                        req.custom_css = req.body.custom_css;
                        next();
                    }
                }
            });
        } else {
            req.feedsErrors.push("No custom css included in the request");
            next(new Error());
        }
    } else {
        next();
    }
});

router.put("/:projectID", function(req, res, next){
    if(req.query.action == "css"){
        if(req.body.custom_css != null){
            req.custom_css = req.body.custom_css;
            next();
        } else {
            req.feedsErrors.push("No custom css included in the request");
            next(new Error());
        }
    } else {
        next();
    }
});

router.all("/:projectID", function(req, res, next){
    if(req.query.action == "css"){
        if(req.custom_css != null){
            dbconn.query("UPDATE Project SET custom_css=" + dbconn.escape(req.custom_css) + " WHERE id=" + req.params.projectID, function(err, result){
                if(err){
                    console.log(err);
                } else {
                    res.redirect(303, "/feeds/" + req.params.projectID + "?action=css");
                }
            });
        } else {
            req.feedsErrors.push("No custom css included in the request");
            next(new Error());
        }
    } else {
        next();
    }
});
// Exporting the router that was set up in this file, so that it can be included
// in the app.js file and specified as the route for all requests to the "/feeds" route
module.exports = router;