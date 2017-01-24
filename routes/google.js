// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Requiring the googleapis module, so that it can be used within
// within this module to make requests to specific Google APIs
// i.e. to make request to the Plus API, to get the users email address
var google = require("googleapis");

// Requiring the custom database connection module, so that the one
// connection to the database can be reused throughout the application.
var dbconn = require("../database/connection.js");

// Requiring the custom google OAuth module, which exports an object with 
// a method to generate a new oauth url, and a method which returns
// a new OAuth2Client.
var googleOAuth = require("../google/googleOAuth");

// Request from the Google API, returning the user from a successful login to
// their Google account
router.get("/oauthRedirectURL", function(req, res, next){
    // Temporarily storing the auth code, included in the request, as this will be used
    // request the access token from the Google API i.e. it proves that the user has 
    // authorised us to do so
    var authCode = req.query.code;

    // Creating a new OAuth2Client, using the generateOAuth2Client() method of the custom
    // googleOAuth module
    var oauth2Client = googleOAuth.generateOAuth2Client();
    
    // Requesting an access token from the Google API, using the access token returned
    // from the users login to their Google account
    oauth2Client.getToken(authCode, function(err, token) {
        if(err) {
            console.log("Error while trying to retrieve access token", error);
        } else {
            // Accessing the Google Plus API, through the google apis module
            var plus = google.plus('v1');
            
            // Setting the credentials of the OAuth2Client to be equal to
            // the token returned from the request
            oauth2Client.credentials = token;

            // Making a request to the Google Plus API, to get the profile information
            // relating to this user. Passing the oauth2Client created above as the
            // authentication for this request.
            plus.people.get({
                userId: 'me',
                auth: oauth2Client
            }, function (err, user) {
                // Querying the database, to find the user with the email address that matches this user
                dbconn.query("SELECT * FROM User WHERE email_address=" + dbconn.escape(user.emails[0].value), function(err, rows, fields){
                    if(err) {
                        console.log("Unable to find user that has this Google profiles email address. " + err);
                    } else {
                        // Temporarily storing the users access token in a JSON string
                        var jsonToken = JSON.stringify(token);
                        
                        // Checking if any results were returned from the database i.e. has the user connected
                        // with this Google account been fount
                        if(rows.length > 0){
                            console.log("This is an existing user");

                            // Storing the userID of this user on the request object, so that it can
                            // be used throughout this route
                            req.userID = rows[0].id;
                            
                            // Updating this users google profile ID and auth token, based on those returned from 
                            // the Google API request
                            dbconn.query("UPDATE User SET google_profile_id = " + user.id + ", google_auth_token = " + dbconn.escape(jsonToken) + " WHERE id = " + dbconn.escape(rows[0].id), function(err, result){
                                if(err) {
                                    console.log("Unable to update users Google profile ID and auth token. " + err);
                                } else {
                                    console.log("Existing user auth token updated");

                                    // Passing this request on to the next stage of this route
                                    next();
                                }
                            });
                        } else {
                            console.log("This is a new user");

                            // Creating a new user in the database, using the email address, Google profile ID
                            // and auth access token provided by the request to the Google API
                            dbconn.query("INSERT into User(email_address, google_profile_id, google_auth_token) VALUES(" + dbconn.escape(user.emails[0].value) + ", " + dbconn.escape(user.id) + ", " + dbconn.escape(jsonToken) + ")", function(err, result){
                                if(err) {
                                    console.log(err);
                                } else {
                                    console.log("New user created in DB");

                                    // Storing the userID of this user on the request object, so that it can
                                    // be used throughout this route
                                    req.userID = result.insertId;
                                    
                                    // Passing this request on to the next stage of this route
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
// Continued - Request from the Google API, returning the user from a successful login to
// their Google account
router.get("/oauthRedirectURL", function(req, res, next){
    // Checking that a userID exists on the request object
    if(req.userID != null){
        // Redirecting this user to the admin panel, using their userID as a parameter
        res.redirect("/admin/" + req.userID);
    } else {
        console.log("No user was found");
        res.send("Unable to login");
    }
});

// Exporting the router that was set up in this file, so that it can be included
// in the app.js file and specified as the route for all requests to the "/google" route
module.exports = router;