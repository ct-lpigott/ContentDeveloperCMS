var express = require('express');
var router = express.Router();
var google = require("googleapis");

var dbconn = require("../database/connection.js");
var googleOAuth = require("../google/googleOAuth");

router.get("/oauthRedirectURL", function(req, res, next){
    var authCode = req.query.code;

    googleOAuth.oauth2Client.getToken(authCode, function(error, token) {
        if (error) {
            console.log("Error while trying to retrieve access token", error);
        } else {
            var plus = google.plus('v1');
            
            var oauth2Client = googleOAuth.oauth2Client;
            oauth2Client.credentials = token;

            plus.people.get({
                userId: 'me',
                auth: oauth2Client
            }, function (err, user) {
                console.log(user.emails[0].value);
                dbconn.query("SELECT * FROM User WHERE email_address=" + dbconn.escape(user.emails[0].value), function(err, rows, fields){
                    if(err) {
                        console.log(err);
                    } else {
                        var jsonToken = JSON.stringify(token);
                        
                        if(rows.length > 0){
                            req.userID = rows[0].id;
                            console.log("This is an existing user");
                            dbconn.query("UPDATE User SET google_profile_id = " + user.id + ", google_auth_token = " + dbconn.escape(jsonToken) + " WHERE id = " + dbconn.escape(rows[0].id), function(err, result){
                                if(err) {
                                    console.log(err);
                                } else {
                                    console.log("Existing user auth token updated");
                                    next();
                                }
                            });
                        } else {
                            console.log("This is a new user");

                            dbconn.query("INSERT into User(email_address, google_profile_id, google_auth_token) VALUES(" + dbconn.escape(user.emails[0].value) + ", " + dbconn.escape(user.id) + ", " + dbconn.escape(jsonToken) + ")", function(err, result){
                                if(err) {
                                    console.log(err);
                                } else {
                                    console.log("New user created in DB");
                                    req.userID = result.insertId;
                                    next();
                                }
                            });
                        }
                    }
                });
            });
            
        }
    });
});

router.get("/oauthRedirectURL", function(req, res, next){
    if(req.userID != null){
        res.redirect("/admin/" + req.userID);
    }
});

module.exports = router;