// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// All
router.use(require("./components/feeds/request-validation.js"));
router.use(require("./components/feeds/feeds-actions.js"));
router.use(require("./components/feeds/preload-filedata.js"));

// CREATE (post)
router.post("*", require("./components/feeds/feeds-create.js"));

// READ (get)
router.get("*", require("./components/feeds/feeds-read.js"));

// UPDATE (put)
router.put("*", require("./components/feeds/feeds-update.js"));

// DELETE (delete)
router.delete("*", require("./components/feeds/feeds-delete.js"));

// Update all files (if any changes have occurred)
router.use(require("./components/feeds/feeds-update-files.js"));

// Error Catcher
router.use(function(req, res, next){
    // No request should ever drop out of the end of this route, and 
    // so if it reaches this point and error must have occurred along the way.
    // Passing this request to the feeds-errors route, by calling the next 
    // method with an empty error (as all errors will be accessible from the 
    // feedsErrors array).
    next(new Error);
});

// Exporting the router that was set up in this file, so that it can be included
// in the app.js file and specified as the route for all requests to the "/feeds" route
module.exports = router;