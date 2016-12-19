var express = require('express');
var router = express.Router();
var googleOAuth = require("../google/googleOAuth");

// CREATE
router.post("/:collection", function(req, res, next){
    res.send("POST request received for collection=" + req.params.collection);
});
router.post("/:collection/:item", function(req, res, next){
    res.send("POST request received for collection=" + req.params.collection + " and item=" + req.params.item);
});

// READ
router.get("/:collection", function(req, res, next){
    res.send("GET request received for collection=" + req.params.collection);
});
router.get("/:collection/:item", function(req, res, next){
    res.send("GET request received for collection=" + req.params.collection + " and item=" + req.params.item);
});

// UPDATE
router.put("/:collection", function(req, res, next){
    res.send("PUT request received for collection=" + req.params.collection);
});
router.put("/:collection/:item", function(req, res, next){
    res.send("PUT request received for collection=" + req.params.collection + " and item=" + req.params.item);
});

// DELETE
router.delete("/:collection", function(req, res, next){
    res.send("DELETE request received for collection=" + req.params.collection);
});
router.delete("/:collection/:item", function(req, res, next){
    res.send("DELETE request received for collection=" + req.params.collection + " and item=" + req.params.item);
});

module.exports = router;