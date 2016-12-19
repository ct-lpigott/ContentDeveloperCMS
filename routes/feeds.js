var express = require('express');
var router = express.Router();
var googleOAuth = require("../google/googleOAuth");

// CREATE
router.post("/:project", function(req, res, next){
    res.send("POST request received for project=" + req.params.project);
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