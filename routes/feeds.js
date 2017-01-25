// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Requiring the file system module, so that this route can have access
// to the file system of the server i.e. to be able to create, open, edit 
// and save project files to the /projects directory
var fs = require("fs");

// Requiring the custom database connection module, so that the one
// connection to the database can be reused throughout the application.
var dbconn = require("../database/connection.js");

// Requiring the custom google OAuth module, which exports an object with 
// a method to generate a new oauth url, and a method which returns
// a new OAuth2Client.
var googleOAuth = require("../google/googleOAuth");

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