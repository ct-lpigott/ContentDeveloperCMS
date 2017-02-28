// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Preforming initial checks on all request to this route
router.use(function(req, res, next){
    // Creating an empty array on the request object, to temporarily store
    // any errors that may occur throughout this route, so that they can
    // be appended to the responseObject in the feeds-errors route (should
    // any errors occur). Not mounting the errors array on the responseObject
    // by default, so as not to continually return an empty errors array.
    req.feedsErrors = [];

    // Creating a responseObject property on the request, so that it
    // can be built upon as the request passes through the router. Initialising
    // this to be an empty object. 
    req.responseObject = {};

    // Checking the type of HTTP method used for this request, as all non-GET request 
    // methods are expected to have both a userID and a body included with them
    if(req.method == "GET") {
        // Since this is a GET request, it can continue throughout this route without
        // any additional checks
        next();
    } else {
        // Checking that the userID is present
        if(req.userID != null){
            // Checking that the request has a request body
            if(req.body != null){
                // This request has both a userID and a request body, and so it can
                // continue through this route
                next();
            } else {
                // This request has no request body, and so cannot continue through this
                // route. Adding this as an error to the feedsErrors array.
                req.feedsErrors.push("No body provided in the request");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                next(new Error());
            }
        } else {
            // This request has no userID, and so cannot continue through this
            // route. Adding this as an error to the feedsErrors array.
            req.feedsErrors.push("No userID provided in the request");

            // Since this is a significant issue, passing this request to the feeds-errors
            // route, by calling the next method with an empty error (as all errors will be
            // accessible from the feedsErrors array).
            next(new Error());
        }
    }
});

// Exporting the router that was set up in this file, so that it can be included
// in the feeds.js route and used to preform intial checks on all requests
// received in the feeds API route
module.exports = router;