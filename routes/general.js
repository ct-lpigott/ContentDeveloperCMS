// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var express = require('express').Router();

// Requiring the custom google OAuth module, which exports an object with 
// a method to generate a new oauth url.
var googleOAuth = require("../google/googleOAuth");

// Request for the main homepage of the website
router.get("/", function(req, res, next){
    // Generating a new oauth URL, using the relevant method from the custom
    // OAuth module, so as to provide the user will a link to click to allow
    // them to log in to their Google account to authenticate themselves on
    // this server.
    var oauthURL = googleOAuth.generateOAuthUrl();

    // Rendering the index template, passing the oauthURL as the loginURL.
    res.render("index", {loginURL: oauthURL});
});

// Exporting the router that was set up in this file, so that it can be included
// in the app.js file and specified as the route for all requests to root "/" route
module.exports = router;