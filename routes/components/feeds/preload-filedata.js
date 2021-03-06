// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Requiring the path module, so that strings can be joined and 
// normalised as paths to files on the server
var path = require('path');

// Requiring the file system module, so that this route can have access
// to the file system of the server i.e. to be able to create, open, edit 
// and save project files to the /projects directory
var fs = require("fs");

// Including the dbQuery module, which contains prepared queries to the 
// database, which ensure that all data used within them is sanitised and
// escaped before being included in a statement
var dbQuery = require("../../../custom_modules/database_query");

// PRE for requests to read/update/delete the contents of a project, it's collection or any items within those collections
router.use(function(req, res, next){
    // Creating a temporary array of the URL parameters, as these are not accessible within
    // this middleware (as no path has been defined). Accessing the url property of the request
    // object, removing the first character (which would be "/"), then splitting the resulting
    // string at the "?" (if one is present) and the accessing the first index of the resulting
    // array (i.e. ignoring the query string). Finally, splitting the resulting value at every 
    // "/" so as to create an array of name=value pairs i.e. ["1", "books"];
    var parameters = req.url.slice(1).split("?")[0].split("/");

    if(parameters.length > 0 && parameters[0] != ""){
        // Creating a new array on the request object, to store these parameters, so they can be used
        // throughout the feeds route.
        req.allParams = [];
    
        // Looping through all of the parameters in the temporary array created above, to insure
        // that only the indexes that contain a value are stored i.e. if a user requested /books/ this
        // would create an array of 2 items ["books", ""] as the last "/" would have be used to split
        // the string and would include an empty string in the parameters.
        for(var i=0; i< parameters.length; i++){
            // Checking that this parameters value is not empty
            if(parameters[i] != ""){
                // Adding this parameter to the request object's allParams array
                req.allParams.push(parameters[i].toLowerCase());
            }
        }
    
        req.projectID = req.allParams[0];
    
        // Creating an empty object, to store the contents and structure of the project files, so that
        // they can be used throughout this route
        req.fileData = {};
        if(req.userID != null && req.projectID != null){
            // Querying the database, to find the projects that this user has access to, by joining
            // the user table to the user_projects table. Returning only the columns needed for the 
            // reponse to the user. 
            dbQuery.get_UserProject_Project_User("up.access_level_int, u.display_name, u.email_address", req.userID, req.projectID, function(err, row){
                if(err){ console.log(err); }
                if(row){
                    // Storing the users access level on the request object, to be used throughout
                    // the rest of this route
                    req.user_access_level = row.access_level_int;

                    next();
                } else {
                    // Since no rows were returned from the database, this user does not have access
                    // to this project structure. Adding this as an error to the feedsErrors array.
                    req.feedsErrors.push("Server error - this user does not have admin access to this project");

                    // Since this is a significant issue, passing this request to the feeds-errors
                    // route, by calling the next method with an empty error (as all errors will be
                    // accessible from the feedsErrors array).
                    next(new Error());
                }
            });
        } else if(req.projectID != null){
            dbQuery.get_Project("max_cache_age", req.projectID, function(err, row){
                if(err || row == null){
                    console.log(err);
                } else {
                    if(row.max_cache_age != null){
                        req.max_cache_age = row.max_cache_age;
                    }
                }
                next();
            });
        } else {
            // Since no userID or projectID was supplied in the request, passing this on to the next
            // stage of the router below (so that just the project content can be returned,
            // without the project structure included)
            next();
        }
    } else {
        next();
    }    
});
// Continued - PRE for requests to read the contents of a project, it's collection or any items within those collections
router.use(function(req, res, next){
    if(req.projectID != null){
        // Reading this projects admin.json file from the project directory (which is named
        // as per the projects ID), so that the project structure can be returned to the user
        var adminJsonPath = path.join(process.env.ROOT_DIR, "/projects/", req.projectID.toString(), "/admin.json");
        fs.readFile(adminJsonPath, {encoding: "utf-8"}, function(err, data){
            if(err){
                // Logging this error to the console
                console.log(err);
    
                // Unable to load this projects admin.json file, to read the structure of the 
                // project. Adding this as an error to the feedsErrors array.
                req.feedsErrors.push("Server error - unable to load this projects structure");
    
                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                next(new Error());
            } else {
                var projectAdminFile = JSON.parse(data);
                if(req.user_access_level == null){
                    req.projectStructure = projectAdminFile.project_structure;
                } else {
                    // Adding the data returned from the admin file, and storing it as the 
                    // admin property of the fileData object, so that it can be used 
                    // throughout this route
                    req.fileData.admin = projectAdminFile;
                }            
    
                // Passing this request on to the next stage of this route, so that
                // the admin data of the project can be used throughout this route
                next();                    
            }
        });
    } else {
        next();
    }
});

// Continued - PRE for requests to read the contents of a project, it's collection or any items within those collections
router.use(function(req, res, next){
    if(req.projectID != null){
        // Reading the contents of the content.json file of the project, from the project directory
        // (named as per the projectID), so that the contents of the project can be returned to the user
        var contentJsonPath = path.join(process.env.ROOT_DIR, "/projects/", req.projectID.toString(), "/content.json");
        fs.readFile(contentJsonPath, {encoding: "utf-8"}, function(err, projectContent){
            if(err){
                // Logging error to the database
                console.log(err);

                // Unable to load this projects content.json file, to read the content of the 
                // file. Adding this as an error to the feedsErrors array.
                req.feedsErrors.push("Server error - unable to load this projects contents");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                next(new Error());
            } else {
                // Adding the content of the project (as returned from the content.json file) as 
                // the content property on the file data object, so that it can be used throughout
                // the rest of this route
                req.fileData.content = JSON.parse(projectContent);

                // Passing this request on to the next stage of the router, so that the specific
                // portions of the project that have been requested can be traversed and returned
                // to the user as appropriate
                next();
            }
        });
    } else {
        // Passing this request on to the next stage of the router, although no file content
        // has been loaded (so either this request will fail further on through the route,
        // or this is a request to create a new project)
        next();
    }
    
});

// Exporting the router that was set up in this file, so that it can be included
// in the feeds.js route and used to pre load the appropriate data files for all requests
module.exports = router;