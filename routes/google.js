// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Requiring the googleapis module, so that it can be used within
// within this module to make requests to specific Google APIs
// i.e. to make request to the Plus API, to get the users email address
var google = require("googleapis");

var dbQuery = require("../custom_modules/database_query");

// Requiring the custom google OAuth module, which exports an object with 
// a method to generate a new oauth url, and a method which returns
// a new OAuth2Client.
var googleOAuth = require("../custom_modules/google_oauth");

// Request from the Google API, returning the user from a successful login to
// their Google account
router.get("/oauthRedirectURL", function(req, res, next){
    // Temporarily storing the auth code, included in the request, as this will be used
    // request the access token from the Google API i.e. it proves that the user has 
    // authorised us to do so
    var authCode = req.query.code;

    // Creating a new OAuth2Client, using the generateOAuth2Client() method of the custom
    // googleOAuth module
    googleOAuth.generateOAuth2Client(null, function(oauth2Client){
        // Requesting an access token from the Google API, using the access token returned
        // from the users login to their Google account
        oauth2Client.getToken(authCode, function(err, token) {
            if(err) {
                console.log("Error while trying to retrieve access token " + err);
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
                    if(err){
                        console.log("Unable to get user - " + err);
                    } else {
                        // Temporarily storing the link to the users profile image (with
                        // the size specification removed - as by default it is set to 50px)
                        var userProfileImageURL = user.image.url.replace("?sz=50", "");

                        // Temporarily storing the users access token in a JSON string
                        var accessToken = JSON.stringify(token);
                        var refreshToken = token.refresh_token;

                        dbQuery.check_User(user.emails[0].value, function(err, userId){
                            dbQuery.get_User("cd_user_auth_token", userId, function(err, row){
                                req.userAuthToken = row.cd_user_auth_token;

                                if(refreshToken != null){
                                    dbQuery.update_User(["display_name", "google_profile_image_url", "google_profile_id", "google_access_token", "google_refresh_token"], [user.displayName, userProfileImageURL, user.id, accessToken, refreshToken], userId, function(err, success){
                                        // Passing this request on to the next stage of this route
                                        next();
                                    });
                                } else {
                                    dbQuery.update_User(["display_name", "google_profile_image_url", "google_profile_id", "google_access_token"], [user.displayName, userProfileImageURL, user.id, accessToken], userId, function(err, success){
                                        // Passing this request on to the next stage of this route
                                        next();
                                    });
                                }
                                
                            });
                        });
                    }
                });  
            }
        });
    });
});
// Continued - Request from the Google API, returning the user from a successful login to
// their Google account
router.get("/oauthRedirectURL", function(req, res, next){
    // Checking that a userID exists on the request object
    if(req.userAuthToken != null){
        // Redirecting this user to the admin panel, using their userID as a 
        req.session.user_auth_token = req.userAuthToken;
        res.redirect("/angular/");
    } else {
        console.log("No user was found");
        res.send("Unable to login");
    }
});

// Exporting the router that was set up in this file, so that it can be included
// in the app.js file and specified as the route for all requests to the "/google" route
module.exports = router;