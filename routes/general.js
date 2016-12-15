var express = require('express');
var router = express.Router();

router.get("/", function(req, res, next){
    console.log("Request recieved in general route");
    res.render("index", {});
});

module.exports = router;