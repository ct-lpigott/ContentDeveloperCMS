// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Requiring the custom google OAuth module, which exports an object with 
// a method to generate a new oauth url.
var googleOAuth = require("../custom_modules/google_oauth");

var dbQuery = require("./../custom_modules/database_query");

var projectFiles = require("./../custom_modules/project_files");

// ALL REQUESTS
router.use(function(req, res, next){
    // Creating an empty array on the request object, to temporarily store
    // any errors that may occur throughout this route, so that they can
    // be rendered in the error page for the admin-errors route (should
    // any errors occur).
    req.adminErrors = [];
    next();
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

router.use(function(req, res, next){    
    if(req.userID != null){
        next();
    } else {
        next(new Error("loginRequired"));
    }
});


router.get("/user", function(req, res, next){
    dbQuery.get_User("display_name, google_profile_image_url", req.userID, function(err, row){
        if(err){ console.log(err); }
        if(row){
            var user = {
                displayName: row.display_name,
                profileImage: row.google_profile_image_url,
                id: req.userID
            }
            res.send({user: user});
        } else {
            res.send({});
        }
    });
});

router.get("/logout", function(req, res, next){
    req.session.destroy();
    req.userID = null;
    res.send();
});


router.get("/settings/:projectID", function(req, res, next){
    dbQuery.get_UserProject_Project("p.update_origins, p.read_origins, up.public_auth_token", req.userID, req.params.projectID, function(err, row){
        if(err){ console.log(err); }
        if(row){
            var adminSettings = {
                update_origins: row.update_origins,
                read_origins: row.read_origins,
                public_auth_token: row.public_auth_token.toString()
            };
            res.send(adminSettings);
        } else {
            res.send({});
        }
    });
});

router.put("/settings/:projectID", function(req, res, next){ 
    dbQuery.update_Project(["update_origins", "read_origins"], [req.body.update_origins, req.body.read_origins], req.userID, req.params.projectID, function(err, success){
        if(err){ console.log(err); }
        res.send({success: success});
    });
});

router.put("/settings/:projectID/publicAuthToken", function(req, res, next){
    if(req.body.public_auth_token != null){
        dbQuery.update_UserProject_PublicAuthToken(req.userID, req.params.projectID, req.body.public_auth_token, function(err, newPublicAuthToken){
            res.send({success: newPublicAuthToken != null, public_auth_token: newPublicAuthToken});
        })
    }
        
});

// Request to delete a project
router.delete("/:projectID", function(req, res, next){
    if(req.query.projectName != null){
        dbQuery.delete_Project(req.userID, req.params.projectID, req.query.projectName, function(err, success){
            if(success){
                projectFiles.deleteProject(req.params.projectID, function(err, success){
                    res.send({success: success});
                });
            } else {
                res.send({success: success});
            }                        
        });
        //res.send({success: "DELETE request received from userID=" + req.userID + " for projectID=" + req.params.projectID});
    } else {
        req.adminErrors.push("Cannot delete this project");
    }    
});


// Exporting the router that was set up in this file, so that it can be included
// in the app.js file and specified as the route for all requests to the "/admin" route
module.exports = router;