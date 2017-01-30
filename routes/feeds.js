// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// All
router.use(require("./components/feeds/request-validation.js"));
router.use(require("./components/feeds/database-only.js"));
router.use(require("./components/feeds/preload-filedata.js"));

// CREATE (post)
router.post("*", require("./components/feeds/feeds-create.js"));

// READ (get)
router.get("*", require("./components/feeds/feeds-read.js"));

// UPDATE (put)
router.put("*", require("./components/feeds/feeds-update.js"));

// DELETE (delete)
router.delete("*", require("./components/feeds/feeds-delete.js"));

// Exporting the router that was set up in this file, so that it can be included
// in the app.js file and specified as the route for all requests to the "/feeds" route
module.exports = router;