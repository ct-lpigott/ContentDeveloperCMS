// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Requiring the file system module, so that this route can have access
// to the file system of the server i.e. to be able to create, open, edit 
// and save project files to the /projects directory
var fs = require("fs");

var simpleGit = require("simple-git");

// Requiring the custom database connection module, so that the one
// connection to the database can be reused throughout the application.
var dbconn = require("../../../database/connection.js");

var accessLevels = require("../../../custom_modules/access_levels.js");

var validation = require("./../validation.js");

var googleOAuth = require("../../../google/googleOAuth.js");

// Request to create a new project
router.post("/", function(req, res, next){
    console.log("POST to create new project");

    // Checking that a project name has been included in the request body
    if(req.body.projectName != null){
        dbconn.query("SELECT google_auth_token FROM User WHERE id=" + req.userID, function(err, rows, fields){
            if(err){
                console.log(err);
            } else {
                if(rows.length > 0){
                    googleOAuth.createNewProjectFolder(req.body.projectName, rows[0].google_auth_token, function(newGoogleFolderId){
                        console.log(newGoogleFolderId);
                        // Creating a new project in the database, using the project name provided 
                        // in the request body, escaping this value before passing it to the database
                        dbconn.query("INSERT INTO Project(project_name, access_levels, media_folder_id) VALUES(" + dbconn.escape(req.body.projectName) + ", " + dbconn.escape(JSON.stringify(accessLevels.getDefaultAccessLevels())) + ", " + dbconn.escape(newGoogleFolderId) + ")", function(err, result){
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
                                dbconn.query("INSERT INTO User_Project(user_id, project_id, access_level_int) VALUES(" + req.userID + ", " + req.projectID + ", 1)", function(err, result){
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
                                                fs.readFile("./project_defaults/project_template.json", function(err, data){
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

                                                                    // Setting defaults to be used as the Git Credentials, incase there
                                                                    // is any issue with the query to the database, or the user's details
                                                                    // are not available
                                                                    var gitDisplayName = "Content Developer";
                                                                    var gitEmailAddress = process.env.EMAIL_ADDRESS;
                                                                
                                                                    // Creating a new Git repository for this project, and initialising it
                                                                    var newGitRepo = simpleGit("./projects/" + req.projectID);
                                                                    newGitRepo.init();

                                                                    var userDetails = dbconn.query("SELECT * FROM User WHERE id=" + req.userID, function(err, rows, fields){
                                                                        
                                                                        if(err){
                                                                            console.log("Issue when querying the database for the users details - git - " + err);
                                                                            // Not dealing with the error any further, as a response will already have been sent
                                                                            // to the client
                                                                        } else {
                                                                            if(rows.length > 0){
                                                                                // Accessing the user's name and email address from the database
                                                                                gitDisplayName = rows[0].display_name;
                                                                                gitEmailAddress = rows[0].email_address;
                                                                            }
                                                                        }

                                                                        // Setting up the configuration for this user, and then committing
                                                                        // all files in the project folder i.e. as the first commit to the
                                                                        // project
                                                                        newGitRepo
                                                                            .addConfig("user.name", gitDisplayName)
                                                                            .addConfig("user.email", gitEmailAddress)
                                                                            .add("./*")
                                                                            .commit("'" + req.body.projectName + "' project files created");
                                                                    });

                                                                    

                                                                    // As this project has now successfully been created, redirecting this request
                                                                    // to the /feeds/userID route, so that the list of projects belonging to this
                                                                    // user (which will now include this new project) will be returned in the
                                                                    // response object
                                                                    res.redirect("/feeds?userID=" + req.userID);
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
                    }); 
                }
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

// Request to create a new item or collections STRUCTURE in a project
router.post("/:projectID/*", function(req, res, next){
    // Checking that the request contains more than just the project ID
    if(req.allParams.length > 1){
        // Checking that the body of the request contains structure i.e. the structure
        // of the new item we are about to create
        if(req.body.structure != null){
            // Checking that the fileData (i.e. the current structure of the project) has
            // been loaded in the preload-filedata route)
            if(req.fileData.admin != null){
                // Checking that the structure included in the body of the request can 
                // successfully be parsed to JSON i.e. that it is valid JSON. Technically
                // it should never be able to reach this point if it is not, as it would
                // have thrown an error when passing through the body parser middleware
                // in app.js, so this is just to ensure that no invalid data gets through
                if(validation.objectToJson(req.body.structure)){                    
                    // Calling the createItem method (which is defined directly below this)
                    // to create the new item. Passing it the current structure file data, the
                    // encapsulationData (i.e. all the parameters of the request, excluding the
                    // projectID parameter - by slicing the array so it starts at index 1), as
                    // well as the structure required for the new item. The purpose of using a 
                    // function, that will only ever be available within this middleware, is that
                    // I need the file data structure to be passed by reference, as opposed to JavaScripts
                    // default "pass by value" approach. By passing this structure to a function, any 
                    // updates to its properties will be reflected in the object itself.
                    createItem(req.fileData.admin.project_structure, req.allParams.slice(1), req.body.structure);
                    
                    // Defining the createItem funciton, as described above
                    function createItem(structureFileData, encapsulationData, newItem){
                        // Determining the itemName and parentItem name, based on the last
                        // two values of the encapsulationData data (parameters of the request URL).
                        // Parent name may not always have a value, as the item may be at the top
                        // level of the content object, so defaulting this to null if no value exits
                        var itemName = encapsulationData[encapsulationData.length-1];
                        var parentName = encapsulationData[encapsulationData.length-2] || null;

                        // Creating an newItem property on the request object, to track if and
                        // when an item is created within this funciton (so as to determine if the 
                        // admin file needs to be updated)
                        req.newItem = null;

                        // Looping through the encapsulationData array (i.e. parameters passed to the
                        // request URL) to drill down into the fileData object, to find the property that
                        // needs to have an item created on it. Not including the last two indexes of the
                        // array, as these will be the parentName and itemName (as referenced above). By
                        // the end of this loop, I should have the item into which the new item should
                        // be created.
                        for(var i=0; i<encapsulationData.length; i++){
                            // Checking if the structureFileData currently contains an "items" property,
                            // in which case setting the structureFileData to this property (so that users
                            // don't have to continually type /books/items/attributes)
                            if(structureFileData.items != undefined){
                                structureFileData = structureFileData.items;
                            }
                            
                            // Checking if the above traversal has resulting in the structureFileData becoming "undefined",
                            // in which case a portion of the encapsulationData structure must not exist i.e. the user
                            // is trying to create an item within an object that does not exist
                            if(structureFileData[encapsulationData[i]] != undefined){
                                // Setting the structureFileData equal to the next level of the encapsulationData array
                                // i.e. to keep drilling down into the structureFileData object
                                structureFileData = structureFileData[encapsulationData[i]];
                            }
    
                            // Checking if the structureFileData currently contains an "attributes" property,
                            // in which case setting the structureFileData to this property (so that users
                            // don't have to continually type /books/items/attributes)
                            if(structureFileData.attributes != undefined){
                                structureFileData = structureFileData.attributes;
                            }
                        }
                        

                        // Checking whether the fileData object contains the property referred to in the parent
                        // name variable i.e. does the request new item have a parent, or is it at the top-most
                        // level of the project_structure object
                        if(structureFileData[parentName] != undefined){
                            // Checking if the parent contains attributes or items, or else assuming this new item
                            // is to be added to the parent
                            if(structureFileData[parentName]["attributes"] != undefined){
                                // Checking if this item name is already a property on the parent attributes object
                                if(structureFileData[parentName]["attributes"][itemName] != null){
                                    // Since this items parent attributes already contains a property by this name, cannot create this
                                    // item. Adding this to the feedsErrors array, and then returning this function so that no further 
                                    // attempt to create this item will be made. Since req.newItem will remain null, this error will 
                                    // be returned to the caller, further down along this route
                                    req.feedsErrors.push(itemName + " already exists in " + parentName + ". Please use PUT to update it.");
                                    return;
                                } else {
                                    // Adding this as a new property on the parents attributes object
                                    structureFileData[parentName]["attributes"][itemName] = newItem;
                                    req.gitCommitMessage = "New attribute structure added to " + parentName + ": '" + itemName + "'";
                                }
                            } else if(structureFileData[parentName]["items"] != undefined){
                                // Checking if this item name is already a property on the parent items object
                                if(structureFileData[parentName]["items"][itemName] != undefined){
                                    // Since this items parent items already contain a property by this name, cannot create this
                                    // item. Adding this to the feedsErrors array, and then returning this function so that no further 
                                    // attempt to create this item will be made. Since req.newItem will remain null, this error will 
                                    // be returned to the caller, further down along this route
                                    req.feedsErrors.push(itemName + " already exists in " + parentName + ". Use a PUT request to update it.");
                                    return;
                                } else {
                                    // Adding this as a new property on the parents items object
                                    structureFileData[parentName]["items"][itemName] = newItem;
                                    req.gitCommitMessage = "New item structure added to " + parentName + ": '" + itemName + "'";
                                }
                            } else {
                                // Checking if this item name is already a property on the parent object
                                if(structureFileData[parentName][itemName] != undefined){
                                    // Since this items parent already contain a property by this name, cannot create this
                                    // item. Adding this to the feedsErrors array, and then returning this function so that no further 
                                    // attempt to create this item will be made. Since req.newItem will remain null, this error will 
                                    // be returned to the caller, further down along this route
                                    req.feedsErrors.push(itemName + " already exists in " + parentName + ". Use a PUT request to update it.");
                                    return;
                                } else {
                                    // Adding this as a new property on the parents object
                                    structureFileData[parentName][itemName] = newItem;
                                    req.gitCommitMessage = "New structure added to " + parentName + ": '" + itemName + "'";
                                }
                            }

                            // If the function has reached this point, then an item must have been created (as
                            // if this proved not to be possible, then the function would have returned by now).
                            // Setting this newItem property of the request object to be an empty object. Then
                            // creating a new property on this object, using the name of the parent (as this 
                            // will be the item into which the new item was inserted). Setting the value of this
                            // new property to be equal to the parent item we just added the new item to i.e. so
                            // that it now contains all of it's existing properties/indexes, plus the new item
                            // we created. Doing this in two seperate steps, as the parentName is being generated
                            // dynamically, so req.newItem.parentName would not be sufficient.
                            req.newItem = {};
                            req.newItem[parentName] = structureFileData[parentName];
                        } else {
                            // Since this item does not appear to have a parent, checking whether it exists
                            // at the top level of the file data project_structure i.e. is there a property by this 
                            // name already defined, or attributes/items which exist globally
                            if(structureFileData["attributes"] != undefined){
                                // Checking if this item name is already a property on the global attributes object
                                if(structureFileData["attributes"][itemName] != undefined){
                                    // Since the global attributes object already contains a property by this name, cannot create this
                                    // item. Adding this to the feedsErrors array, and then returning this function so that no further 
                                    // attempt to create this item will be made. Since req.newItem will remain null, this error will 
                                    // be returned to the caller, further down along this route
                                    req.feedsErrors.push(itemName + " already exists. Use a PUT request to update it.");
                                    return;
                                } else {
                                    // Adding this as a new property on the global attributes object
                                    structureFileData["attributes"][itemName] = newItem;
                                    req.gitCommitMessage = parentName != null ? "New structure attribute added to " + parentName + ": " + itemName : "New structure attribute added to global object: '" + itemName + "'";
                                } 
                                // If the function has reached this point, then an item must have been created (as
                                // if this proved not to be possible, then the function would have returned by now).
                                // Setting this newItem property of the request object to be an empty object. Then
                                // creating a new property on this object, using the name of the parent (as this 
                                // will be the item into which the new item was inserted). Setting the value of this
                                // new property to be equal to the global attributes object to i.e. so
                                // that it now contains all of it's existing properties/indexes, plus the new item
                                // we created. Doing this in two seperate steps, as the itemName is being generated
                                // dynamically, so req.newItem.itemName would not be sufficient.
                                req.newItem = {};
                                req.newItem[itemName] = structureFileData["attributes"];
                            } else if(structureFileData["items"] != undefined){
                                // Checking if this item name is already a property on the global items object
                                if(structureFileData["items"][itemName] != undefined){
                                    // Since the global items object already contains a property by this name, cannot create this
                                    // item. Adding this to the feedsErrors array, and then returning this function so that no further 
                                    // attempt to create this item will be made. Since req.newItem will remain null, this error will 
                                    // be returned to the caller, further down along this route
                                    req.feedsErrors.push(itemName + " already exists. Use a PUT request to update it.");
                                    return;
                                } else {
                                    // Adding this as a new property on the global items object
                                    structureFileData["items"][itemName] = newItem;
                                    req.gitCommitMessage = parentName != null ? "New structure item added to " + parentName + ": " + itemName :"New structure item added to global object: '" + itemName + "'";
                                } 
                                // If the function has reached this point, then an item must have been created (as
                                // if this proved not to be possible, then the function would have returned by now).
                                // Setting this newItem property of the request object to be an empty object. Then
                                // creating a new property on this object, using the name of the parent (as this 
                                // will be the item into which the new item was inserted). Setting the value of this
                                // new property to be equal to the global items object to i.e. so
                                // that it now contains all of it's existing properties/indexes, plus the new item
                                // we created. Doing this in two seperate steps, as the itemName is being generated
                                // dynamically, so req.newItem.itemName would not be sufficient.
                                req.newItem = {};
                                req.newItem[itemName] = structureFileData["items"];
                            } else {
                                // Since this item does not appear to have a parent, and there are no global attributes
                                // or items availabe, then it must be a new global object i.e. a collection. Checking
                                // if there is already a global object with this property name
                                if(structureFileData[itemName] != undefined){
                                    // Since the global items object already contains a property by this name, cannot create this
                                    // item. Adding this to the feedsErrors array, and then returning this function so that no further 
                                    // attempt to create this item will be made. Since req.newItem will remain null, this error will 
                                    // be returned to the caller, further down along this route
                                    req.feedsErrors.push(itemName + " already exists. Please use PUT to update it");
                                    return;
                                    
                                } else {
                                    // Adding this as a new property on the global object
                                    structureFileData[itemName] = newItem;
                                    req.gitCommitMessage = parentName != null ? "New structure added to " + parentName + ": " + itemName : "New structure added to global object: '" + itemName + "'";
                                }
                                // If the function has reached this point, then an item must have been created (as
                                // if this proved not to be possible, then the function would have returned by now).
                                // Setting this newItem property of the request object to be an empty object. Then
                                // creating a new property on this object, using the name of the parent (as this 
                                // will be the item into which the new item was inserted). Setting the value of this
                                // new property to be equal to the global object to i.e. so
                                // that it now contains all of it's existing properties/indexes, plus the new item
                                // we created. Doing this in two seperate steps, as the itemName is being generated
                                // dynamically, so req.newItem.itemName would not be sufficient.
                                req.newItem = {};
                                req.newItem[itemName] = structureFileData[itemName];
                            }
                        }
                    }
                    
                    // Checking if the newItem property on the request object is still null
                    // i.e. has a new item been created? If not, then there will be no need to
                    // update the project admin file.
                    if(req.newItem != null){
                        req.updateFile = "structure";
                        req.resultData = req.newItem;
                        console.log("New item added to project structure");
                        next();
                    } else {
                        // Returning any errors set in the createItem() function to the caller
                        return next(new Error());
                    }
                    
                } else {
                    // As it has not been possible parse the updated object to JSON, the project structure
                    // cannot be updated. Adding this as an error to the feeds errors array.
                    req.feedsErrors.push("The content included is not valid JSON. Cannot create this item");

                    // Since this is a significant issue, passing this request to the feeds-errors
                    // route, by calling the next method with an empty error (as all errors will be
                    // accessible from the feedsErrors array).
                    return next(new Error());
                }
            } else {
                // As the project's structure has not been preloaded, this user must not have access
                // to this project. Adding this as an error to the feeds errors array.
                req.feedsErrors.push("This user does not have permission edit this projects structure");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                return next(new Error());
            }   
        } else {
            if(req.body.content != null){
                // Since there was no structure included in the request, then passing this on to 
                // the next stage of the router to see if there was content included
                next();
            } else {
                // As no structure has been included in the request, unable to create this item. 
                // Adding this as an error to the feeds errors array, incase an error gets thrown
                // later on in the route, but allowing the request to continue on, incase it was
                // a request to update the projects content.
                req.feedsErrors.push("No structure provied in the request");
                return;
            }            
        }
    } else {
        // Adding this as an error to the feeds errors array.
        req.feedsErrors.push("Not enough parameters provided to create this item");

        // Since this is a significant issue, passing this request to the feeds-errors
        // route, by calling the next method with an empty error (as all errors will be
        // accessible from the feedsErrors array).
        next(new Error());
    }
});

// Request to create a new item or collections CONTENT in a project
router.post("/:projectID/*", function(req, res, next){
    // Checking that the request contains more than just the project ID
    if(req.allParams.length > 1){
        // Checking that the body of the request contains content i.e. the content
        // of the new item we are about to create
        if(req.body.content != null){
            // Checking that the fileData (i.e. the current content of the project) has
            // been loaded in the preload-filedata route, and that the project's structure
            // has aswell, as it will be required in order to validate this new content
            if(req.fileData.content != null && req.fileData.admin != null){
                // Checking that the content included in the body of the request can 
                // successfully be parsed to JSON i.e. that it is valid JSON. Technically
                // it should never be able to reach this point if it is not, as it would
                // have thrown an error when passing through the body parser middleware
                // in app.js, so this is just to ensure that no invalid data gets through
                if(validation.objectToJson(req.body.content)){
                    
                    // Calling the createItem method (which is defined directly below this)
                    // to create the new item. Passing it the current content file data, the
                    // encapsulationData (i.e. all the parameters of the request, excluding the
                    // projectID parameter - by slicing the array so it starts at index 1), as
                    // well as the content required for the new item. The purpose of using a 
                    // function, that will only ever be available within this middleware, is that
                    // I need the file data content to be passed by reference, as opposed to JavaScripts
                    // default "pass by value" approach. By passing this content to a function, any 
                    // updates to its properties will be reflected in the object itself.
                    createItem(req.fileData.content, req.fileData.admin.project_structure, req.allParams.slice(1), req.body.content);
                    
                    // Defining the createItem funciton, as described above
                    function createItem(contentFileData, structureFileData, encapsulationData, newItem){
                        // Determining the itemName and parentItem name, based on the last
                        // two values of the encapsulationData data (parameters of the request URL).
                        // Parent name may not always have a value, as the item may be at the top
                        // level of the content object, so defaulting this to null if no value exits
                        var itemName = encapsulationData[encapsulationData.length-1];
                        var parentName = encapsulationData[encapsulationData.length-2] || null;

                        // Creating an newItem property on the request object, to track if and
                        // when an item is created within this funciton (so as to determine if the 
                        // content file needs to be updated)
                        req.newItem = null;

                        // Looping through the encapsulationData array (i.e. parameters passed to the
                        // request URL) to drill down into the fileData object, to find the property that
                        // needs to have an item created on it. 
                        for(var i=0; i<encapsulationData.length; i++){
                            //Not including the last two indexes of the
                            // array, as these will be the parentName and itemName (as referenced above). By
                            // the end of this loop, I should have the item into which the new item should
                            // be created.
                            if(i < encapsulationData.length - 2){
                                if(contentFileData[encapsulationData[i]] != null){
                                    // Setting the contentFileData equal to the next level of the encapsulationData array
                                    // i.e. to keep drilling down into the contentFileData object
                                    contentFileData = contentFileData[encapsulationData[i]];
                                } else {
                                    req.feedsErrors.push("'" + encapsulationData.slice(0, encapsulationData.length-1)[0].join("/") + "' does not exist. Please create the container objects first");
                                    return;
                                }
                                
                            }

                            // Ignoring index values, as these will have no relevance to the project structure
                            if(isNaN(encapsulationData[i])){
                                if(structureFileData[encapsulationData[i]] != undefined){
                                    // Setting the structureFileData equal to the next level of the encapsulationData array
                                    // i.e. to keep drilling down into the structureFileData object
                                    structureFileData = structureFileData[encapsulationData[i]];
                                } else if(structureFileData.items != undefined){
                                    structureFileData = structureFileData.items;
                                }
                            } else {
                                if(structureFileData.items != undefined){
                                    structureFileData = structureFileData.items;
                                } else {
                                    req.feedsErrors.push(encapsulationData[i] + " is not defined to contain items. Please update this items structure first.");
                                    return;
                                }
                            }
                        }

                        if(structureFileData[parentName] != null || structureFileData[itemName] != null || structureFileData.items != null || structureFileData.attributes != null){
                            // Checking whether the fileData object contains the property referred to in the parent
                            // name variable i.e. does the request new item have a parent, or is it at the top-most
                            // level of the project_structure object
                            if(contentFileData[parentName] != null){
                                // Determing what type of item we are trying to insert the new item into i.e.
                                // an Array, Object or other. Items can only ever be inserted to arrays or objects,
                                // and so if the result is other, an error will be thrown i.e. you cannot insert
                                // an object into a string
                                switch(contentFileData[parentName].constructor.name.toLowerCase()){
                                    case "array": {
                                        // Checking if the array we are trying to insert into already contains an index
                                        // with the same value as the itemName
                                        if(contentFileData[parentName][itemName] != undefined){
                                            // Since this index already exists within this array, adding this to the feedsErrors
                                            // array, and then returning this function so that no further attempt to create this
                                            // item will be made. Since req.newItem will remain null, this error will be returned
                                            // to the caller, further down along this route
                                            req.feedsErrors.push("Position " + itemName + " in " + parentName + " is already taken. Use a PUT request to update it.");
                                            return;
                                        } else {
                                            // PLACEHOLDER - For validating content against structure
                                            var validateContent = validation.contentStructure(newItem, structureFileData.items);   
                                            if(validateContent.successful){
                                                // Since this is an array, pushing the new item into the parent
                                                // Note that even if the user has specified an index position to insert
                                                // this item at, this will be ignored as the item can only ever be created
                                                // at the end of an array (PUT requests are used to update exisiting items)
                                                contentFileData[parentName].push(newItem);
                                                req.gitCommitMessage = "New content pushed to array: '" + parentName + "'";
                                            } else {
                                                // Looping through any errors that were returned from the content validation,
                                                // and adding them to the req.feedsErrors array, before returning the function,
                                                // as this content cannot be added to the project as it does not match with the
                                                // project structure (details of which will be inclued in the errors)
                                                for(var i=0; i<validateContent.errors.length; i++){
                                                    req.feedsErrors.push(validateContent.errors[i]);
                                                }
                                                return;
                                            }
                                        } 
                                        break;                   
                                    }
                                    case "object": {
                                        // Checking if the object we are trying to insert into already contains a property
                                        // with the same value as the itemName
                                        if(contentFileData[parentName][itemName] != undefined){
                                            // Since this property already exists within this object, adding this to the feedsErrors
                                            // array, and then returning this function so that no further attempt to create this
                                            // item will be made. Since req.newItem will remain null, this error will be returned
                                            // to the caller, further down along this route
                                            req.feedsErrors.push(itemName + " already exists in " + parentName + ". Use a PUT request to update it.");
                                            return;
                                        } else {
                                            // PLACEHOLDER - For validating content against structure
                                            var validateContent = validation.contentStructure(newItem, structureFileData[itemName].attributes);   
                                            if(validateContent.successful){
                                                // Since this is an object, creating a new property on the parent item (with the item name
                                                // supplied in the parameters), and setting its value to the new item value 
                                                contentFileData[parentName][itemName] = newItem;
                                                req.gitCommitMessage = "New content created in object:  '" + parentName + "." + itemName;
                                            } else {
                                                // Looping through any errors that were returned from the content validation,
                                                // and adding them to the req.feedsErrors array, before returning the function,
                                                // as this content cannot be added to the project as it does not match with the
                                                // project structure (details of which will be inclued in the errors)
                                                for(var i=0; i<validateContent.errors.length; i++){
                                                    req.feedsErrors.push(validateContent.errors[i]);
                                                }
                                                return;
                                            }
                                        }
                                        break;
                                    }
                                    default: {
                                        // Since this items parent is neither an Array or an Object, this item cannot be created inside 
                                        // it. Adding this to the feedsErrors array, and then returning this function so that no further 
                                        // attempt to create this item will be made. Since req.newItem will remain null, this error will 
                                        // be returned to the caller, further down along this route
                                        req.feedsErrors.push("Cannot create " + itemName + " inside of " + parentName);
                                        return;
                                        break;
                                    }
                                }

                                // If the function has reached this point, then an item must have been created (as
                                // if this proved not to be possible, then the function would have returned by now).
                                // Setting this newItem property of the request object to be an empty object. Then
                                // creating a new property on this object, using the name of the parent (as this 
                                // will be the item into which the new item was inserted). Setting the value of this
                                // new property to be equal to the parent item we just added the new item to i.e. so
                                // that it now contains all of it's existing properties/indexes, plus the new item
                                // we created. Doing this in two seperate steps, as the parentName is being generated
                                // dynamically, so req.newItem.parentName would not be sufficient.
                                req.newItem = {};
                                req.newItem[parentName] = contentFileData[parentName];
                            } else {
                                // Since this item does not appear to have a parent, checking whether it exists
                                // at the top level of the file data project_structure i.e. is there a property by this 
                                // name already defined
                                if(contentFileData[itemName] != undefined){
                                    // Since this property is already defined, checking whether it is an item
                                    // that can have other items added to it i.e. an Array or an Object.
                                    // Determing what type of item we are trying to insert the new item into i.e.
                                    // an Array, Object or other. Items can only ever be inserted to arrays or objects,
                                    // and so if the result is other, an error will be thrown i.e. you cannot insert
                                    // an object into a string
                                    switch(contentFileData[itemName].constructor.name.toLowerCase()){
                                        case "array": {
                                            // PLACEHOLDER - For validating content against structure
                                            var validateContent = validation.contentStructure(newItem, structureFileData.items);   
                                            if(validateContent.successful){
                                                // Since this is any array, pushing to the new item into it
                                                contentFileData[itemName].push(newItem); 
                                                req.gitCommitMessage = "New content added to array: " + itemName;
                                            } else {
                                                // Looping through any errors that were returned from the content validation,
                                                // and adding them to the req.feedsErrors array, before returning the function,
                                                // as this content cannot be added to the project as it does not match with the
                                                // project structure (details of which will be inclued in the errors)
                                                for(var i=0; i<validateContent.errors.length; i++){
                                                    req.feedsErrors.push(validateContent.errors[i]);
                                                }
                                                return;
                                            }
                                            break;                   
                                        }
                                        default: {
                                            // Since this item is neither an Array or an Object, it is just a 
                                            // property that already exists. If this property needs to be updated,
                                            // it should be done via a PUT request. Adding this to the feedsErrors 
                                            // array, and then returning this function so that no further attempt to 
                                            // create this item will be made. Since req.newItem will remain null, this 
                                            // error will be returned to the caller, further down along this route
                                            req.feedsErrors.push(itemName + " already exists. Please use PUT to update it");
                                            return;
                                            break;
                                        }
                                    }

                                } else {
                                    // PLACEHOLDER - For validating content against structure
                                    var validateContent = validation.contentStructure(newItem, structureFileData.attributes);   
                                    if(validateContent.successful){
                                        // Since this is a new collection (top level property) on the file data object, 
                                        // creating a new property (with the item name supplied in the parameters), 
                                        // and setting its value to the new item value 
                                        contentFileData[itemName] = newItem;
                                        req.gitCommitMessage = "New content created: '" + itemName + "'";
                                    } else {
                                        // Looping through any errors that were returned from the content validation,
                                        // and adding them to the req.feedsErrors array, before returning the function,
                                        // as this content cannot be added to the project as it does not match with the
                                        // project structure (details of which will be inclued in the errors)
                                        for(var i=0; i<validateContent.errors.length; i++){
                                            req.feedsErrors.push(validateContent.errors[i]);
                                        }
                                        return;
                                    }
                                }

                                // If the function has reached this point, then an item must have been created (as
                                // if this proved not to be possible, then the function would have returned by now).
                                // Setting this newItem property of the request object to be an empty object. Then
                                // creating a new property on this object, using the name of the new item. Setting 
                                // the value of this new property to be equal to the value of the item we just added
                                // Doing this in two seperate steps, as the itemName is being generated
                                // dynamically, so req.newItem.itemName would not be sufficient.
                                req.newItem = {};
                                req.newItem[itemName] = contentFileData[itemName];
                            }
                        } else {
                            if(isNaN(itemName)){
                                // Since there is no structure defined for this item, it cannot be created
                                // Adding this to the feedsErrors array, and then returning this function so
                                // that no further attempt to create this item will be made. Since req.newItem
                                // will remain null, this error will be returned to the caller, further down 
                                //valong this route
                                req.feedsErrors.push("There is no structure defined for " + itemName + ", so this content cannot be added");
                                return;
                            } else {
                                // Since this item appears to be an index value, returning a different error, as it 
                                // is not possible to create a new item at a specific index. Adding this to the 
                                // feedsErrors array, and then returning this function so that no further attempt 
                                // to create this item will be made. Since req.newItem will remain null, this error
                                // will be returned to the caller, further down along this route
                                req.feedsErrors.push("Cannot create an item based on a specific index. If you want to update this item, use a PUT request");
                                return;
                            }
                        }
                    }
                    
                    // Checking if the newItem property on the request object is still null
                    // i.e. has a new item been created? If not, then there will be no need to
                    // update the project content file.
                    if(req.newItem != null){
                        req.updateFile = "content";
                        req.resultData = req.newItem;
                        next();
                    } else {
                        // Returning any errors set in the createItem() function to the caller
                        return next(new Error());
                    }
                    
                } else {
                    // As it has not been possible parse the updated object to JSON, the content
                    // cannot be updated. Adding this as an error to the feeds errors array.
                    req.feedsErrors.push("The content included is not valid JSON. Cannot add to collection");

                    // Since this is a significant issue, passing this request to the feeds-errors
                    // route, by calling the next method with an empty error (as all errors will be
                    // accessible from the feedsErrors array).
                    return next(new Error());
                }
            } else {
                // Adding this as an error to the feeds errors array.
                req.feedsErrors.push("This user does not have permission to add to this collection");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                return next(new Error());
            }   
        } else {
            // As no content has been included in the request, unable to update the
            // collection. Adding this as an error to the feeds errors array.
            req.feedsErrors.push("No content provied in the request");
            next();
        }
    } else {
        // Adding this as an error to the feeds errors array.
        req.feedsErrors.push("Not enough parameters provided to create this content");

        // Since this is a significant issue, passing this request to the feeds-errors
        // route, by calling the next method with an empty error (as all errors will be
        // accessible from the feedsErrors array).
        next(new Error());
    }
});

// Exporting the router that was set up in this file, so that it can be included
// in the feeds.js route and specified as the route for all post requests to create
// elements in a project
module.exports = router;