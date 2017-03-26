// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Requiring the file system module, so that this route can have access
// to the file system of the server i.e. to be able to create, open, edit 
// and save project files to the /projects directory
var fs = require("fs");
var dbQuery = require("../../../custom_modules/database_query");
var gitRepo = require("../../../custom_modules/git_repo");
var googleOAuth = require("../../../custom_modules/google_oauth");
var accessLevels = require("../../../custom_modules/access_levels");

/**
 * @apiVersion 1.0.0
 * @api {get} /feeds/:projectID?allSettings Get all settings for a project
 * @apiParam {int} :projectID Projects unique ID
 * @apiName Get Project Settings
 * @apiGroup Project Details
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.allSettings != null){
        req.query.action = "collaborators";
    }
    next();
});

/**
 * @apiVersion 1.0.0
 * @api {put} /feeds/:projectID?allSettings Update all settings for a project
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} [project_name]
 * @apiParam {int} [max_cache_age]
 * @apiParam {string} [custom_css]
 * @apiName Update Project Settings
 * @apiGroup Project Details
 */
router.put("/:projectID", function(req, res, next){
    if(req.query.allSettings != null){
        req.query.action = "projectName";
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
 * @apiVersion 1.0.0
 * @api {get} /feeds?action=collaborators Get projects that current user is a collaborator on
 * @apiName Get User Projects
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
            dbQuery.get_UserProjects_forUser("user_id, project_id, project_name, access_level_int", req.userID, function(err, rows){
                if(rows){
                    accessLevels.appendAllAccessLevelNames(rows, null, function(userProjects_withAccessLevelDetails){
                        
                        gitRepo.appendMostRecentCommitData(userProjects_withAccessLevelDetails, function(userProjects_withRecentCommits){
                            res.send(userProjects_withRecentCommits);
                        });
                    });
                } else {
                    // This user has no projects
                    res.send("[]");
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
 * @apiVersion 1.0.0
 * @api {post} /feeds?action=createProject Create a new project
 * @apiParam {string} project_name Name for the new proejct
 * @apiName Create Project
 * @apiGroup Project Details
 */
router.post("/", function(req, res, next){
    if(req.query.action == "createProject"){
        console.log("POST to create new project");

        // Checking that a project name has been included in the request body
        if(req.body.project_name != null){

            googleOAuth.createNewProjectFolder(req.body.project_name, req.userID, function(newGoogleFolderId){
                console.log(newGoogleFolderId);
                // Creating a new project in the database, using the project name provided 
                // in the request body
                dbQuery.create_Project(req.body.project_name, accessLevels.getDefaultAccessLevelsJson(), newGoogleFolderId, req.userID, function(err, newProjectId){
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
 * @api {post} /feeds/:projectID?action=previewCommit&historyOf=structure&commitHash=*** Preview contents of a file at a specific commit
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string="structure", "content"} historyOf To get the contents for the history of the content or structure
 * @apiParam {string} commitHash The hash of the commit to be accessed
 * @apiName Preview Commit Content
 * @apiGroup Project History
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "previewCommit"){
        if(req.query.commitHash != null && req.query.historyOf != null){
            gitRepo.getCommitContent(req.params.projectID, req.query.historyOf, req.query.commitHash, function(err, commitDataObject){
                if(err){
                    res.send({});
                } else {
                    req.responseObject.hash = req.query.commitHash;
                    if(req.query.historyOf == "content"){
                        req.responseObject.commit_content = commitDataObject;
                    } else if(req.query.historyOf == "structure"){
                        req.responseObject.commit_structure = commitDataObject.project_structure;
                    }
                    res.send(req.responseObject);
                }
            });
        } else {
            res.send({});
        }
    } else {
        next();
    }
});

/**
 * @apiVersion 1.0.0
 * @api {post} /feeds/:projectID?action=collaborators Add a collaborator to a project
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} email Email address of the collaborator to be added
 * @apiParam {int} accessLevelInt Requested access level
 * @apiName Add Collaborator
 * @apiGroup Collaborators
 */
router.post("/:projectID", function(req, res, next){
    if(req.query.action == "collaborators"){
        // Checking if an access level property was provided in the request, and that the
        // value of that property is greater than 0
        if(req.body.accessLevelInt != null && req.body.email != null && req.body.email.length > 0){
            dbQuery.check_User(req.body.email, function(err, collaboratorId){
                if(collaboratorId){
                    dbQuery.check_UserProject(req.userID, collaboratorId, req.params.projectID, req.body.accessLevelInt, function(err, changed){
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
 * @apiParam {string} collaboratorID User id of the collaborator to be updated
 * @apiParam {int} accessLevelInt  Requested access level
 * @apiName Update Collaborator
 * @apiGroup Collaborators
 */
router.put("/:projectID", function(req, res, next){
    if(req.query.action == "collaborators"){
        if(req.body.collaboratorID != null && req.body.accessLevelInt != null){
            dbQuery.check_UserProject(req.userID, req.body.collaboratorID, req.params.projectID, req.body.accessLevelInt, function(err, success){
                if(req.headers.origin != null){
                    res.send({});
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
 * @apiName Get Collaborators
 * @apiGroup Collaborators
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "collaborators"){
        // Querying the database, to get all collaborators for this project
        dbQuery.get_UserProjects_forProject("u.display_name, up.user_id, up.access_level_int", req.params.projectID, function(err, rows){
            if(err){console.log(err);}
            if(rows){
                accessLevels.appendAllAccessLevelNames(rows, req.params.projectID, function(fullAccessLevelDetails){
                    if(req.query.allSettings != null){
                        req.responseObject.collaborators = fullAccessLevelDetails;
                        req.query.action = "accessLevels";
                        next();
                    } else {
                        res.send(fullAccessLevelDetails);
                    }
                });
            } else {
                res.send("[]");
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
 * @apiParam {int} collaboratorID ID of the collaborator to be removed
 * @apiName Delete Collaborator
 * @apiGroup Collaborators
 */
router.delete("/:projectID", function(req, res, next){
    if(req.query.action == "collaborators"){
        var collaboratorID = req.body.collaboratorID || req.query.collaboratorID;
        if(collaboratorID != null){
            if(collaboratorID != req.userID){
                dbQuery.get_UserProject_Project("p.media_folder_id, up.media_folder_permission_id", collaboratorID, req.params.projectID, function(err, row){
                    if(row){
                        dbQuery.delete_UserProject(req.userID, collaboratorID, req.params.projectID, function(err, success){
                            if(req.headers.origin != null){
                                res.send({});
                            } else {
                                res.redirect(303, "/feeds/" + req.params.projectID + "?action=collaborators");
                            }
                        });
                    } else {
                        res.send();
                    }
                });
            } else {
                res.send();
            }            
        } else {
            // Error - no collaborator specified
        }
        
    } else {
        next();
    }
});

/**
 * @apiVersion 1.0.0
 * @api {post} /feeds/:projectID?action=mediaItems Upload a media item
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {file} file Media item file to be uploaded
 * @apiName Upload Media Item
 * @apiGroup Media Items
 */
router.post("/:projectID", function(req, res, next){
    if(req.query.action == "mediaItems"){
        console.log("Uploading file");
        if(req.file != null){
            dbQuery.get_UserProject_Project("p.media_folder_id", req.userID, req.params.projectID, function(err, row){
                if(err || row == null){
                    console.log(err);
                } else {
                    googleOAuth.uploadMediaItem(req.file, row.media_folder_id, req.userID, req.params.projectID, function(fileUrl){
                        console.log("FILE UPLOAD");
                        req.responseObject.fileUrl = "https://drive.google.com/uc?id=" + fileUrl;
                        res.send(req.responseObject);
                    });
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
 * @apiVersion 1.0.0
 * @api {get} /feeds/:projectID?action=accessLevels Get project access levels
 * @apiParam {int} :projectID Projects unique ID
 * @apiName Get Access Levels
 * @apiGroup Access Levels
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "accessLevels"){
        accessLevels.getProjectAccessLevels(req.params.projectID, function(projectAccessLevels){
            accessLevels.appendAccessLevelsInUse(req.params.projectID, projectAccessLevels, function(updatedProjectAccessLevels){
                if(req.query.allSettings != null){
                    req.responseObject.access_levels = projectAccessLevels;
                    req.query.action = "projectName";
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
 * @apiVersion 1.0.0
 * @api {post} /feeds/:projectID?action=accessLevels Create a new access level
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} access_level_name Name for the new access level
 * @apiName Create Access Level
 * @apiGroup Access Levels
 */
router.post("/:projectID", function(req, res, next){
    if(req.query.action == "accessLevels"){
        if(req.body.access_level_name != null){
            accessLevels.createNewAccessLevel(req.userID, req.params.projectID, req.body.access_level_name, req.body.access_level_int, function(){
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
 * @apiVersion 1.0.0
 * @api {delete} /feeds/:projectID?action=accessLevels Delete access level
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {int} access_level_int Number of the access level to be deleted
 * @apiName Delete Access Level
 * @apiGroup Access Levels
 */
router.delete("/:projectID", function(req, res, next){
    if(req.query.action == "accessLevels"){
        var accessLevelInt = req.body.access_level_int || req.query.access_level_int;
        if(accessLevelInt != null){
            accessLevels.removeAccessLevel(req.userID, req.params.projectID, accessLevelInt, function(){
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
 * @apiVersion 1.0.0
 * @api {put} /feeds/:projectID?action=accessLevels Update access level name
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {int} access_level_int Number of the access level to be updated
 * @apiParam {string} access_level_name New name for the access level
 * @apiName Update Access Level Name
 * @apiGroup Access Levels
 */
router.put("/:projectID", function(req, res, next){
    if(req.query.action == "accessLevels"){
        if(req.body.access_level_int != null && req.body.access_level_name != null){
            accessLevels.updateAccessLevelName(req.userID, req.params.projectID, req.body.access_level_int, req.body.access_level_name, function(){
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
 * @apiVersion 1.0.0
 * @api {get} /feeds/:projectID?action=mediaItems Get all media items for a project
 * @apiParam {int} :projectID Projects unique ID
 * @apiName Get Media Items
 * @apiGroup Media Items
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "mediaItems"){
        dbQuery.get_UserProject_Project("media_folder_id", req.userID, req.params.projectID, function(err, row){
            if(row && row.media_folder_id != null){
                googleOAuth.getAllProjectImages(req.params.projectID, row.media_folder_id, req.userID, req.query.numFiles, req.query.nextPageToken, function(results){
                    res.send(results);
                });
            } else {
                res.send(null);
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
 * @apiName Get Project Name
 * @apiGroup Project Details
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "projectName"){
        dbQuery.get_Project("project_name", req.params.projectID, function(err, row){
            var project_name = row.project_name || null;
            if(req.query.allSettings != null){
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
 * @apiParam {string} project_name New name for the project
 * @apiName Update Project Name
 * @apiGroup Project Details
 */
router.put("/:projectID", function(req, res, next){
    if(req.query.action == "projectName"){
        if(req.body.project_name != null){
            dbQuery.update_Project(["project_name"],[req.body.project_name], req.userID, req.params.projectID, function(err, success){
                if(req.query.allSettings != null){
                    req.responseObject.project_name = req.body.project_name;
                    req.query.action = "cache";
                    next();
                } else {
                    if(success){
                        res.send(req.body.project_name);
                    } else {
                        res.send("{}");
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
 * @apiVersion 1.0.0
 * @api {get} /feeds/:projectID?action=cache Get maximum cache age
 * @apiParam {int} :projectID Projects unique ID
 * @apiName Get Maximum Cache Age
 * @apiGroup Project Details
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "cache"){
        dbQuery.get_Project("max_cache_age", req.params.projectID, function(err, row){
            if(req.query.allSettings != null){
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
 * @apiParam {int} max_cache_age Time in milliseconds
 * @apiName Update Maximum CacheAge
 * @apiGroup Project Details
 */
router.put("/:projectID", function(req, res, next){
    if(req.query.action == "cache"){
        if(req.body.max_cache_age != null){
            dbQuery.update_Project(["max_cache_age"], [req.body.max_cache_age], req.userID, req.params.projectID, function(err, success){
                if(req.query.allSettings != null){
                    req.responseObject.max_cache_age = req.body.max_cache_age || null;
                    req.query.action = "css";
                    next();
                } else {
                    res.send(req.body.max_cache_age || null);
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
 * @apiVersion 1.0.0
 * @api {get} /feeds/:projectID?action=css Get custom css
 * @apiParam {int} :projectID Projects unique ID
 * @apiName Get Custom Css
 * @apiGroup Custom CSS
 */
router.get("/:projectID", function(req, res, next){
    if(req.query.action == "css"){
        dbQuery.get_Project("custom_css", req.params.projectID, function(err, row){
            if(req.query.allSettings != null){
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
 * @apiParam {string} custom_css Custom css rules to be added
 * @apiName Create CustomCss
 * @apiGroup Custom CSS
 */
router.post("/:projectID", function(req, res, next){
    if(req.query.action == "css"){
        if(req.body.custom_css != null){
            dbQuery.get_Project("custom_css", req.params.projectID, function(err, row){
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
 * @apiParam {string} custom_css Custom css rules to be added
 * @apiName Update Custom Css
 * @apiGroup Custom CSS
 */
router.put("/:projectID", function(req, res, next){
    if(req.query.action == "css"){
        if(req.body.custom_css != null){
            req.custom_css = req.body.custom_css;
            next();
        } else {
            if(req.query.allSettings != null){
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
        if(req.custom_css != null){
            dbQuery.update_Project(["custom_css"], [req.custom_css], req.userID, req.params.projectID, function(err, success){
                if(req.query.allSettings != null){
                    req.responseObject.custom_css = req.custom_css;
                    next();
                } else {
                    if(req.headers.origin != null){
                        res.send({});
                    } else {
                        res.redirect(303, "/feeds/" + req.params.projectID + "?action=css");
                    }
                }
            });
        } else {
            if(req.query.allSettings != null){
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