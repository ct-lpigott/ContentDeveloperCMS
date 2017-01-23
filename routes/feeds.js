var router = require('express').Router();
var fs = require("fs");
var googleOAuth = require("../google/googleOAuth");
var dbconn = require("../database/connection.js");

// ALL REQUESTS
router.use(function(req, res, next){
    // Creating an empty array on the request object, to temporarily store
    // any errors that may occur throughout this route, so that they can
    // be appended to the responseObject in the feeds-errors route (should
    // any errors occur). Not mounting the errors array on the responseObject
    // by default, so as not to continually return an empty errors array.
    req.feedsErrors = [];

    // Creating a responseObject property on the request, so that it
    // can be built upon as the request passes through the router. Initialising
    // this to be an empty object. 
    req.responseObject = {};

    // Checking if a userID was included in the query string
    if(req.query.userID != null){
        // Setting a userID property on the request object, and passing it the
        // value of the userID from the query string. Using this approach so that
        // if the method of passing the userID should need to change, this will
        // be the only instance that will need to be updated (as req.userID is used
        // throughout this route).
        req.userID = req.query.userID;
    }

    // Checking the type of HTTP method used for this request, as all non-GET request 
    // methods are expected to have both a userID and a body included with them
    if(req.method == "GET") {
        // Since this is a GET request, it can continue throughout this route without
        // any additional checks
        next();
    } else {
        // Checking that the userID is present
        if(req.userID != null){
            // Checking that the request has a request body
            if(req.body != null){
                // This request has both a userID and a request body, and so it can
                // continue through this route
                next();
            } else {
                // This request has no request body, and so cannot continue through this
                // route. Adding this as an error to the feedsErrors array.
                req.feedsErrors.push("No body provided in the request");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                next(new Error());
            }
        } else {
            // This request has not userID, and so cannot continue through this
            // route. Adding this as an error to the feedsErrors array.
            req.feedsErrors.push("No userID provided in the request");

            // Since this is a significant issue, passing this request to the feeds-errors
            // route, by calling the next method with an empty error (as all errors will be
            // accessible from the feedsErrors array).
            next(new Error());
        }
    }
});

