var express = require('express');
var router = express.Router();
var googleOAuth = require("../google/googleOAuth");

router.get("/", function(req, res, next){
    var oauthURL = googleOAuth.generateOAuthUrl();

    console.log("Request recieved in general route");
    res.render("index", {loginURL: oauthURL});
});

module.exports = router;