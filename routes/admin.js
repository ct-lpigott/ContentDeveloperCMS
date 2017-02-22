// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

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

    if(req.query.userID != null){
        req.userID = req.query.userID;
    } else {
        req.adminErrors.push("No user ID provided. Cannot access admin panel");
        next(new Error);
    }

    // Allowing this request to continue through this route
    next();
});

// Request to view the list of projects available to this user 
router.get("/", function(req, res, next){
    console.log("Request recieved in admin route. ID=" + req.userID);

    // Querying the database for the user with an id that matches that passed within
    // the parameters of the URL. Escaping this value first.
    dbconn.query("SELECT * FROM User WHERE id=" + dbconn.escape(req.userID), function (err, rows, fields){
        // Checking if an error was returned from the database
        if(err){
            // Logging this error to the console
            console.log(err);
        } else {
            // Checking that there was at least one result returned from the database
            if(rows.length > 0){
                // Rendering the admin template, supplying it with the title of the
                // page and the user
                res.render("admin", {
                    pageTitle: "Admin Panel",
                    user: rows[0] 
                });
            } else {
                req.adminErrors.push("This user is not recognised");
                next(new Error);
            }
        }
    });
});

// Request to view a specific project belonging to this user
router.get("/:projectID", function(req, res, next){
    // Querying the database, to check if this user has permissions to access this project, using
    // the project id and user id supplied in the URL parameters (ecscaping both before they are passed
    // to the query).
     dbconn.query("SELECT * FROM Project p LEFT JOIN User_Project up ON p.id = up.project_id LEFT JOIN User u ON u.id = up.user_id WHERE p.id = " + dbconn.escape(req.params.projectID) + " AND up.user_id = " + dbconn.escape(req.userID), function(err, rows, fields){
        // Checking if any errors were returned from the database
        if(err){
            // Logging these errors to the console
            console.log(err);
        } else {
            if(rows.length > 0){
                var templateToRender = "";

                // Determining if a more specific template should be used, based on the user's access
                // level to this project
                switch(rows[0].access_level_int) {
                    case 1: {
                        // For administrator level users, changing the template to render to be the
                        // "editproject_admin" template
                        templateToRender = "editproject_admin";
                        break;
                    }
                    default: {
                        // For all other level users, changing the template to render to be the
                        // "editproject_content" template
                        templateToRender = "editproject_content";
                        break;
                    }
                }

                // Rendering the appropriate template for the user's access level to this project
                // (as determined above), passing it the project name as the page title, user ID
                // of the current user, project ID of the current project and project name.
                // The actual contents of this project will be requested through the feeds REST API
                // by requests made on the client side once the page loads.
                res.render(templateToRender, {
                    pageTitle: rows[0].project_name,
                    userID: req.userID,
                    user: rows[0],
                    projectID: req.params.projectID,
                    projectName: rows[0].project_name 
                });
            } else {
                req.adminErrors.push("This user does not have permission to access this project");
                next(new Error);
            }            
        }
     });
});

// Exporting the router that was set up in this file, so that it can be included
// in the app.js file and specified as the route for all requests to the "/admin" route
module.exports = router;