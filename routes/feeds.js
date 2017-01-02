var express = require('express');
var router = express.Router();
var fs = require("fs");
var googleOAuth = require("../google/googleOAuth");
var dbconn = require("../database/connection.js");

// CREATE
router.post("/:userID", function(req, res, next){
    console.log("POST to create new project");
    if(req.body != null){
        console.log(req.body.projectName);
        dbconn.query("INSERT INTO Project(project_name) VALUES(" + dbconn.escape(req.body.projectName) + ")", function(err, result){
            if(err){
                console.log(err);
            } else {
                req.projectID = result.insertId;
                dbconn.query("INSERT INTO User_Project(user_id, project_id, user_access_level) VALUES(" + req.params.userID + ", " + req.projectID + ", 1)", function(err, result){
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
                                        projectTemplate.last_updated_by = req.params.userID;

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
                                                        res.redirect("/feeds/" + req.params.userID);
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
    } else {
        res.send("No body provided");
    }
});
router.post("/:userID/:project", function(req, res, next){
    res.send("POST request received from userID=" + req.params.userID + " for projectID=" + req.params.project);
});
router.post("/:userID/:project/:collection", function(req, res, next){
    res.send("POST request received from userID=" + req.params.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection);
});
router.post("/:userID/:project/:collection/:item", function(req, res, next){
    res.send("POST request received from userID=" + req.params.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection + " and item=" + req.params.item);
});

// READ
router.get("/:userID", function(req, res, next){
    console.log("GET request from " + req.params.userID + " to view all projects");
    dbconn.query("SELECT * FROM Project p LEFT JOIN User_Project as up ON p.id = up.project_id WHERE up.user_id =" + dbconn.escape(req.params.userID), function(err, rows, fields){
        if(err){
            console.log(err);
        } else {
            res.send(rows);
        }
    });
});
router.get("/:userID/:projectID", function(req, res, next){
    dbconn.query("SELECT p.id as 'project_id', up.user_id as 'user_id', up.user_access_level as 'user_access_level' FROM Project p LEFT JOIN User_Project up ON p.id = up.project_id WHERE p.id = " + dbconn.escape(req.params.projectID) + " AND up.user_id = " + dbconn.escape(req.params.userID), function(err, rows, fields){
        if(err){
            console.log(err);
        } else {
            var projectRow = rows[0];

            fs.readFile("./projects/" + projectRow.project_id + "/admin.json", {encoding: "utf-8"}, function(err, data){
                if(err){
                    console.log(err);
                } else {
                    var projectAdmin = JSON.parse(data);
                    var projectStructure = projectAdmin.project_structure;

                    switch(projectRow.user_access_level) {
                        case 1: {
                            res.send(JSON.stringify(projectStructure));
                            break;
                        }
                        default: {
                            fs.readFile("./projects/" + projectRow.project_id + "/content.json", {encoding: "utf-8"}, function(err, projectContent){
                                if(err){
                                    console.log(err);
                                } else {
                                    var responseObject = {
                                        projectStructure: projectStructure,
                                        projectContent: JSON.parse(projectContent)
                                    }
                                    res.send(responseObject);
                                }
                            });
                            break;
                        }
                    }
                    
                }
            });            
        }
    });
});
router.get("/:userID/:projectID/:collection", function(req, res, next){
    res.send("GET request received from userID=" + req.params.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection);
});
router.get("/:userID/:projectID/:collection/:item", function(req, res, next){
    res.send("GET request received from userID=" + req.params.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection + " and item=" + req.params.item);
});

// UPDATE
router.put("/:userID/:projectID", function(req, res, next){
    dbconn.query("SELECT p.id as 'project_id', up.user_id as 'user_id', up.user_access_level as 'user_access_level' FROM Project p LEFT JOIN User_Project up ON p.id = up.project_id WHERE p.id = " + dbconn.escape(req.params.projectID) + " AND up.user_id = " + dbconn.escape(req.params.userID), function(err, rows, fields){
        if(err){
            console.log(err);
        } else {
            var projectRow = rows[0];

            if(projectRow.user_access_level == 1){
                if(req.body.projectStructure == null || req.body.projectStructure.length == 0){
                    req.body.projectStructure = {};
                }

                var adminFilePath = "./projects/" + req.params.projectID + "/admin.json";
                fs.readFile(adminFilePath, {encoding: "utf-8"}, function(err, data){
                    if(err){
                        console.log(err);
                    } else {
                        var adminProjectFile = JSON.parse(data);
                        adminProjectFile.date_updated = Date.now();
                        adminProjectFile.last_updated_by = req.params.userID;
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
        }
    });
});
router.put("/:userID/:projectID/addCollaborator", function(req, res, next){
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
router.put("/:userID/:projectID/addCollaborator", function(req, res, next){
    dbconn.query("SELECT * FROM User_Project WHERE user_id=" + req.newCollaboratorID + " AND project_id=" + req.params.projectID, function(err, rows, fields){
        if(err){
            console.log("Error checking if user is already a contributor to project " + err);
        } else {
            if(rows.length > 0){
                console.log("This user is already a collaborator on this project");
                res.send();
            } else {
                var accessLevel = req.body.accessLevel == null || req.body.accessLevel < 1 ? 1 : req.body.accessLevel;
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
router.put("/:userID/:projectID/:collection", function(req, res, next){
    res.send("PUT request received from userID=" + req.params.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection);
});
router.put("/:userID/:projectID/:collection/:item", function(req, res, next){
    res.send("PUT request received from userID=" + req.params.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection + " and item=" + req.params.item);
});

// DELETE
router.delete("/:userID/:projectID", function(req, res, next){
    res.send("DELETE request received from userID=" + req.params.userID + " for projectID=" + req.params.project);
});
router.delete("/:userID/:projectID/:collection", function(req, res, next){
    res.send("DELETE request received from userID=" + req.params.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection);
});
router.delete("/:userID/:projectID/:collection/:item", function(req, res, next){
    res.send("DELETE request received from userID=" + req.params.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection + " and item=" + req.params.item);
});

module.exports = router;