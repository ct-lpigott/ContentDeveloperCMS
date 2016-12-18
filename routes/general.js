var express = require('express');
var router = express.Router();
var googleOAuthClient = require("../google/googleOAuthClient");

router.get("/", function(req, res, next){
    var oauthURL = googleOAuthClient.generateAuthUrl({
        access_type: "offline",
        scope: [
        "https://www.googleapis.com/auth/drive"
        ]
    });

    console.log("Request recieved in general route");
    res.render("index", {oauthURL: oauthURL});
});

module.exports = router;