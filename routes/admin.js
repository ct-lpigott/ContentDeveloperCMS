var express = require('express');
var router = express.Router();
var dbconn = require("../database/connection.js");
var google = require("googleapis");
var googleOAuth = require("../google/googleOAuth");

router.get("/:id", function(req, res, next){
    console.log("Request recieved in admin route. ID=" + req.params.id);
    dbconn.query("SELECT * FROM User WHERE id=" + dbconn.escape(req.params.id), function (err, rows, fields){
        if(err){
            console.log(err);
        } else {
            if(rows.length > 0){
                var plus = google.plus('v1');
                var usersGoogleAuthToken = JSON.parse(rows[0].google_auth_token);

                var oauth2Client = googleOAuth.oauth2Client;
                oauth2Client.credentials = usersGoogleAuthToken;

                plus.people.get({
                    userId: 'me',
                    auth: oauth2Client
                }, function (err, user) {
                    if(err) {
                        console.log("Error loading user profile " + err);
                    } else {
                        console.log(user);
                        res.render("admin", {
                            pageTitle: "Admin Panel",
                            userDisplayName: user.displayName,
                            userProfileImage: user.image.url.replace("?sz=50", ""),
                            userID: req.params.id 
                        });
                    }
                });
            }
        }
    });
});

module.exports = router;