// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Requiring the file system module, so that this route can have access
// to the file system of the server i.e. to be able to create, open, edit 
// and save project files to the /projects directory
var fs = require("fs");

// Including the dbQuery module, which contains prepared queries to the 
// database, which ensure that all data used within them is sanitised and
// escaped before being included in a statement
var dbQuery = require("../../../custom_modules/database_query");

// Including the gitRep module, which handles all request to initialise, 
// commit and log from a projects git repo
var gitRepo = require("../../../custom_modules/git_repo");

// Including the googleOAuth module, which is used for handling
// all requests to the Google API
var googleOAuth = require("../../../custom_modules/google_oauth");

// Including the accessLevels module, which is used for create, getting
// names of and defaults for project access levels
var accessLevels = require("../../../custom_modules/access_levels");

/**
 * @apiVersion 1.0.0
 * @api {get} /feeds/:projectID?allSettings Get all settings for a project
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiDescription
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?allSettings <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 * @apiSuccessExample {json} Success-Response:
 * {
 *      collaborators: [
 *          {
 *              display_name: {string},
 *              user_id: {int},
 *              access_level_int: {int},
 *              access_level_name: {string}
 *          }
 *      ],
 *      access_levels: [
 *          { 
 *              access_level_name: "Administrator",
 *              access_level_int: 1,
 *              in_use: true
 *          }
 *      ],
 *      project_name: "My Project",
 *      max_cache_age: 250000,
 *      custom_css: "h2:{color:red;}"
 * }
 * @apiName Get Project Settings
 * @apiGroup Project Details
 */
router.get("/:projectID", function(req, res, next){
    // If the query string contains an allSettings parameter, then this
    // request will pass through multiple routes below. This will be achieved
    // by updating the action parameter as it passes through each relevant route
    // to GET all the relevant settings
    if(req.query.allSettings != null){
        req.query.action = "collaborators";
    }
    next();
});

/**
 * @apiVersion 1.0.0
 * @api {put} /feeds/:projectID?allSettings Update all settings for a project
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiParam {string} [project_name]
 * @apiParam {int} [max_cache_age]
 * @apiParam {string} [custom_css]
 * @apiDescription
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/19456?allSettings <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 *      <strong>REQUEST BODY:</strong> { project_name: "My New Project Name", max_cache_age: 250000, custom_css: "h2:{color:red;}" }
 * @apiSuccessExample {json} Success-Response:
 * {
 *      project_name: true,
 *      max_cache_age: true,
 *      custom_css: true
 * }
 * @apiName Update Project Settings
 * @apiGroup Project Details
 */
router.put("/:projectID", function(req, res, next){
    // If the query string contains an allSettings parameter, then this
    // request will pass through multiple routes below. This will be achieved
    // by updating the action parameter as it passes through each relevant route
    // to UPDATE all the relevant settings
    if(req.query.allSettings != null){
        req.query.action = "projectName";
    }
    next();
});

router.all("/", function(req, res, next){
    // Checking that the query string contains an action, as this
    // route only deals with actions
    if(req.query.action != null){
        // Checking that the user has been authenticated
        if(req.userID != null){
            next();
        } else {
            req.feedsErrors.push("Only authenticated users can request actions");
            next(new Error("loginRequired"));
        }        
    } else {
        // Since no action was specified, passing this request 
        // onto the next route
        next("route");
    }
});

// No API documentation required - users wouldn't be able to access outside of CMS
router.get("/", function(req, res, next){
    if(req.query.action == "collaborators"){
        console.log("GET request from " + req.userID + " to view all projects");  

        // Checking that a userID has been provided within the request
        if(req.userID != null){
            // Getting the details for each of this users projects
            dbQuery.get_UserProjects_forUser("user_id, project_id, project_name, access_level_int", req.userID, function(err, rows){
                if(rows){
                    // Appending all access level names to each of the users
                    // project relationships (as currently only an int will be available)
                    accessLevels.appendAllAccessLevelNames(rows, null, function(userProjects_withAccessLevelDetails){
                        // Appending the most recent commit data for each project, i.e.
                        // last modified by and on
                        gitRepo.appendMostRecentCommitData(userProjects_withAccessLevelDetails, function(userProjects_withRecentCommits){
                            // Sending the list of projects this user is a collaborator on,
                            // with the access level names appended, as well as the most recent
                            // commit data
                            res.send(userProjects_withRecentCommits);
                        });
                    });
                } else {
                    // This user has no projects
                    req.feedsErrors.push("This user has no projects");
                    res.send([]);
                }
            });
        } else {
            next(new Error("loginRequired"));
        }
    } else {
        next();
    }    
});

