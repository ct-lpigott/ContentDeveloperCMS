var express = require('express');
var router = express.Router();
var dbconn = require("../database/connection.js");
var googleOAuthClient = require("../google/googleOAuthClient");

router.get("/oauthRedirectURL", function(req, res, next){
    var authCode = req.query.code;

    googleOAuthClient.getToken(authCode, function(error, token) {
        if (error) {
            console.log("Error while trying to retrieve access token", error);
        } else {
            dbconn.query("INSERT into Users(google_token) VALUES(" + token + ")", function(err, rows, fields){
                if(err) {
                    console.log(err);
                } else {
                    console.log(rows);
                }
            });
            oauth2Client.credentials = token;
        }
    });
    res.send("Google ID: " + req.query.code);
});

module.exports = router;