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

var sendEmail = require("../../../email/send_email.js");

var googleOAuth = require("../../../google/googleOAuth.js");

var simpleGit = require("simple-git");

var accessLevels = require("../../../custom_modules/access_levels.js");

/**
 * @api {get} /feeds/:projectID?allSettings Get all settings for a project
 * @apiParam {int} :projectID Projects unique ID
 * @apiName GetProjectSettings
 * @apiGroup ProjectDetails
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.allSettings != null){
        req.query.action = "collaborators";
    }
    next();
});

/**
 * @api {put} /feeds/:projectID?allSettings Update all settings for a project
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} [project_name]
 * @apiParam {int} [max_cache_age]
 * @apiParam {string} [custom_css]
 * @apiName UpdateProjectSettings
 * @apiGroup ProjectDetails
 */
router.put("/:projectID", function(req, res, next){
    if(req.query.allSettings != null){
        req.query.action = "project_name";
    }
    next();
});

router.all("/:projectID", function(req, res, next){
    if(req.query.action != null){
        if(req.userID != null){
            next();
        } else {
            req.feedsErrors.push("Only authenticated users can request actions");
            next(new Error());
        }        
    } else {
        next("route");
    }
});

/**
 * @api {get} /feeds?action=collaborators Get projects that current user is a collaborator on
 * @apiName GetUserProjects
 * @apiGroup Collaborators
 */
router.get("/", function(req, res, next){
    if(req.query.action == "collaborators"){
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
    } else {
        next();
    }    
});

/**
 * @api {post} /feeds?action=createProject Create a new project
 * @apiParam {string} project_name Name for the new proejct
 * @apiName CreateProject
 * @apiGroup ProjectDetails
 */
