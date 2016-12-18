var express = require('express');
var router = express.Router();
var dbconn = require("../database/connection.js");
var googleOAuth = require("../google/googleOAuthClient");

router.get("/oauthRedirectURL", function(req, res, next){
    var authCode = req.query.code;

    googleOAuth.oauth2Client.getToken(authCode, function(error, token) {
        if (error) {
            console.log("Error while trying to retrieve access token", error);
        } else {
            var jsonToken = JSON.stringify(token);
            dbconn.query("INSERT into User(google_auth_token) VALUES(" + dbconn.escape(jsonToken) + ")", function(err, rows, fields){
                if(err) {
                    console.log(err);
                } else {
                    console.log(rows);
                }
            });
        }
    });

    res.send("Logged In");
});

module.exports = router;