/**
 * @apiVersion 1.0.0
 * @api {post} /feeds?action=createProject Create a new project
 * @apiParam {string} project_name Name for the new project
 * @apiDescription
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds?action=createProject <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 *      <strong>REQUEST BODY:</strong> { project_name: "My New Project" }
 * @apiSuccessExample {json} Success-Response:
 * {
 *      new_project_id: 652
 * }
 * @apiName Create Project
 * @apiGroup Project Details
 */
router.post("/", function(req, res, next){
    if(req.query.action == "createProject"){
        console.log("POST to create new project");

        // Checking that a project name has been included in the request body
        if(req.body.project_name != null){
            // Creating a new Google Drive folder for this proejct
            googleOAuth.createNewProjectFolder(req.body.project_name, req.userID, function(newGoogleFolderId, userPermissionId){
                // Creating a new project in the database, using the project name provided 
                // in the request body, the default access levels, and the new Google Drive
                // folder id
                dbQuery.create_Project(req.body.project_name, accessLevels.getDefaultAccessLevelsJson(), newGoogleFolderId, userPermissionId, req.userID, function(err, newProjectId){
                    if(err || newProjectId == null){
                        // Logging the error to the console
                        console.log("Error creating new project " + err);

                        // As it has not been possible to create the folder for this project, 
                        // adding this as an error to the feedsErrors array.
                        req.feedsErrors.push("Server error - unable to create project");

                        // Since this is a significant issue, passing this request to the feeds-errors
                        // route, by calling the next method with an empty error (as all errors will be
                        // accessible from the feedsErrors array).
                        next(new Error());
                    } else {
                        req.projectID = newProjectId;
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
        projectAdmin.date_created = Date.now();
        projectAdmin.created_by = req.userID;
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
                    
                        gitRepo.createNewRepo(req.projectID, req.userID, req.body.project_name, function(err, success){
                            console.log("Git repo creation success = " + success);
                            res.send({new_project_id: req.projectID});                            
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
 * @apiVersion 1.0.0
 * @api {get} /feeds/:projectID?action=previewCommit&historyOf=structure&commitHash=*** Preview contents of a file at a specific commit
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string="structure", "content"} historyOf To get the contents for the history of the content or structure
 * @apiParam {string} commitHash The hash of the commit to be accessed
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiDescription
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=previewCommit&historyOf=structure&commitHash=ca82a6dff817ec66f44342007202690a93763949 <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 * @apiSuccessExample {json} Success-Response:
 * {
 *      commit_structure: {object}
 * }
 * @apiName Preview Commit Content
 * @apiGroup Project History
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "previewCommit"){
        // Checking that a commit has and history of value have been included in the request
        if(req.query.commitHash != null && req.query.historyOf != null){
            // Getting the content of the relevant file at the requested point in time
            gitRepo.getCommitContent(req.params.projectID, req.query.historyOf, req.query.commitHash, function(err, commitDataObject){
                if(err){
                    req.feedsErrors.push("Unable to get the content of this commit");
                    res.send({commit_content: null, commit_structure: null});
                } else {
                    // Adding the commit hash to the response object
                    req.responseObject.hash = req.query.commitHash;

                    // Checking which history the user requested, to determine which 
                    // property to use on the response object
                    if(req.query.historyOf == "content"){
                        req.responseObject.commit_content = commitDataObject;
                    } else if(req.query.historyOf == "structure"){
                        req.responseObject.commit_structure = commitDataObject.project_structure;
                    }
                    // Sending the response to the user
                    res.send(req.responseObject);
                }
            });
        } else {
            req.feedsErrors.push("Missing commit hash or history of details");
            next(new Error());
        }
    } else {
        next();
    }
});

/**
 * @apiVersion 1.0.0
 * @api {post} /feeds/:projectID?action=collaborators Add a collaborator to a project
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiParam {string} email Email address of the collaborator to be added
 * @apiParam {int} access_level_int Requested access level
 * @apiDescription
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=collaborators <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 *      <strong>REQUEST BODY:</strong> { email: "pigottlaura@gmail.com", access_level_int: 2 }
 * @apiSuccessExample {json} Success-Response:
 * {
 *      success: true
 * }
 * @apiName Add Collaborator
 * @apiGroup Collaborators
 */
router.post("/:projectID", function(req, res, next){
    if(req.query.action == "collaborators"){
        // Checking if an access level property was provided in the request, and that the
        // value of that property is greater than 0
        if(req.body.access_level_int != null && req.body.email != null && req.body.email.length > 0){
            // Checking that the user exists, and if not, then creating them
            dbQuery.check_User(req.body.email, function(err, collaboratorId){
                if(collaboratorId){
                    // Checking if the user already has a relationship with this project, and if not,
                    // then creating it
                    dbQuery.check_UserProject(req.userID, collaboratorId, req.params.projectID, req.body.access_level_int, function(err, changed){
                        if(err || changed == null){
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
                            // Ideally, would prefer to redirect all request to get the updated list of 
                            // collaborators, but due to restrictions with cross origin requests, redirects
                            // are not currently supported, so just sending them an boolean response
                            if(req.headers.origin != process.env.SITE_URL){
                                res.send({success: true});
                            } else {
                                res.redirect(303, "/feeds/" + req.params.projectID + "?action=collaborators");
                            }
                        }
                    });
                }
            });
        } else {
            // Logging the error to the console
            console.log("Not enough details provided in the request");

            // No access level was provided in the request, unable to add collaborator. Adding this as 
            // an error to the feedsErrors array.
            req.feedsErrors.push("Unable to add collaborator to project - not enouth details provided in the request");

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
 * @apiVersion 1.0.0
 * @api {put} /feeds/:projectID?action=collaborators Update a collaborators access level to a project
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiParam {string} collaborator_id User id of the collaborator to be updated
 * @apiParam {int} access_level_int  Requested access level
 * @apiDescription
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=collaborators <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 *      <strong>REQUEST BODY:</strong> { collaborator_id: 305, access_level_int: 3 }
 * @apiSuccessExample {json} Success-Response:
 * {
 *      success: true
 * }
 * @apiName Update Collaborator
 * @apiGroup Collaborators
 */
router.put("/:projectID", function(req, res, next){
    if(req.query.action == "collaborators"){
        // Checking that a collaborator id and access level have been included in the request
        if(req.body.collaborator_id != null && req.body.access_level_int != null){
            // Checking if this user already has a relationship with this project, and if not,
            // then creating it
            dbQuery.check_UserProject(req.userID, req.body.collaborator_id, req.params.projectID, req.body.access_level_int, function(err, success){
                // Ideally, would prefer to redirect all request to get the updated list of 
                // collaborators, but due to restrictions with cross origin requests, redirects
                // are not currently supported, so just sending them a boolean response
                if(req.headers.origin != process.env.SITE_URL){
                    res.send({success: success});
                } else {
                    res.redirect(303, "/feeds/" + req.params.projectID + "?action=collaborators");
                } 
            });
        }
    } else {
        next();
    }
});

/**
 * @apiVersion 1.0.0
 * @api {get} /feeds/:projectID?action=collaborators Get all collaborators for a project
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiDescription 
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=collaborators <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 * @apiSuccessExample {json} Success-Response:
 * collaborators: [
 *      {
 *          display_name: {string},
 *          user_id: {int},
 *          access_level_int: {int},
 *          access_level_name: {string}
 *      }
 * ]
 * @apiName Get Collaborators
 * @apiGroup Collaborators
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "collaborators"){
        // Getting the details of all collaborators for this project
        dbQuery.get_UserProjects_forProject("u.display_name, up.user_id, up.access_level_int", req.params.projectID, function(err, rows){
            if(err){console.log(err);}
            if(rows){
                // Appending the names of all access levels to the rows returned, as currently
                // they only contain the access level int
                accessLevels.appendAllAccessLevelNames(rows, req.params.projectID, function(fullAccessLevelDetails){
                    if(req.query.allSettings != null){
                        // If this is a request for all settings, adding the 
                        // full details for this projects users to the response object, 
                        //  and then passing the request onto the next relevant route
                        req.responseObject.collaborators = fullAccessLevelDetails;
                        req.query.action = "accessLevels";
                        next();
                    } else {
                        // Sending the response to the user
                        res.send({collaborators: fullAccessLevelDetails});
                    }
                });
            } else {
                req.feedsErrors.push("This project has no collaborators");
                res.send({collaborators: []});
            }
        });
    } else {
        next();
    }
});

/**
 * @apiVersion 1.0.0
 * @api {delete} /feeds/:projectID?action=collaborators Remove a collaborator from a project
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiParam {int} collaborator_id ID of the collaborator to be removed
 * @apiDescription 
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=collaborators <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 *      <strong>REQUEST BODY:</strong> { collaborator_id: 305 }
 * @apiSuccessExample {json} Success-Response:
 * {
 *      success: true
 * }
 * @apiName Delete Collaborator
 * @apiGroup Collaborators
 */
router.delete("/:projectID", function(req, res, next){
    if(req.query.action == "collaborators"){
        // Allowing the collaborator id to be included in the body or query string
        // for this request only, as the Angular http API doesnt allow request
        // bodies to be added to delete requests (but still want to maintain the normal
        // structure for the rest of the API)
        var collaboratorID = req.body.collaborator_id || req.query.collaborator_id;
        if(collaboratorID != null){
            // Users are not allowed to delete themselves
            if(collaboratorID != req.userID){
                // Deleting the users relationship with this project
                dbQuery.delete_UserProject(req.userID, collaboratorID, req.params.projectID, function(err, success){
                    // Ideally, would prefer to redirect all request to get the updated list of 
                    // collaborators, but due to restrictions with cross origin requests, redirects
                    // are not currently supported, so just sending them a boolean response
                    if(req.headers.origin != process.env.SITE_URL){
                        res.send({success: success});
                    } else {
                        res.redirect(303, "/feeds/" + req.params.projectID + "?action=collaborators");
                    }
                });
            } else {
                req.feedsErrors.push("You cannot delete yourself from a project");
                res.send({success: false});
            }            
        } else {
            req.feedsErrors.push("No collaborator id included in the request");
            res.send({success: false});
        }
        
    } else {
        next();
    }
});

/**
 * @apiVersion 1.0.0
 * @api {post} /feeds/:projectID?action=mediaItems Upload a media item
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiParam {file} file Media item file to be uploaded
 * @apiDescription 
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=mediaItems <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 *      <strong>REQUEST BODY:</strong> { file: {file} }
 * @apiSuccessExample {json} Success-Response:
 * {
 *      media_item_url: https://drive.google.com/uc?id=0Bzkz0DzYRLAuUHRzVmFXZFF3dDQ
 * }
 * @apiName Upload Media Item
 * @apiGroup Media Items
 */
router.post("/:projectID", function(req, res, next){
    if(req.query.action == "mediaItems"){
        console.log("Uploading file");
        // Checking that a file has been included in the request
        if(req.file != null){
            // Getting the media folder if for this proejct
            dbQuery.get_UserProject_Project("p.media_folder_id", req.userID, req.params.projectID, function(err, row){
                if(err || row == null){
                    console.log(err);
                } else {
                    // Uploading the media item to the projects Google Drive folder,
                    // which will in turn delete the media item from the servers
                    // file system upon successful upload
                    googleOAuth.uploadMediaItem(req.file, row.media_folder_id, req.userID, req.params.projectID, function(fileUrl){
                        console.log("FILE UPLOAD");
                        // Sending the file URL for the new media item to the caller, by 
                        // prepending the id with the appropriate google drive url
                        var fileUrl = "https://drive.google.com/uc?id=" + fileUrl;
                        res.send({media_item_url: fileUrl});
                    });
                }                
            });
        } else {
            req.feedsErrors.push("No file included in the request");
            next(new Error());
        }
    } else {
        next();
    }
});

/**
 * @apiVersion 1.0.0
 * @api {get} /feeds/:projectID?action=accessLevels Get project access levels
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiDescription 
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=accessLevels <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 * @apiSuccessExample {json} Success-Response:
 * {
 *      access_levels: [
 *          { 
 *              access_level_name: "Administrator",
 *              access_level_int: 1,
 *              in_use: true
 *          }
 *      ]
 * }
 * @apiName Get Access Levels
 * @apiGroup Access Levels
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "accessLevels"){
        // Getting the access levels for this project
        accessLevels.getProjectAccessLevels(req.params.projectID, function(projectAccessLevels){
            // Appending the names of the access levels to those returned
            accessLevels.appendAccessLevelsInUse(req.params.projectID, projectAccessLevels, function(updatedProjectAccessLevels){
                if(req.query.allSettings != null){
                    // If this is a request for all settings, adding the 
                    // full details for this projects users to the response object, 
                    //  and then passing the request onto the next relevant route
                    req.responseObject.access_levels = projectAccessLevels;
                    req.query.action = "projectName";
                    next();
                } else {
                    res.send({access_levels: projectAccessLevels});
                }
            });
        });
    } else {
        next();
    }
});

/**
 * @apiVersion 1.0.0
 * @api {post} /feeds/:projectID?action=accessLevels Create a new access level
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiParam {string} access_level_name Name for the new access level
 * @apiParam {int} [access_level_int] Int value for the new access level (needs to be unique to the project)
 * @apiDescription 
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=accessLevels  <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 *      <strong>REQUEST BODY:</strong> { access_level_name: "Photographer", access_level_int: 5 }
 * @apiSuccessExample {json} Success-Response:
 * {
 *      success: true
 * }
 * @apiName Create Access Level
 * @apiGroup Access Levels
 */
router.post("/:projectID", function(req, res, next){
    if(req.query.action == "accessLevels"){
        // Making sure a name has been included for this new access level
        if(req.body.access_level_name != null){
            // Creating a new access level for the project. Allowing the
            // access_level_int from the request to be included, even if it
            // is null, as a default access level will be supplied if it is
            accessLevels.createNewAccessLevel(req.userID, req.params.projectID, req.body.access_level_name, req.body.access_level_int, function(success){
                // Ideally, would prefer to redirect all request to get the updated list of 
                // access levels, but due to restrictions with cross origin requests, redirects
                // are not currently supported, so just sending them a boolean response
                if(req.headers.origin != process.env.SITE_URL){
                    res.send({success: success});
                } else {
                    res.redirect(303, "/feeds/" + req.params.projectID + "?action=accessLevels");
                }
            });
        } else {
            req.feedsErrors.push("No access level name included in the request");
            next(new Error());
        }
    } else {
        next();
    }
});

/**
 * @apiVersion 1.0.0
 * @api {delete} /feeds/:projectID?action=accessLevels Delete access level
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiParam {int} access_level_int Number of the access level to be deleted
 * @apiDescription 
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=accessLevels <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 *      <strong>REQUEST BODY:</strong> { access_level_int: 5 }
 * @apiSuccessExample {json} Success-Response:
 * {
 *      success: true
 * }
 * @apiName Delete Access Level
 * @apiGroup Access Levels
 */
router.delete("/:projectID", function(req, res, next){
    if(req.query.action == "accessLevels"){
        // Allowing the access level int to be included in the body or query string
        // for this request only, as the Angular http API doesnt allow request
        // bodies to be added to delete requests (but still want to maintain the normal
        // structure for the rest of the API)
        var accessLevelInt = req.body.access_level_int || req.query.access_level_int;
        if(accessLevelInt != null){
            // Deleting this access level from the project
            accessLevels.removeAccessLevel(req.userID, req.params.projectID, accessLevelInt, function(success){
                // Ideally, would prefer to redirect all request to get the updated list of 
                // access levels, but due to restrictions with cross origin requests, redirects
                // are not currently supported, so just sending them a boolean response
                if(req.headers.origin != process.env.SITE_URL){
                    res.send({success: success});
                } else {
                    res.redirect(303, "/feeds/" + req.params.projectID + "?action=accessLevels");
                }
            });
        } else {
            req.feedsErrors.push("No access level int included in the request");
            next(new Error());
        }
    } else {
        next();
    }
});

/**
 * @apiVersion 1.0.0
 * @api {put} /feeds/:projectID?action=accessLevels Update access level name
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiParam {int} access_level_int Number of the access level to be updated
 * @apiParam {string} access_level_name New name for the access level
 * @apiDescription 
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=accessLevels <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 *      <strong>REQUEST BODY:</strong> { access_level_int: 5, access_level_name: "Shop Assistant" }
 * @apiSuccessExample {json} Success-Response:
 * {
 *      success: true
 * }
 * @apiName Update Access Level Name
 * @apiGroup Access Levels
 */
router.put("/:projectID", function(req, res, next){
    if(req.query.action == "accessLevels"){
        // Checking that an access level int and name have been included in the request
        if(req.body.access_level_int != null && req.body.access_level_name != null){
            // Updating this access level name for the project
            accessLevels.updateAccessLevelName(req.userID, req.params.projectID, req.body.access_level_int, req.body.access_level_name, function(success){
                // Ideally, would prefer to redirect all request to get the updated list of 
                // access levels, but due to restrictions with cross origin requests, redirects
                // are not currently supported, so just sending them a boolean response
                if(req.headers.origin != process.env.SITE_URL){
                    res.send({success: success});
                } else {
                    res.redirect(303, "/feeds/" + req.params.projectID + "?action=accessLevels");
                }
            });
        } else {
            req.feedsErrors.push("No access level name or int included in the request");
            next(new Error());
        }
    } else {
        next();
    }
});

/**
 * @apiVersion 1.0.0
 * @api {get} /feeds/:projectID?action=mediaItems&nextPageToken=*** Get all media items for a project
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} [nextPageToken] Next page token (if one was returned in a previous request)
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiDescription 
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=mediaItems <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 * @apiSuccessExample {json} Success-Response:
 * {
 *      media_items: [
 *          {
 *              id: "0Bzkz0DzYRLAuUHRzVmFXZFF3dDQ",
 *              name: "thumb.jpg",
 *              mimeType: "image/jpeg",
 *              url: "https://drive.google.com/uc?id=0Bzkz0DzYRLAuUHRzVmFXZFF3dDQ"
 *          }
 *      ],
 *      next_page_token: "V1*3|0|CdfsiWEkjfslkWERulsdknlkcslERjlskdnKdfjiwEKJCklsidjr"
 *      
 * }
 * @apiName Get Media Items
 * @apiGroup Media Items
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "mediaItems"){
        // Getting the media folder id for this proejct
        dbQuery.get_UserProject_Project("media_folder_id", req.userID, req.params.projectID, function(err, row){
            if(row && row.media_folder_id != null){
                // Getting all images belonging to this media item folder
                googleOAuth.getAllProjectImages(req.params.projectID, row.media_folder_id, req.userID, req.query.numFiles, req.query.nextPageToken, function(results){
                    res.send({media_items: results.files, next_page_token: results.nextPageToken});
                });
            } else {
                req.feedsErrors.push("No media item folder found for this project, or you do not have permission to access it");
                next(new Error());
            }
        });
    } else {
        next();
    }
});

/**
 * @apiVersion 1.0.0
 * @api {get} /feeds/:projectID?action=projectName Get projects name
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiDescription 
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=projectName <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 * @apiSuccessExample {json} Success-Response:
 * {
 *      project_name: "My New Project"  
 * }
 * @apiName Get Project Name
 * @apiGroup Project Details
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "projectName"){
        // Getting the name for this project
        dbQuery.get_Project("project_name", req.params.projectID, function(err, row){
            var project_name = row.project_name || null;
            if(req.query.allSettings != null){
                // If this is a request for all settings, adding the 
                // project name for this project to the response object,
                // and then passing the request onto the next relevant route
                req.responseObject.project_name = project_name;
                req.query.action = "cache";
                next();
            } else {
                res.send({project_name: project_name});
            }
        });
    } else {
        next();
    }
});

/**
 * @apiVersion 1.0.0
 * @api {put} /feeds/:projectID?action=projectName Update projects name
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiParam {string} project_name New name for the project
 * @apiDescription 
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=projectName <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 *      <strong>REQUEST BODY:</strong> { project_name: "My Updated Project Name" }
 * @apiSuccessExample {json} Success-Response:
 * {
 *      success: true
 * }
 * @apiName Update Project Name
 * @apiGroup Project Details
 */
router.put("/:projectID", function(req, res, next){
    if(req.query.action == "projectName"){
        // Checking that a new name has been included in the request
        if(req.body.project_name != null){
            // Updating this projects name in the database (not updating the name
            // of the Google Drive folder, as the user may have already given
            // this a custom name, so wouldn't want to overwrite that)
            dbQuery.update_Project(["project_name"],[req.body.project_name], req.userID, req.params.projectID, function(err, success){
                if(req.query.allSettings != null){
                    // If this is a request to update all settings, adding the 
                    // project name for this project to the response object,
                    // and then passing the request onto the next relevant route
                    req.responseObject.project_name = success;
                    req.query.action = "cache";
                    next();
                } else {
                    if(success){
                        res.send({success: success});
                    } else {
                        res.send({success: success});
                    }
                    
                }    
            });
        } else {
            if(req.query.allSettings != null){
                // If this is a request to update all settings, passing the request
                // onto the next relevant route
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
 * @apiVersion 1.0.0
 * @api {get} /feeds/:projectID?action=cache Get maximum cache age
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiDescription 
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=cache <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 * @apiSuccessExample {json} Success-Response:
 * {
 *      max_cache_age: 25000
 * }
 * @apiName Get Maximum Cache Age
 * @apiGroup Project Details
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "cache"){
        // Getting the max cache age for this project
        dbQuery.get_Project("max_cache_age", req.params.projectID, function(err, row){
            if(req.query.allSettings != null){
                // If this is a request for all settings, adding the 
                // maximum cache age for this project to the response object, 
                // and then passing the request onto the next relevant route
                req.responseObject.max_cache_age = row.max_cache_age || null;
                req.query.action = "css";
                next();
            } else {
                res.send({max_cache_age: row.max_cache_age || null});
            }
        });    
    } else {
        next();
    }
});

/**
 * @apiVersion 1.0.0
 * @api {put} /feeds/:projectID?action=cache Update maximum cache age
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiParam {int} max_cache_age Time in milliseconds
 * @apiDescription 
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=cache <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 *      <strong>REQUEST BODY:</strong> { max_cache_age: 25000 }
 * @apiSuccessExample {json} Success-Response:
 * {
 *      success: true  
 * }
 * @apiName Update Maximum CacheAge
 * @apiGroup Project Details
 */
router.put("/:projectID", function(req, res, next){
    if(req.query.action == "cache"){
        // Checking that a new max cache age has been included in the request
        if(req.body.max_cache_age != null && isNaN(req.body.max_cache_age) == false){
            // Updating this projects maximum cache age
            dbQuery.update_Project(["max_cache_age"], [req.body.max_cache_age], req.userID, req.params.projectID, function(err, success){
                if(req.query.allSettings != null){
                    // If this is a request to update all settings, adding the 
                    // maximum cache age for this project to the response object, 
                    // and then passing the request onto the next relevant route
                    req.responseObject.max_cache_age = success;
                    req.query.action = "css";
                    next();
                } else {
                    res.send({success: success});
                }
            });
        } else {
            if(req.query.allSettings != null){
                // If this is a request to update all settings, passing the request
                // onto the next relevant route
                req.query.action = "css";
                next();
            } else {
                req.feedsErrors.push("No valid maximum cache age included in the request");
                next(new Error());
            }            
        }        
    } else {
        next();
    }
});

/**
 * @apiVersion 1.0.0
 * @api {get} /feeds/:projectID?action=css Get custom css
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiDescription 
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=css <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 * @apiSuccessExample {json} Success-Response:
 * {
 *      custom_css: "h2{color:red;}"  
 * }
 * @apiName Get Custom Css
 * @apiGroup Custom CSS
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "css"){
        // Getting the custom css for this project
        dbQuery.get_Project("custom_css", req.params.projectID, function(err, row){
            if(req.query.allSettings != null){
                // If this is a request for all settings, adding the 
                // custom css for this project to the response object, 
                // and then passing the request onto the next relevant route
                req.responseObject.custom_css = row.custom_css || null;
                next();
            } else {
                res.send({custom_css: row.custom_css || null});
            }
        });
    } else {
        next();
    }
});

/**
 * @apiVersion 1.0.0
 * @api {post} /feeds/:projectID?action=css Create or append to custom css
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiParam {string} custom_css Custom css rules to be added
 * @apiDescription 
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=css <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 *      <strong>REQUEST BODY:</strong> { custom_css: "h2:{color:red;}" }
 * @apiSuccessExample {json} Success-Response:
 * {
 *      success: true
 * }
 * @apiName Create CustomCss
 * @apiGroup Custom CSS
 */
router.post("/:projectID", function(req, res, next){
    if(req.query.action == "css"){
        // Checking that custom css has been included in the request
        if(req.body.custom_css != null){
            dbQuery.get_Project("custom_css", req.params.projectID, function(err, row){
                // If css already exists for this project, then appending the new 
                // css to it. 
                if(row){
                    req.custom_css = row.custom_css + " " + req.body.custom_css;
                    next();
                } else {
                    req.custom_css = req.body.custom_css;
                    next();
                }
            });
        } else {
            if(req.query.allSettings != null){
                // If this is a request to update all settings, passing the request
                // onto the next relevant route
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

/**
 * @apiVersion 1.0.0
 * @api {put} /feeds/:projectID?action=css Update custom content css
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} public_auth_token Public authentication token for the project (unique to all collaborators)
 * @apiParam {string} custom_css Custom css rules to be added
 * @apiDescription 
 *      <strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=css <br>
 *      <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br>
 *      <strong>REQUEST BODY:</strong> { custom_css: "h2:{color:red;}"}
 * @apiSuccessExample {json} Success-Response:
 * {
 *      success: true 
 * }
 * @apiName Update Custom Css
 * @apiGroup Custom CSS
 */
router.put("/:projectID", function(req, res, next){
    if(req.query.action == "css"){
        // Checking that css has been included in the request
        if(req.body.custom_css != null){
            req.custom_css = req.body.custom_css;
            next();
        } else {
            if(req.query.allSettings != null){
                // If this is a request to update all settings, passing the request
                // onto the next relevant route
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

// No API Documentation necessary (part of a route)
router.all("/:projectID", function(req, res, next){
    if(req.query.action == "css"){
        // Checking that custom css has been added to the request object 
        // (either through a POST or PUT request above)
        if(req.custom_css != null){
            // Updating this projects css
            dbQuery.update_Project(["custom_css"], [req.custom_css], req.userID, req.params.projectID, function(err, success){
                if(req.query.allSettings != null){
                    // If this is a request for all settings, adding the 
                    // maximum cache age for this project to the response object, 
                    // and then passing the request onto the next end of the route
                    req.responseObject.custom_css = success;
                    next();
                } else {
                    // Ideally, would prefer to redirect all request to get the updated
                    // css, but due to restrictions with cross origin requests, redirects
                    // are not currently supported, so just sending them a boolean response
                    if(req.headers.origin != process.env.SITE_URL){
                        res.send({success: success});
                    } else {
                        res.redirect(303, "/feeds/" + req.params.projectID + "?action=css");
                    }
                }
            });
        } else {
            if(req.query.allSettings != null){
                // If this is a request to update all settings, passing the request
                // onto the end of the route
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
        // Sending the response object to the user, with all of the relevant
        // settings updated
        res.send(req.responseObject);
    } else {
        // Since the appropriate router was not found in this route, 
        // passing this request onto the next route
        next();
    }
});


// Exporting the router that was set up in this file, so that it can be included
// in the app.js file and specified as the route for all requests to the "/feeds" route
module.exports = router;