router.post("/", function(req, res, next){
    if(req.query.action == "createProject"){
        console.log("POST to create new project");

        // Checking that a project name has been included in the request body
        if(req.body.project_name != null){

            googleOAuth.createNewProjectFolder(req.body.project_name, req.userID, function(newGoogleFolderId){
                console.log(newGoogleFolderId);
                // Creating a new project in the database, using the project name provided 
                // in the request body, escaping this value before passing it to the database
                dbconn.query("INSERT INTO Project(project_name, access_levels, media_folder_id) VALUES(" + dbconn.escape(req.body.project_name) + ", " + dbconn.escape(JSON.stringify(accessLevels.getDefaultAccessLevels())) + ", " + dbconn.escape(newGoogleFolderId) + ")", function(err, result){
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
                        dbconn.query("INSERT INTO User_Project(user_id, project_id, access_level_int) VALUES(" + req.userID + ", " + req.projectID + ", 1)", function(err, result){
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
                                        if(req.body.template != "null" && req.body.template != null && req.body.template.length > 0){
                                            // Loading in the project template file, which will be used to instantiate the
                                            // admin.json file for this project 
                                            fs.readFile("./project_defaults/templates/" + req.body.template + ".json", function(err, data){
                                                if(err){
                                                    console.log(err);
                                                } else {
                                                    req.templateProjectStructure = JSON.parse(data);
                                                    next();
                                                }
                                            });
                                        } else {
                                            next();
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
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
    } else {
        next();
    }    
});

// No API documentation needed - continuation of route
router.post("/", function(req, res, next){
    if(req.query.action == "createProject"){
        // Setting the default values for the properties of the project template 
        // file i.e. the ID and name of the project, the date it was created,
        // as well as the date it was last updated (both will be the same date
        // as this is a new project). Finally, setting the last_updated_by
        // property to the current users ID
        var projectAdmin = {};
        projectAdmin.project_id = req.projectID;
        projectAdmin.date_created = projectAdmin.date_updated = Date.now();
        projectAdmin.last_updated_by = req.userID;
        projectAdmin.project_structure = req.templateProjectStructure || {};

        // Creating the admin.json file for this project, within the directory that
        // was created above. Passing in a JSON string of the projectTemplate
        // object created above, so that this will be the initial content for this
        // file.
        fs.writeFile("./projects/" + req.projectID + "/admin.json", JSON.stringify(projectAdmin), function(err){
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

                        // Setting defaults to be used as the Git Credentials, incase there
                        // is any issue with the query to the database, or the user's details
                        // are not available
                        var gitDisplayName = "Content Developer";
                        var gitEmailAddress = process.env.EMAIL_ADDRESS;
                    
                        // Creating a new Git repository for this project, and initialising it
                        var newGitRepo = simpleGit("./projects/" + req.projectID);
                        newGitRepo.init();

                        var userDetails = dbconn.query("SELECT * FROM User WHERE id=" + req.userID, function(err, rows, fields){
                            
                            if(err){
                                console.log("Issue when querying the database for the users details - git - " + err);
                                // Not dealing with the error any further, as a response will already have been sent
                                // to the client
                            } else {
                                if(rows.length > 0){
                                    // Accessing the user's name and email address from the database
                                    gitDisplayName = rows[0].display_name;
                                    gitEmailAddress = rows[0].email_address;
                                }
                            }

                            // Setting up the configuration for this user, and then committing
                            // all files in the project folder i.e. as the first commit to the
                            // project
                            newGitRepo
                                .addConfig("user.name", gitDisplayName)
                                .addConfig("user.email", gitEmailAddress)
                                .add("./*")
                                .commit("'" + req.body.project_name + "' project files created", function(){
                                    res.send({new_project_id: req.projectID});
                                });
                        });                      
                    }
                });
            }
        });
    } else {
        next();
    }
});

/**
 * @api {post} /feeds/:projectID?action=collaborators Add a collaborator to a project
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} email Email address of the collaborator to be added
 * @apiParam {int} accessLevelInt Requested access level
 * @apiName AddCollaborator
 * @apiGroup Collaborators
 */
router.post("/:projectID", function(req, res, next){
    if(req.query.action == "collaborators"){
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
    if(req.query.action == "collaborators"){
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

                            if(req.headers.origin != null){
                                res.send({});
                            } else {
                                res.redirect(303, "/feeds/" + req.params.projectID + "?action=collaborators");
                            }
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
                                    if(req.headers.origin != null){
                                        res.send({});
                                    } else {
                                        res.redirect(303, "/feeds/" + req.params.projectID + "?action=collaborators");
                                    }
                                }
                            });
                        }
                    } else {
                        
                        dbconn.query("SELECT * FROM User_Project up LEFT JOIN Project p ON up.project_id = p.id WHERE up.project_id = " + req.params.projectID + " AND up.user_id = " + req.userID, function(err, rows, fields){
                            if(err){
                                console.log(err);
                            } else {
                                if(rows.length > 0){
                                    googleOAuth.addUserToMediaFolder(rows[0].media_folder_id, req.body.email, req.userID, "writer", function(newPermissionId){
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
                    
                                                    if(req.headers.origin != null){
                                                        res.send({});
                                                    } else {
                                                        res.redirect(303, "/feeds/" + req.params.projectID + "?action=collaborators");
                                                    }
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

/**
 * @api {put} /feeds/:projectID?action=collaborators Update a collaborators access level to a project
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} collaboratorID User id of the collaborator to be updated
 * @apiParam {int} accessLevelInt  Requested access level
 * @apiName UpdateCollaborator
 * @apiGroup Collaborators
 */
router.put("/:projectID", function(req, res, next){
    if(req.query.action == "collaborators"){
        // Checking that an email address has been included in the request object
        if(req.body.collaboratorID != null && req.body.accessLevelInt != null){
            dbconn.query("UPDATE User_Project SET access_level_int=" + dbconn.escape(req.body.accessLevelInt) + "WHERE user_id=" + req.body.collaboratorID, function(err, result) {
                if(err){
                    console.log(err);
                } else {
                    if(req.headers.origin != null){
                        res.send({});
                    } else {
                        res.redirect(303, "/feeds/" + req.params.projectID + "?action=collaborators");
                    }                    
                }
            });
        }
    } else {
        next();
    }
});

/**
 * @api {get} /feeds/:projectID?action=collaborators Get all collaborators for a project
 * @apiParam {int} :projectID Projects unique ID
 * @apiName GetCollaborators
 * @apiGroup Collaborators
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "collaborators"){
        // Querying the database, to get all collaborators for this project

        dbconn.query("SELECT u.display_name, up.user_id, up.access_level_int FROM User_Project up LEFT JOIN User u ON up.user_id = u.id WHERE up.project_id=" + dbconn.escape(req.params.projectID), function(err, rows, fields){
            if(err){

            } else {
                if(rows.length > 0){
                    accessLevels.appendAllAccessLevelNames(rows, req.params.projectID, function(fullAccessLevelDetails){
                        if(req.query.allSettings != null){
                            req.responseObject.collaborators = fullAccessLevelDetails;
                            req.query.action = "accessLevels";
                            next();
                        } else {
                            res.send(fullAccessLevelDetails);
                        }
                    });
                }
            }
        });
    } else {
        next();
    }
});

/**
 * @api {delete} /feeds/:projectID?action=collaborators Remove a collaborator from a project
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {int} collaboratorID ID of the collaborator to be removed
 * @apiName DeleteCollaborator
 * @apiGroup Collaborators
 */
router.delete("/:projectID", function(req, res, next){
    if(req.query.action == "collaborators"){
        var collaboratorID = req.body.collaboratorID || req.query.collaboratorID;
        if(collaboratorID != null){
            dbconn.query("SELECT * FROM User_Project up LEFT JOIN Project p ON up.project_id = p.id WHERE up.project_id = " + req.params.projectID + " AND up.user_id=" + req.userID, function(err, rows, fields){
               if(err){
                   console.log(err);
               } else {
                   if(rows.length > 0){
                        googleOAuth.removeUserFromMediaFolder(rows[0].media_folder_id, rows[0].media_folder_permission_id, collaboratorID, function(){
                            dbconn.query("DELETE FROM User_Project WHERE project_id=" + dbconn.escape(req.params.projectID) + " AND user_id=" + dbconn.escape(collaboratorID), function(err, rows, fields){
                                if(err){
                            
                                } else {
                                    console.log("Collaborator " + collaboratorID + " has been removed from project " + req.params.projectID);
                                    
                                    dbconn.query("SELECT email_address, display_name FROM User WHERE id=" + dbconn.escape(collaboratorID), function(err, rows, fields){
                                        if(err){
                                            console.log(err);
                                        } else {
                                            if(rows.length > 0){
                                                sendEmail.removedFromProject(rows[0].email_address, rows[0].display_name, req.params.projectID);
                                            } 
                                        }
                                    });   
                            
                                    if(req.headers.origin != null){
                                        res.send({});
                                    } else {
                                        res.redirect(303, "/feeds/" + req.params.projectID + "?action=collaborators");
                                    }
                                }
                            });
                        });

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

/**
 * @api {post} /feeds/:projectID?action=mediaItems Upload a media item
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {file} file Media item file to be uploaded
 * @apiName UploadMediaItem
 * @apiGroup MediaItems
 */
router.post("/:projectID", function(req, res, next){
    if(req.query.action == "uploadFile"){
        console.log("Uploading file");
        if(req.file != null){
            dbconn.query("SELECT media_folder_id FROM Project p LEFT JOIN User_Project up on p.id = up.project_id WHERE p.id = " + req.params.projectID + " AND up.user_id = " + req.userID, function(err, rows, fields){
                if(err){
                    console.log(err);
                } else {
                    if(rows.length > 0){
                        googleOAuth.uploadMediaItem(req.file, rows[0].media_folder_id, req.userID, function(fileUrl){
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

/**
 * @api {get} /feeds/:projectID?action=accessLevels Get project access levels
 * @apiParam {int} :projectID Projects unique ID
 * @apiName GetAccessLevels
 * @apiGroup AccessLevels
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "accessLevels"){
        accessLevels.getProjectAccessLevels(req.params.projectID, function(projectAccessLevels){
            accessLevels.appendAccessLevelsInUse(req.params.projectID, projectAccessLevels, function(updatedProjectAccessLevels){
                if(req.query.allSettings != null){
                    req.responseObject.access_levels = projectAccessLevels;
                    req.query.action = "project_name";
                    next();
                } else {
                    res.send(projectAccessLevels);
                }
            });
        });
    } else {
        next();
    }
});

/**
 * @api {post} /feeds/:projectID?action=accessLevels Create a new access level
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} access_level_name Name for the new access level
 * @apiName CreateAccessLevel
 * @apiGroup AccessLevels
 */
router.post("/:projectID", function(req, res, next){
    if(req.query.action == "accessLevels"){
        if(req.body.access_level_name != null){
            accessLevels.createNewAccessLevel(req.params.projectID, req.body.access_level_name, req.body.access_level_int, function(){
                if(req.headers.origin != null){
                    res.send({});
                } else {
                    res.redirect(303, "/feeds/" + req.params.projectID + "?action=accessLevels");
                }
            });
        } else {
            console.log("Not enough info supplied");
        }
    } else {
        next();
    }
});

/**
 * @api {delete} /feeds/:projectID?action=accessLevels Delete access level
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {int} access_level_int Number of the access level to be deleted
 * @apiName DeleteAccessLevel
 * @apiGroup AccessLevels
 */
router.delete("/:projectID", function(req, res, next){
    if(req.query.action == "accessLevels"){
        var accessLevelInt = req.body.access_level_int || req.query.access_level_int;
        if(accessLevelInt != null){
            accessLevels.removeAccessLevel(req.params.projectID, accessLevelInt, function(){
                if(req.headers.origin != null){
                    res.send({});
                } else {
                    res.redirect(303, "/feeds/" + req.params.projectID + "?action=accessLevels");
                }
            });
        } else {
            console.log("Not enough info supplied");
        }
    } else {
        next();
    }
});

/**
 * @api {put} /feeds/:projectID?action=accessLevels Update access level name
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {int} access_level_int Number of the access level to be updated
 * @apiParam {string} access_level_name New name for the access level
 * @apiName UpdateAccessLevelName
 * @apiGroup AccessLevels
 */
router.put("/:projectID", function(req, res, next){
    if(req.query.action == "accessLevels"){
        if(req.body.access_level_int != null && req.body.access_level_name != null){
            accessLevels.updateAccessLevelName(req.params.projectID, req.body.access_level_int, req.body.access_level_name, function(){
                if(req.headers.origin != null){
                    res.send({});
                } else {
                    res.redirect(303, "/feeds/" + req.params.projectID + "?action=accessLevels");
                }
            });
        } else {
            console.log("Not enough info supplied");
        }
    } else {
        next();
    }
});

/**
 * @api {get} /feeds/:projectID?action=mediaItems Get all media items for a project
 * @apiParam {int} :projectID Projects unique ID
 * @apiName GetMediaItems
 * @apiGroup MediaItems
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "mediaItems"){
        dbconn.query("SELECT * FROM User_Project up LEFT JOIN Project p ON up.project_id = p.id WHERE up.project_id=" + req.params.projectID + " AND up.user_id=" + req.userID, function(err, rows, fields){
            if(err){
                console.log(err);
            } else {
                if(rows.length > 0){
                    googleOAuth.getAllProjectImages(req.params.projectID, rows[0].media_folder_id, req.userID, req.query.numFiles, req.query.nextPageToken, function(results){
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

/**
 * @api {get} /feeds/:projectID?action=project_name Get projects name
 * @apiParam {int} :projectID Projects unique ID
 * @apiName GetProject_name
 * @apiGroup ProjectDetails
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "project_name"){
        dbconn.query("SELECT project_name FROM Project WHERE id=" + req.params.projectID, function(err, rows, fields){
            if(err){
                console.log(err);
            } else {
                var project_name = rows[0].project_name || null;
                if(req.query.allSettings != null){
                    req.responseObject.project_name = project_name;
                    req.query.action = "cache";
                    next();
                } else {
                    res.send(project_name);
                }
            }
        });
    } else {
        next();
    }
});

/**
 * @api {put} /feeds/:projectID?action=project_name Update projects name
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} project_name New name for the project
 * @apiName UpdateProject_name
 * @apiGroup ProjectDetails
 */
router.put("/:projectID", function(req, res, next){
    if(req.query.action == "project_name"){
        if(req.body.project_name != null){
            dbconn.query("UPDATE Project SET project_name = " + dbconn.escape(req.body.project_name) + " WHERE id=" + req.params.projectID, function(err, rows, fields){
                if(err){
                    console.log(err);
                } else {
                    if(req.query.allSettings != null){
                        req.responseObject.project_name = req.body.project_name;
                        req.query.action = "cache";
                        next();
                    } else {
                        res.send(req.body.project_name);
                    }                    
                }
            });
        } else {
            if(req.query.allSettings != null){
                req.query.action = "cache";
                next();
            } else {
                req.feedsErrors.push("No project name provided in the request");
                next(new Error());
            }            
        }        
    } else {
        next();
    }
});

/**
 * @api {get} /feeds/:projectID?action=cache Get maximum cache age
 * @apiParam {int} :projectID Projects unique ID
 * @apiName GetCacheAge
 * @apiGroup ProjectDetails
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "cache"){
        dbconn.query("SELECT max_cache_age FROM Project WHERE id=" + req.params.projectID, function(err, rows, fields){
            if(err){
                console.log(err);
            } else {
                if(rows.length > 0){
                    if(req.query.allSettings != null){
                        req.responseObject.max_cache_age = rows[0].max_cache_age;
                        req.query.action = "css";
                        next();
                    } else {
                        res.send(rows[0].max_cache_age);
                    }                    
                } else {
                    req.feedsErrors.push("Unable to access the maximum cache age for this project");
                    next(new Error());
                }  
            }
        });       
    } else {
        next();
    }
});

/**
 * @api {put} /feeds/:projectID?action=cache Update maximum cache age
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {int} max_cache_age Time in milliseconds
 * @apiName UpdateCacheAge
 * @apiGroup ProjectDetails
 */
router.put("/:projectID", function(req, res, next){
    if(req.query.action == "cache"){
        if(req.body.max_cache_age != null){
            dbconn.query("UPDATE Project SET max_cache_age=" + dbconn.escape(req.body.max_cache_age) + " WHERE id=" + req.params.projectID, function(err, result){
                if(err){
                    console.log(err);
                } else {
                    if(req.query.allSettings != null){
                        req.responseObject.max_cache_age = req.body.max_cache_age;
                        req.query.action = "css";
                        next();
                    } else {
                        res.send(req.body.max_cache_age);
                    }
                }
            });
        } else {
            if(req.query.allSettings != null){
                req.query.action = "css";
                next();
            } else {
                req.feedsErrors.push("No maximum cache age included in the request");
                next(new Error());
            }            
        }        
    } else {
        next();
    }
});

/**
 * @api {get} /feeds/:projectID?action=css Get custom css
 * @apiParam {int} :projectID Projects unique ID
 * @apiName ReadCustomCss
 * @apiGroup CustomCSS
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "css"){
        dbconn.query("SELECT * FROM Project WHERE id=" + req.params.projectID, function(err, rows, fields){
            if(err){
                console.log(err);
            } else {
                if(rows.length > 0){
                    if(req.query.allSettings != null){
                        req.responseObject.custom_css = rows[0].custom_css;
                        req.query.action = null;
                        next();
                    } else {
                        res.send(rows[0].custom_css);
                    }
                } else {
                    console.log("Cannot find project");
                }
            }
        });
    } else {
        next();
    }
});

/**
 * @api {post} /feeds/:projectID?action=css Create/append to custom css
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} custom_css Custom css rules to be added
 * @apiName CreateAppendCustomCss
 * @apiGroup CustomCSS
 */
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

/**
 * @api {put} /feeds/:projectID?action=css Update custom content css
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} custom_css Custom css rules to be added
 * @apiName UpdateCustomCss
 * @apiGroup CustomCSS
 */
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

// No API Documentation necessary (part of a route)
router.all("/:projectID", function(req, res, next){
    if(req.query.action == "css"){
        if(req.custom_css != null){
            dbconn.query("UPDATE Project SET custom_css=" + dbconn.escape(req.custom_css) + " WHERE id=" + req.params.projectID, function(err, result){
                if(err){
                    console.log(err);
                } else {
                    if(req.query.allSettings != null){
                        req.responseObject.custom_css = req.custom_css;
                        req.query.action = null;
                        next();
                    } else {
                        if(req.headers.origin != null){
                            res.send({});
                        } else {
                            res.redirect(303, "/feeds/" + req.params.projectID + "?action=css");
                        }
                    }
                }
            });
        } else {
            if(req.query.allSettings != null){
                req.query.action = null;
                next();
            } else {
                req.feedsErrors.push("No custom css included in the request");
                next(new Error());
            }
        }
    } else {
        next();
    }
});

router.all("/:projectID", function(req, res, next){
    if(req.query.allSettings != null){
        res.send(req.responseObject);
    } else {
        next();
    }
});


// Exporting the router that was set up in this file, so that it can be included
// in the app.js file and specified as the route for all requests to the "/feeds" route
module.exports = router;