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
            var filename = "content.json";

            if(projectRow.user_access_level == 1){
                filename = "admin.json";
            }

            fs.readFile("./projects/" + projectRow.project_id + "/" + filename, {encoding: "utf-8"}, function(err, data){
                if(err){
                    console.log(err);
                } else {
                    res.send(data);
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
    res.send("PUT request received from userID=" + req.params.userID + " for projectID=" + req.params.project);
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