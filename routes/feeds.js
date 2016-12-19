var express = require('express');
var router = express.Router();
var googleOAuth = require("../google/googleOAuth");
var dbconn = require("../database/connection.js");

// CREATE
router.post("/", function(req, res, next){
    responseObject = {
        errors: [],
        successful: false
    }

    console.log("POST to create new project");
    if(req.body != null){

        if(req.body.userID == null){
            responseObject.errors.push("User ID must be provided");
        }
        if(req.body.projectName == null || req.body.projectName.length == 0){
            responseObject.errors.push("Project Name must be provided");
        }

        dbconn.query("INSERT INTO Project(project_name) VALUES(" + dbconn.escape(req.body.projectName) + ")", function(err, result){
            if(err){
                console.log(err);
            } else {
                req.projectID = result.insertId;
                dbconn.query("INSERT INTO User_Project(user_id, project_id) VALUES(" + req.body.userID + ", " + req.projectID + ")", function(err, result){
                    if(err){
                        console.log(err);
                    } else {
                        console.log(result);
                        res.send("New Project ID = " + req.projectID);
                    }
                });
            }
        });
    } else {
        res.send("No body provided");
    }
});
router.post("/:project/:collection", function(req, res, next){
    res.send("POST request received for project=" + req.params.project + " collection=" + req.params.collection);
});
router.post("/:project/:collection/:item", function(req, res, next){
    res.send("POST request received for project=" + req.params.project + " collection=" + req.params.collection + " and item=" + req.params.item);
});

// READ
router.get("/:project", function(req, res, next){
    res.send("GET request received for project=" + req.params.project);
});
router.get("/:project/:collection", function(req, res, next){
    res.send("GET request received for project=" + req.params.project + " collection=" + req.params.collection);
});
router.get("/:project/:collection/:item", function(req, res, next){
    res.send("GET request received for project=" + req.params.project + " collection=" + req.params.collection + " and item=" + req.params.item);
});

// UPDATE
router.put("/:project", function(req, res, next){
    res.send("PUT request received for project=" + req.params.project);
});
router.put("/:project/:collection", function(req, res, next){
    res.send("PUT request received for project=" + req.params.project + " collection=" + req.params.collection);
});
router.put("/:project/:collection/:item", function(req, res, next){
    res.send("PUT request received for project=" + req.params.project + " collection=" + req.params.collection + " and item=" + req.params.item);
});

// DELETE
router.delete("/:project", function(req, res, next){
    res.send("DELETE request received for project=" + req.params.project);
});
router.delete("/:project/:collection", function(req, res, next){
    res.send("DELETE request received for project=" + req.params.project + " collection=" + req.params.collection);
});
router.delete("/:project/:collection/:item", function(req, res, next){
    res.send("DELETE request received for project=" + req.params.project + " collection=" + req.params.collection + " and item=" + req.params.item);
});

module.exports = router;