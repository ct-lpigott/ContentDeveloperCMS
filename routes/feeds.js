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

var validation = require("./feeds-components/validation.js");

// ALL REQUESTS ------------------------------------------------------------------------------------------------------------
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

    // Checking if a userID was included in the query string
    if(req.query.userID != null){
        // Setting a userID property on the request object, and passing it the
        // value of the userID from the query string. Using this approach so that
        // if the method of passing the userID should need to change, this will
        // be the only instance that will need to be updated (as req.userID is used
        // throughout this route).
        req.userID = req.query.userID;
    }

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

// CREATE ------------------------------------------------------------------------------------------------------------
// Request to create a new project
router.post("/", function(req, res, next){
    console.log("POST to create new project");

    // Checking that a project name has been included in the request body
    if(req.body.projectName != null){
        // Creating a new project in the database, using the project name provided 
        // in the request body, escaping this value before passing it to the database
        dbconn.query("INSERT INTO Project(project_name) VALUES(" + dbconn.escape(req.body.projectName) + ")", function(err, result){
            if(err){
                // Logging the error to the console
                console.log(err);

                // As it has not been possible to create the new project in the 
                // projects table, adding this as an error to the feedsErrors array.
                req.feedsErrors.push("Unable to create this project");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                next(new Error());
            } else {
                // Storing the ID of the newly created project, as returned in the result object
                // from the database query, as a temporary variable on the request object, so that
                // it can be used throughout the rest of this requests routing
                req.projectID = result.insertId;

                // Creating a new entry in the User_Project database, to add the current user as an
                // administrator of this project. Defaulting this user to have the highest level
                // of access to this project i.e. 1
                dbconn.query("INSERT INTO User_Project(user_id, project_id, user_access_level) VALUES(" + req.userID + ", " + req.projectID + ", 1)", function(err, result){
                    if(err){
                        // Logging the error to the console
                        console.log("Error - Unable to link this new project with the current user", err);

                        // As it has not been possible to create the relationship between the new 
                        // project and this user, adding this as an error to the feedsErrors array.
                        req.feedsErrors.push("Server error - unable to create project");

                        // Since this is a significant issue, passing this request to the feeds-errors
                        // route, by calling the next method with an empty error (as all errors will be
                        // accessible from the feedsErrors array).
                        next(new Error());
                    } else {
                        // Creating a new directory within the /projects directory, so that all files
                        // relating to this project can be stored within it. Setting the directory name
                        // to be equal to the ID of the new project i.e. the first project created on this
                        // server will have all of its project files stores in /projects/1/
                        fs.mkdir("./projects/" + req.projectID, function(err){
                            if(err){
                                // Logging the error to the console
                                console.log("Error making folder " + err);

                                // As it has not been possible to create the folder for this project, 
                                // adding this as an error to the feedsErrors array.
                                req.feedsErrors.push("Server error - unable to create project");

                                // Since this is a significant issue, passing this request to the feeds-errors
                                // route, by calling the next method with an empty error (as all errors will be
                                // accessible from the feedsErrors array).
                                next(new Error());
                            } else {
                                // Loading in the project template file, which will be used to instantiate the
                                // admin.json file for this project 
                                fs.readFile("./projects/project_template.json", function(err, data){
                                    // Creating a projectTemplate object. Defaulting this to be an empty
                                    // object, which will be replaced by the contents of the template file,
                                    // if this was loaded without error.
                                    var projectTemplate = {};

                                    // Checking if an error occurred when loading the template
                                    if(err){
                                        // Logging this to the console
                                        console.log("Error reading project template file " + err);
                                    } else {
                                        // Setting the project template to be equal to the contents
                                        // of the template file, parsed from JSON to be an object
                                        projectTemplate = JSON.parse(data);
                                    }
                                        
                                    // Setting the default values for the properties of the project template 
                                    // file i.e. the ID and name of the project, the date it was created,
                                    // as well as the date it was last updated (both will be the same date
                                    // as this is a new project). Finally, setting the last_updated_by
                                    // property to the current users ID
                                    projectTemplate.project_id = req.projectID;
                                    projectTemplate.project_name = req.body.projectName;
                                    projectTemplate.date_created = projectTemplate.date_updated = Date.now();
                                    projectTemplate.last_updated_by = req.userID;

                                    // Creating the admin.json file for this project, within the directory that
                                    // was created above. Passing in a JSON string of the projectTemplate
                                    // object created above, so that this will be the initial content for this
                                    // file.
                                    fs.writeFile("./projects/" + req.projectID + "/admin.json", JSON.stringify(projectTemplate), function(err){
                                        if(err) {
                                            // Logging the error to the console
                                            console.log("Error making admin.json file " + err);

                                            // As it has not been possible to create the admin.json file for this 
                                            // project, adding this as an error to the feedsErrors array.
                                            req.feedsErrors.push("Server error - unable to create project");

                                            // Since this is a significant issue, passing this request to the feeds-errors
                                            // route, by calling the next method with an empty error (as all errors will be
                                            // accessible from the feedsErrors array).
                                            next(new Error());
                                        } else {
                                            console.log("Project admin file created");

                                            // Creating a new content.json file for this project, within the project
                                            // directory created above. Passing in an empty object (as a JSON string)
                                            // as this file will not yet contain any content
                                            fs.writeFile("./projects/" + req.projectID + "/content.json", "{}", function(err){
                                                if(err) {
                                                    // Logging the error to the console
                                                    console.log("Error making file " + err);

                                                    // As it has not been possible to create the content.json file for this 
                                                    // project, adding this as an error to the feedsErrors array.
                                                    req.feedsErrors.push("Server error - unable to create project");

                                                    // Since this is a significant issue, passing this request to the feeds-errors
                                                    // route, by calling the next method with an empty error (as all errors will be
                                                    // accessible from the feedsErrors array).
                                                    next(new Error());
                                                } else {
                                                    console.log("Project content file created");

                                                    // As this project has now successfully been created, redirecting this request
                                                    // to the /feeds/userID route, so that the list of projects belonging to this
                                                    // user (which will now include this new project) will be returned in the
                                                    // response object
                                                    res.redirect("/feeds/" + req.userID);
                                                }
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    } else {
        // This request has no project name, and so cannot continue through this
        // route. Adding this as an error to the feedsErrors array.
        req.feedsErrors.push("No new project name provided in the request");

        // Since this is a significant issue, passing this request to the feeds-errors
        // route, by calling the next method with an empty error (as all errors will be
        // accessible from the feedsErrors array).
        next(new Error());
    }
    
});

// Request to add a collection to a project
router.post("/:projectID", function(req, res, next){
    res.send("POST request received from userID=" + req.userID + " for projectID=" + req.params.project);
});

// Request to add an item to a collection within a project
router.post("/:projectID/:collection", function(req, res, next){
    res.send("POST request received from userID=" + req.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection);
});

// READ ------------------------------------------------------------------------------------------------------------
// Request to get the list of projects accessible by this user
router.get("/", function(req, res, next){
    console.log("GET request from " + req.userID + " to view all projects");

    // Checking that a userID has been provided within the request
    if(req.userID != null){
        // Querying the database, to find the projects that this user has access to, by joining
        // the user table to the user_projects table. Returning only the columns needed for the 
        // reponse to the user
        dbconn.query("SELECT up.project_id, p.project_name, up.user_access_level FROM Project p LEFT JOIN User_Project as up ON p.id = up.project_id WHERE up.user_id =" + dbconn.escape(req.userID), function(err, rows, fields){
            if(err){
                // Logging this error to the console
                console.log(err);

                // An error has occurred in the database. Adding this as an error to the feedsErrors array.
                req.feedsErrors.push("Server error - unable to access this users projects");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                next(new Error());
            } else {
                // Checking that at least one project has been returned from the database
                if(rows.length > 0){
                    // Sending the resulting rows from the database query, as the response
                    // to the user. These rows will only contain the columns specified in the 
                    // query i.e. project ID, project name and user acces level
                    res.send(rows);
                } else {
                    res.send("This user has no projects");
                }
            }
        });
    } else {
        // This request has no userID, and so it was not possible to find this
        // users projects. Adding this as an error to the feedsErrors array.
        req.feedsErrors.push("No body provided in the request");

        // Since this is a significant issue, passing this request to the feeds-errors
        // route, by calling the next method with an empty error (as all errors will be
        // accessible from the feedsErrors array).
        next(new Error());
    }
    
});

// PRE for requests to read/update/delete the contents of a project, it's collection or any items within those collections
router.use(function(req, res, next){
    // Creating a temporary array of the URL parameters, as these are not accessible within
    // this middleware (as no path has been defined). Accessing the url property of the request
    // object, removing the first character (which would be "/"), then splitting the resulting
    // string at the "?" (if one is present) and the accessing the first index of the resulting
    // array (i.e. ignoring the query string). Finally, splitting the resulting value at every 
    // "/" so as to create an array of name=value pairs i.e. ["1", "books"];
    var parameters = req.url.slice(1).split("?")[0].split("/");

    // Creating a temporary parameters object on the request, to store the value of the userID
    // and projectID that should be used within this middleware to load in the relevant files
    // data, so that the contents of these can be reused throughout this route. The values stored
    // within the tmp parameters will only be used within this funciton, and the one directly below.
    req.tmpParams = {
        userID: req.userID,
        projectID: parameters[0]
    };

    // Creating an empty object, to store the contents and structure of the project files, so that
    // they can be used throughout this route
    req.fileData = {};

    if(req.userID != null){
        // Querying the database, to find the projects that this user has access to, by joining
        // the user table to the user_projects table. Returning only the columns needed for the 
        // reponse to the user. 
        dbconn.query("SELECT * FROM Project p LEFT JOIN User_Project up ON p.id = up.project_id WHERE p.id = " + dbconn.escape(req.tmpParams.projectID) + " AND up.user_id = " + dbconn.escape(req.tmpParams.userID), function(err, rows, fields){
            if(err){
                // Logging this error to the console
                console.log(err);

                // Unable to query the database to check if this user has access to the structure
                // of this project. Adding this as an error to the feedsErrors array.
                req.feedsErrors.push("Unable to confirm user access to this project so no project structure has been returned");

                // Passing this request on to the next stage of this route
                next();
            } else {
                // Checking that a row has been returned from the database i.e. that this user has
                // been matched with this project.
                if(rows.length > 0){

                    // Storing the users access level on the request object, to be used throughout
                    // the rest of this route
                    req.user_access_level = rows[0].user_access_level;

                    // Reading this projects admin.json file from the project directory (which is named
                    // as per the projects ID), so that the project structure can be returned to the user
                    fs.readFile("./projects/" + req.tmpParams.projectID + "/admin.json", {encoding: "utf-8"}, function(err, data){
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
                            // Adding the data returned from the admin file, and storing it as the 
                            // admin property of the fileData object, so that it can be used 
                            // throughout this route
                            req.fileData.admin = JSON.parse(data);

                            // Passing this request on to the next stage of this route, so that
                            // the admin data of the project can be used throughout this route
                            next();                    
                        }
                    });
                } else {
                    // Since no rows were returned from the database, this user does not have access
                    // to this project structure. Adding this as an error to the feedsErrors array.
                    req.feedsErrors.push("Server error - this user does not have admin access to this project");

                    // Since this is a significant issue, passing this request to the feeds-errors
                    // route, by calling the next method with an empty error (as all errors will be
                    // accessible from the feedsErrors array).
                    next(new Error());
                }          
            }
        });
    } else {
        // Since no userID was supplied in the request, passing this on to the next
        // stage of the router below (so that just the project content can be returned,
        // without the project structure included)
        next();
    }
    
});
// Continued - PRE for requests to read the contents of a project, it's collection or any items within those collections
router.use(function(req, res, next){
    // Reading the contents of the content.json file of the project, from the project directory
    // (named as per the projectID), so that the contents of the project can be returned to the user
    fs.readFile("./projects/" + req.tmpParams.projectID + "/content.json", {encoding: "utf-8"}, function(err, projectContent){
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
});

// Request to get the entire content of a project
router.get("/:projectID", function(req, res, next){
    if(req.fileData.admin != null){
        // Adding the value of the project structure property of the project admin file, 
        // as the structure property on the responseObject.
        req.responseObject.structure = req.fileData.admin.project_structure;

        // Adding the content of the project (as returned from the content.json file) as 
        // a property on the response object, as the response will contain both the content
        // and the structure
        req.responseObject.content = req.fileData.content;
    } else {
        // Setting the content of the project (as stored on the request object) as 
        // the response object, as no structure will be returned alongside the content
        req.responseObject = req.fileData.content;
    }
            
    // Sending the response object back in the response (which may contain the project structure,
    // project content and possibly some errors)
    res.send(req.responseObject);
});

// Request to get the content of a collection in a project
router.get("/:projectID/:collection", function(req, res, next){
    // Temporarily storing the collection name (as requested in the URL parameters) on
    // the request object, so that it can be used throughout this route. Transforming
    // the collection name to lowercase, for use within the route. 
    req.collectionName = req.params.collection.toLowerCase();

    console.log("Request for the " + req.collectionName + " collection");
    
    // Parsing the content of the requested collection, by accessing it from the project
    // content, as stored on the content object of the fileData object. If no content
    // is returned, then setting this value as an empty object.
    var collectionContent = req.fileData.content[req.collectionName] != null ? req.fileData.content[req.collectionName] : {};
        
    // Checking if admin data has been read from the projects admin.json file
    if(req.fileData.admin != null){
        // Adding the value of the collections project structure property of the project admin file, 
        // as the structure property on the responseObject.
        req.responseObject.structure = req.fileData.admin.project_structure[req.collectionName];

        // Adding the content of the project (as returned from the content.json file) as 
        // a property on the response object, as the response will contain both the content
        // and the structure
        req.responseObject.content = collectionContent;
    } else {
        // Setting the collection content of the project as the response object, as no structure 
        // will be returned alongside the content
        req.responseObject = collectionContent;
    }
            
    // Sending the response object back in the response (which may contain the project structure,
    // project content and possibly some errors)
    res.send(req.responseObject);
});

// Request to get the content of an item in a collection of a project
router.get("/:projectID/:collection/:item", function(req, res, next){
    // Temporarily storing the collection name (as requested in the URL parameters) on
    // the request object, so that it can be used throughout this route. Transforming
    // the collection name to lowercase, for use within the route. 
    req.collectionName = req.params.collection.toLowerCase();

    // Temporarily storing the item name (as requested in the URL parameters) on
    // the request object, so that it can be used throughout this route. Transforming
    // the item name to lowercase, for use within the route. 
    req.itemName = req.params.item.toLowerCase();

    console.log("Request for the " + req.item + " item of the " + req.collectionName + " collection");
    
    // Parsing the content of the requested collection, by accessing it from the project
    // content, as stored on the content object of the fileData object. If no content
    // is returned, then setting this value as an empty object.
    var collectionContent = req.fileData.content[req.collectionName][req.itemName] != null ? req.fileData.content[req.collectionName][req.itemName] : {};
        
    // Checking if admin data has been read from the projects admin.json file
    if(req.fileData.admin != null){
        // Adding the value of the collections project structure property of the project admin file, 
        // as the structure property on the responseObject.
        req.responseObject.structure = req.fileData.admin.project_structure[req.collectionName];

        // Adding the content of the project (as returned from the content.json file) as 
        // a property on the response object, as the response will contain both the content
        // and the structure
        req.responseObject.content = collectionContent;
    } else {
        // Setting the collection content of the project as the response object, as no structure 
        // will be returned alongside the content
        req.responseObject = collectionContent;
    }
            
    // Sending the response object back in the response (which may contain the project structure,
    // project content and possibly some errors)
    res.send(req.responseObject);    
});

// UPDATE ------------------------------------------------------------------------------------------------------------
// Request to update the entire contents of a project
router.put("/:projectID", function(req, res, next){
    // Determining the level of access this user has to this project
    switch(req.user_access_level){
        case 1: {
            if(req.body.projectStructure != null){
                // Transforming the project structure within the request body to lowercase,
                // as the project structure should not contain uppercase characters
                req.body.projectStructure = req.body.projectStructure.toLowerCase();                   

                // Temporarily storing the file data from the admin.json file, so that
                // it can be updated accordingly
                var adminProjectFile = req.fileData.admin;

                if(validation.jsonToObject(req.body.projectStructure)){
                    // Setting the date updated to the current time, the last_updated_by property to the
                    // ID of the current user, and the project_structure to the structure passed to the 
                    // request body
                    adminProjectFile.date_updated = Date.now();
                    adminProjectFile.last_updated_by = req.userID;
                    adminProjectFile.project_structure = JSON.parse(req.body.projectStructure);

                    // Updating the projects admin.json file, passing the adminProjectFile object created above
                    // (which contains the updated details of the project) as the content for the file as a JSON string
                    fs.writeFile("./projects/" + req.params.projectID + "/admin.json", JSON.stringify(adminProjectFile), function(err){
                        if(err) {
                            // Logging the error to the console
                            console.log("Error updating admin.json file " + err);

                            // Unable to update the admin.json file. Adding this as an error to the 
                            // feedsErrors array.
                            req.feedsErrors.push("Server error - unable to update project structure");

                            // Since this is a significant issue, passing this request to the feeds-errors
                            // route, by calling the next method with an empty error (as all errors will be
                            // accessible from the feedsErrors array).
                            next(new Error());
                        } else {
                            console.log("Project admin file updated");

                            // Sending the new project structure as the response to the request
                            res.send(adminProjectFile.project_structure);
                        }
                    });
                } else {
                    // This is not a valid JSON object. Adding this as an 
                    // error to the feedsErrors array.
                    req.feedsErrors.push("This is not valid JSON. Cannot update the project structure");

                    // Since this is a significant issue, passing this request to the feeds-errors
                    // route, by calling the next method with an empty error (as all errors will be
                    // accessible from the feedsErrors array).
                    next(new Error());
                }

                
            } else if(req.body.projectContent != null){
                // Passing this request to the next stage of the router, so that the content
                // can be updated
                next();
            } else {
                // Logging this error to the console
                console.log(err);

                // No structure or content were included in the request. Adding this as an 
                // error to the feedsErrors array.
                req.feedsErrors.push("No project content or structure included in the request");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                next(new Error());
            }
            break;
        }
        default: {
            // Checking if the user has included content in the request body
            if(req.body.projectContent != null){
                // Passing this request to the next stage of the router, so that the content
                // can be updated
                next();
            } else {
                // Logging this error to the console
                console.log(err);

                // No content were included in the request. Adding this as an error to the 
                // feedsErrors array.
                req.feedsErrors.push("No project content included in the request");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                next(new Error());
            }
            break;
        }
    }
});
// Continued - request to update the contents of an entire project
router.put("/:projectID", function(req, res, next){
    if(validation.jsonToObject(req.body.projectContent)){
        // Updating the projects content.json file to be equal to the content passed to the request
        // body. This content is already in JSON format
        fs.writeFile("./projects/" + req.params.projectID + "/content.json", req.body.projectContent, function(err){
            if(err) {
                // Logging this error to the console
                console.log("Error updating file " + err);

                // No content were included in the request. Adding this as an error to the 
                // feedsErrors array.
                req.feedsErrors.push("No project content included in the request");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                next(new Error());
            } else {
                console.log("Project content file updated");

                // Sending back a response with an empty JSON string, as the content has been
                // successfully updated
                res.send("{}");
            }
        }); 
    } else {
        // This is not a valid JSON object. Adding this as an 
        // error to the feedsErrors array.
        req.feedsErrors.push("This is not valid JSON. Cannot update the project content");

        // Since this is a significant issue, passing this request to the feeds-errors
        // route, by calling the next method with an empty error (as all errors will be
        // accessible from the feedsErrors array).
        next(new Error());
    }
    
});

// Request to add a collaborator to a project
router.put("/:projectID/addCollaborator", function(req, res, next){
    // Checking that an email address has been included in the request object
    if(req.body.email != null && req.body.email.length > 0){
        // Querying the database, to see if a user with this email address already exists
        dbconn.query("SELECT id FROM User WHERE email_address=" + dbconn.escape(req.body.email), function(err, rows, fields){
            if(err){
                // Logging the error to the console
                console.log("Error checking if user exists " + err);

                // Unable to check if this user already exists. Adding this as an error to the 
                // feedsErrors array.
                req.feedsErrors.push("Server error - unable to add collaborator to project");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                next(new Error());
            } else {
                // Checking if any results were returned from the database i.e. does this user
                // already exist
                if(rows.length > 0){
                    console.log("This is an existing user");
                    
                    // This is an existing user. Setting the newCollaboratorID to be equal to
                    // the ID of this user
                    req.newCollaboratorID = rows[0].id;

                    // Passing this request on to the next stage of this route, so that 
                    // this existing user can be added to the project
                    next();
                } else {
                    console.log("This is a new user");

                    // Creating a new user in the database, using the email provided in the request body
                    dbconn.query("INSERT INTO User(email_address) VALUES(" + dbconn.escape(req.body.email) +")", function(err, result){
                        if(err){
                            // Logging the error to the console
                            console.log("Error adding new user " + err);

                            // Unable add this new user to the database. Adding this as an error to the 
                            // feedsErrors array.
                            req.feedsErrors.push("Server error - unable to add collaborator to project");

                            // Since this is a significant issue, passing this request to the feeds-errors
                            // route, by calling the next method with an empty error (as all errors will be
                            // accessible from the feedsErrors array).
                            next(new Error());
                        } else {
                            // Setting the newCollaboratorID to the ID of the newly created user
                            req.newCollaboratorID = result.insertId;

                            // Passing this request on to the next stage of this route, so that 
                            // this new user can be added to the project
                            next();
                        }
                    });
                }
            }
        });
    }
});
// Continued - Continuation of route for request to add a collaborator to a project
router.put("/:projectID/addCollaborator", function(req, res, next){
    // Checking if an access level property was provided in the request, and that the
    // value of that property is greater than 0
    if(req.body.accessLevel != null && req.body.accessLevel > 0){
        // Querying the database, to check if this user is already connected with this project
        dbconn.query("SELECT * FROM User_Project WHERE user_id=" + req.newCollaboratorID + " AND project_id=" + req.params.projectID, function(err, rows, fields){
            if(err){
                // Logging the error to the console
                console.log("Error checking if user is already a contributor to project " + err);

                // Unable to check if this user is already connected to this project. Adding this as 
                // an error to the feedsErrors array.
                req.feedsErrors.push("Server error - unable to add collaborator to project");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                next(new Error());
            } else {
                // Checking if any results were returned from the database i.e. if this user is
                // already a collaborator on this project
                if(rows.length > 0){
                    // Determining if this users current access level is the same as the one
                    // included in the request i.e. to see if any change of access level is necessary
                    if(req.body.accessLevel == rows[0].user_access_level){
                        // Logging the error to the console
                        console.log("This user is already a collaborator on this project");

                        // This user already has this access level to the proejct. Adding this as 
                        // an error to the feedsErrors array.
                        req.feedsErrors.push("This user already has the requested access level for this project");

                        // Since this is a significant issue, passing this request to the feeds-errors
                        // route, by calling the next method with an empty error (as all errors will be
                        // accessible from the feedsErrors array).
                        next(new Error());
                    } else {
                        // As this is a different access level for this user, for this project, updating the
                        // user_project table to reflect this i.e. changing this users level for this project
                        dbconn.query("UPDATE User_Project SET user_access_level=" + dbconn.escape(req.body.accessLevel) + "WHERE user_id=" + req.newCollaboratorID, function(err, result) {
                            if(err){
                                // Logging the error to the console
                                console.log("Error updating user on project " + err);

                                // Unable to update this users access level to this project. Adding this as 
                                // an error to the feedsErrors array.
                                req.feedsErrors.push("Server error - unable update this users access level to this project");

                                // Since this is a significant issue, passing this request to the feeds-errors
                                // route, by calling the next method with an empty error (as all errors will be
                                // accessible from the feedsErrors array).
                                next(new Error());
                            } else {
                                console.log("Collaborators access level updated on project");

                                // Returning an empty JSON string, as the users access level has been updated
                                res.send("{}");
                            }
                        });
                    }
                } else {
                    // This user has not previously been a collaborator on this project, so creating a new
                    // relationship between the user and the project, using the access level provided
                    dbconn.query("INSERT INTO User_Project(user_id, project_id, user_access_level) VALUES(" + req.newCollaboratorID + ", " + req.params.projectID + ", " + dbconn.escape(req.body.accessLevel) + ")", function(err, result) {
                        if(err){
                            // Logging the error to the console
                            console.log("Error adding user to project " + err);

                            // Unable to create new entry in the user_project table. Adding this as 
                            // an error to the feedsErrors array.
                            req.feedsErrors.push("Server error - unable to add collaborator to project");

                            // Since this is a significant issue, passing this request to the feeds-errors
                            // route, by calling the next method with an empty error (as all errors will be
                            // accessible from the feedsErrors array).
                            next(new Error());
                        } else {
                            console.log("New collaborator added to project");

                            // Sending a response with an empty JSON string, as the collaborator
                            // has been successfully added to the project
                            res.send("{}");
                        }
                    });
                }
            }
        });
    } else {
        // Logging the error to the console
        console.log("No access level provided in the request");

        // No access level was provided in the request, unable to add collaborator. Adding this as 
        // an error to the feedsErrors array.
        req.feedsErrors.push("Unable to add collaborator to project - no access level provided in the request");

        // Since this is a significant issue, passing this request to the feeds-errors
        // route, by calling the next method with an empty error (as all errors will be
        // accessible from the feedsErrors array).
        next(new Error());
    }
});

// Request to update the content of an entire collection within a project
router.put("/:projectID/:collection", function(req, res, next){
    res.send("PUT request received from userID=" + req.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection);
});

// Request to update the content of an item within a collection of a project
router.put("/:projectID/:collection/:item", function(req, res, next){
    res.send("PUT request received from userID=" + req.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection + " and item=" + req.params.item);
});

// DELETE ------------------------------------------------------------------------------------------------------------
// Request to delete a project
router.delete("/:projectID", function(req, res, next){
    res.send("DELETE request received from userID=" + req.userID + " for projectID=" + req.params.project);
});

// Request to delete a collection from a project
router.delete("/:projectID/:collection", function(req, res, next){
    res.send("DELETE request received from userID=" + req.userID + " for projectID=" + req.params.project + " collection=" + req.params.collection);
});

// Request to delete an item from a collection within a project
router.delete("/:projectID/:collection/:item", function(req, res, next){
    // Temporarily storing the collection name (as requested in the URL parameters) on
    // the request object, so that it can be used throughout this route. Transforming
    // the collection name to lowercase, for use within the route. 
    req.collectionName = req.params.collection.toLowerCase();

    // Temporarily storing the item name (as requested in the URL parameters) on
    // the request object, so that it can be used throughout this route. Transforming
    // the item name to lowercase, for use within the route. 
    req.itemName = req.params.item.toLowerCase();

    // Checking if the user has the appropriate access level to be able to delete
    // an item from this project
    switch(req.user_access_level) {
        default: {
            // Creating a temporary variable, to store the current project content, so
            // that it can be updated based on the request
            var updatedProjectContent = req.fileData.content;
                    
            // Determining what data type the collection that this item exists within is,
            // so as to decide how best to remove this item from it
            switch(updatedProjectContent[req.collectionName].constructor){
                case Array: {
                    console.log("array");
                    // Accessing the requested collection, from the temporary project content
                    // file, and splicing the requested item from it (removing only 1)
                    updatedProjectContent[req.collectionName].splice([req.itemName], 1);
                }
            }

            
            // Checking that a change has been made to the project content i.e. that it
            // is not the same as it was when the file was first read in at the beginning of
            // this request
            if(JSON.stringify(updatedProjectContent) != req.fileData.content){
                // Updating the content.json file of the project, with the updated project content
                // as a JSON string
                fs.writeFile("./projects/" + req.params.projectID + "/content.json", JSON.stringify(updatedProjectContent), function(err){
                    if(err) {
                        // Logging the error to the console
                        console.log("Error updating content.json file " + err);

                        // Unable to update the project content.json file. Adding this as 
                        // an error to the feedsErrors array.
                        req.feedsErrors.push("Server error - unable to update the project content");

                        // Since this is a significant issue, passing this request to the feeds-errors
                        // route, by calling the next method with an empty error (as all errors will be
                        // accessible from the feedsErrors array).
                        next(new Error());
                    } else {
                        console.log("Project content file updated");

                        // Returning the updated project collection, that no longer contains this item,
                        // as the response to the request
                        res.send(updatedProjectContent[req.collectionName]);
                    }
                });
            }
            
            break;
        }
    }          
});

// Exporting the router that was set up in this file, so that it can be included
// in the app.js file and specified as the route for all requests to the "/feeds" route
module.exports = router;