// CREATE
router.post("/", function(req, res, next){
    console.log("POST to create new project");
    dbconn.query("INSERT INTO Project(project_name) VALUES(" + dbconn.escape(req.body.projectName) + ")", function(err, result){
        if(err){
            console.log(err);
        } else {
            req.projectID = result.insertId;
            dbconn.query("INSERT INTO User_Project(user_id, project_id, user_access_level) VALUES(" + req.userID + ", " + req.projectID + ", 1)", function(err, result){
                if(err){
                    console.log(err);
                } else {
                    fs.mkdir("./projects/" + req.projectID, function(err){
                        if(err){
                            console.log("Error making folder " + err);
                        } else {
                            fs.readFile("./projects/project_template.json", function(err, data){
                                if(err){
                                    console.log("Error reading project template file " + err);
                                } else {
                                    var projectTemplate = JSON.parse(data);
                                    projectTemplate.project_id = req.projectID;
                                    projectTemplate.project_name = req.body.projectName;
                                    projectTemplate.date_created = projectTemplate.date_updated = Date.now();
                                    projectTemplate.last_updated_by = req.userID;

                                    fs.writeFile("./projects/" + req.projectID + "/admin.json", JSON.stringify(projectTemplate), function(err){
                                        if(err) {
                                            console.log("Error making file " + err);
                                        } else {
                                            console.log("Project admin file created");
                                            fs.writeFile("./projects/" + req.projectID + "/content.json", "{}", function(err){
                                                if(err) {
                                                    console.log("Error making file " + err);
                                                } else {
                                                    console.log("Project content file created");
                                                    res.redirect("/feeds/" + req.userID);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});
router.post("/:projectID", function(req, res, next){
    res.send("POST request received from userID=" + req.userID + " for projectID=" + req.params.project);
});
router.post("/:projectID/:collection", function(req, res, next){
    res.send("POST request received from userID=" + req.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection);
});
router.post("/:projectID/:collection/:item", function(req, res, next){
    res.send("POST request received from userID=" + req.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection + " and item=" + req.params.item);
});

// READ
router.get("/", function(req, res, next){
    console.log("GET request from " + req.userID + " to view all projects");
    if(req.userID != null){
        dbconn.query("SELECT up.project_id, p.project_name, up.user_access_level FROM Project p LEFT JOIN User_Project as up ON p.id = up.project_id WHERE up.user_id =" + dbconn.escape(req.userID), function(err, rows, fields){
            if(err){
                console.log(err);
            } else {
                if(rows.length > 0){
                    res.send(rows);
                } else {
                    res.send("Unknown user");
                }
            }
        });
    } else {
        res.send("No userID provided");
    }
    
});
router.get("/:projectID", function(req, res, next){
    dbconn.query("SELECT up.project_id, up.user_id, up.user_access_level FROM Project p LEFT JOIN User_Project up ON p.id = up.project_id WHERE p.id = " + dbconn.escape(req.params.projectID) + " AND up.user_id = " + dbconn.escape(req.userID), function(err, rows, fields){
        if(err){
            console.log(err);
        } else {
            if(rows.length > 0){
                fs.readFile("./projects/" + req.params.projectID + "/admin.json", {encoding: "utf-8"}, function(err, data){
                    if(err){
                        console.log(err);
                    } else {
                        var projectAdmin = JSON.parse(data);
                        req.responseObject.structure = projectAdmin.project_structure;
                        next();                    
                    }
                });
            } else {
                next();
            }          
        }
    });
});
router.get("/:projectID", function(req, res, next){
    fs.readFile("./projects/" + req.params.projectID + "/content.json", {encoding: "utf-8"}, function(err, projectContent){
        if(err){
            console.log(err);
        } else {
            if(req.responseObject.structure != null){
                req.responseObject.content = JSON.parse(projectContent);
            } else {
                req.responseObject = JSON.parse(projectContent);
            }
           
            res.send(req.responseObject);
        }
    });
});
router.get("/:projectID/:collection", function(req, res, next){
    req.collectionName = req.params.collection.toLowerCase();
    console.log("Request for the " + req.collectionName + " collection");
    dbconn.query("SELECT up.project_id, up.user_access_level FROM Project p LEFT JOIN User_Project up ON p.id = up.project_id WHERE p.id = " + dbconn.escape(req.params.projectID) + " AND up.user_id = " + dbconn.escape(req.userID), function(err, rows, fields){
        if(err){
            console.log(err);
        } else {
            if(rows.length > 0){
                fs.readFile("./projects/" + req.params.projectID + "/admin.json", {encoding: "utf-8"}, function(err, data){
                    if(err){
                        console.log(err);
                    } else {
                        var projectAdmin = JSON.parse(data);
                        req.responseObject.structure = projectAdmin.project_structure[req.collectionName];
                        next();                    
                    }
                });
            } else {
                next();
            }    
        }
    });
});
router.get("/:projectID/:collection", function(req, res, next){
    fs.readFile("./projects/" + req.params.projectID + "/content.json", {encoding: "utf-8"}, function(err, projectContent){
        if(err){
            console.log(err);
        } else {
            projectContent = JSON.parse(projectContent);
            var collectionContent = projectContent[req.collectionName] != null ? projectContent[req.collectionName] : {};

            if(req.responseObject.structure != null){
                req.responseObject.content = collectionContent;
            } else {
                req.responseObject = collectionContent;
            }
            
            res.send(req.responseObject);
        }
    });
});
router.get("/:projectID/:collection/:item", function(req, res, next){
    res.send("GET request received from userID=" + req.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection + " and item=" + req.params.item);
});

// UPDATE
router.put("/:projectID", function(req, res, next){
    dbconn.query("SELECT up.project_id, up.user_id, up.user_access_level FROM Project p LEFT JOIN User_Project up ON p.id = up.project_id WHERE p.id = " + dbconn.escape(req.params.projectID) + " AND up.user_id = " + dbconn.escape(req.userID), function(err, rows, fields){
        if(err){
            console.log(err);
        } else {
            var projectRow = rows[0];

            switch(projectRow.user_access_level){
                case 1: {
                    if(req.body.projectStructure != null || req.body.projectStructure.length > 0){
                        req.body.projectStructure = req.body.projectStructure.toLowerCase();                   

                        var adminFilePath = "./projects/" + req.params.projectID + "/admin.json";
                        fs.readFile(adminFilePath, {encoding: "utf-8"}, function(err, data){
                            if(err){
                                console.log(err);
                            } else {
                                var adminProjectFile = JSON.parse(data);
                                adminProjectFile.date_updated = Date.now();
                                adminProjectFile.last_updated_by = req.userID;
                                adminProjectFile.project_structure = JSON.parse(req.body.projectStructure);

                                fs.writeFile(adminFilePath, JSON.stringify(adminProjectFile), function(err){
                                    if(err) {
                                        console.log("Error updating file " + err);
                                    } else {
                                        console.log("Project admin file updated");
                                        res.send(JSON.stringify(adminProjectFile.project_structure));
                                    }
                                });
                            }
                        });
                    }
                    break;
                }
                default: {
                    if(req.body.projectContent != null){
                       fs.writeFile("./projects/" + req.params.projectID + "/content.json", req.body.projectContent, function(err){
                            if(err) {
                                console.log("Error updating file " + err);
                            } else {
                                console.log("Project content file updated");
                                res.send("{}");
                            }
                        }); 
                    }
                    break;
                }
            }
        }
    });
});
router.put("/:projectID/addCollaborator", function(req, res, next){
    if(req.body.email != null && req.body.email.length > 0){
        dbconn.query("SELECT id FROM User WHERE email_address=" + dbconn.escape(req.body.email), function(err, rows, fields){
            if(err){
                console.log("Error checking if user exists " + err);
            } else {
                if(rows.length > 0){
                    console.log("This is an existing user");
                    req.newCollaboratorID = rows[0].id;
                    next();
                } else {
                    console.log("This is a new user");
                    dbconn.query("INSERT INTO User(email_address) VALUES(" + dbconn.escape(req.body.email) +")", function(err, result){
                        if(err){
                            console.log("Error adding new user " + err);
                        } else {
                            req.newCollaboratorID = result.insertId;
                            next();
                        }
                    });
                }
            }
        });
    }
});
router.put("/:projectID/addCollaborator", function(req, res, next){
    var accessLevel = req.body.accessLevel == null || req.body.accessLevel < 1 ? 1 : req.body.accessLevel;

    dbconn.query("SELECT * FROM User_Project WHERE user_id=" + req.newCollaboratorID + " AND project_id=" + req.params.projectID, function(err, rows, fields){
        if(err){
            console.log("Error checking if user is already a contributor to project " + err);
        } else {
            if(rows.length > 0){
                if(accessLevel == rows[0].user_access_level){
                    console.log("This user is already a collaborator on this project");
                    res.send();
                } else {
                    dbconn.query("UPDATE User_Project SET user_access_level=" + dbconn.escape(accessLevel) + "WHERE user_id=" + req.newCollaboratorID, function(err, result) {
                        if(err){
                            console.log("Error updating user on project " + err);
                        } else {
                            console.log("Collaborators access level updated on project");
                            res.send();
                        }
                    });
                }
            } else {
                
                dbconn.query("INSERT INTO User_Project(user_id, project_id, user_access_level) VALUES(" + req.newCollaboratorID + ", " + req.params.projectID + ", " + dbconn.escape(accessLevel) + ")", function(err, result) {
                    if(err){
                        console.log("Error adding user to project " + err);
                    } else {
                        console.log("New collaborator added to project");
                        res.send();
                    }
                });
            }
        }
    });
});
router.put("/:projectID/:collection", function(req, res, next){
    res.send("PUT request received from userID=" + req.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection);
});
router.put("/:projectID/:collection/:item", function(req, res, next){
    res.send("PUT request received from userID=" + req.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection + " and item=" + req.params.item);
});

// DELETE
router.delete("/:projectID", function(req, res, next){
    res.send("DELETE request received from userID=" + req.userID + " for projectID=" + req.params.project);
});
router.delete("/:projectID/:collection", function(req, res, next){
    res.send("DELETE request received from userID=" + req.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection);
});
router.delete("/:projectID/:collection/:item", function(req, res, next){
    dbconn.query("SELECT p.id as 'project_id', up.user_id as 'user_id', up.user_access_level as 'user_access_level' FROM Project p LEFT JOIN User_Project up ON p.id = up.project_id WHERE p.id = " + dbconn.escape(req.params.projectID) + " AND up.user_id = " + dbconn.escape(req.userID), function(err, rows, fields){
        if(err){
            console.log(err);
        } else {
            var projectRow = rows[0];

            switch(projectRow.user_access_level) {
                case 1: {
                }
                default: {
                    var contentFilePath = "./projects/" + projectRow.project_id + "/content.json";
                    fs.readFile(contentFilePath, {encoding: "utf-8"}, function(err, projectContent){
                        if(err){
                            console.log(err);
                        } else {
                            var updatedProjectContent = JSON.parse(projectContent);
                            
                            switch(updatedProjectContent[req.params.collection].constructor){
                                case Array: {
                                    console.log("array");
                                    updatedProjectContent[req.params.collection].splice([req.params.item], 1);
                                }
                            }
                            if(JSON.stringify(updatedProjectContent) != projectContent){
                                fs.writeFile(contentFilePath, JSON.stringify(updatedProjectContent), function(err){
                                    if(err) {
                                        console.log("Error updating file " + err);
                                    } else {
                                        console.log("Project content file updated");
                                        res.send("{}");
                                    }
                                });
                            }
                        }
                    });
                    break;
                }
            }          
        }
    });
});

module.exports = router;