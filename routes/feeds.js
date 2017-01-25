// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// All
router.use(require("./components/feeds/request-validation.js"));
router.use(require("./components/feeds/database-only.js"));
router.use(require("./components/feeds/preload-filedata.js"));

// CREATE (post)
router.use(require("./components/feeds/feeds-create.js"));

// READ (get)
router.use(require("./components/feeds/feeds-read.js"));

// UPDATE (put)
router.use(require("./components/feeds/feeds-update.js"));

// DELETE (delete)
router.use(require("./components/feeds/feeds-delete.js"));

// Exporting the router that was set up in this file, so that it can be included
// in the app.js file and specified as the route for all requests to the "/feeds" route
module.exports = router;