// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Requiring the custom google OAuth module, which exports an object with 
// a method to generate a new oauth url.
var googleOAuth = require("../google/googleOAuth");

// Requiring the custom database connection module, so that the one
// connection to the database can be reused throughout the application.
var dbconn = require("../database/connection.js");

// ALL REQUESTS
router.use(function(req, res, next){
    // Creating an empty array on the request object, to temporarily store
    // any errors that may occur throughout this route, so that they can
    // be rendered in the error page for the admin-errors route (should
    // any errors occur).
    req.adminErrors = [];
    
    if(req.userID != null){
        //req.headers.origin == null
        next();
    } else {
        res.send({});
    }
});

router.get("/loginUrl", function(req, res, next){
    // Generating a new oauth URL, using the relevant method from the custom
    // OAuth module, so as to provide the user will a link to click to allow
    // them to log in to their Google account to authenticate themselves on
    // this server.
    googleOAuth.generateOAuthUrl(function(oauthURL){
        // Rendering the index template, passing the oauthURL as the loginURL.
        res.send({loginUrl: oauthURL});
    });  
});

router.get("/user", function(req, res, next){
    dbconn.query("SELECT * FROM User WHERE id=" + req.userID, function(err, rows, fields){
        if(err){
            console.log(err);
        } else {
            if(rows.length > 0){
                var user = {
                    displayName: rows[0].display_name,
                    profileImage: rows[0].google_profile_image_url
                }
                res.send({user: user});
            } else {
                res.send({});
            }
        }
    });
});

router.get("/logout", function(req, res, next){
    req.session.destroy();
    req.userID = null;
    res.send();
});


// Exporting the router that was set up in this file, so that it can be included
// in the app.js file and specified as the route for all requests to the "/admin" route
module.exports = router;