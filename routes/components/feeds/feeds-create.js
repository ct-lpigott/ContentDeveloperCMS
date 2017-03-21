// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

var accessLevels = require("../../../custom_modules/access_levels");
var validation = require("../../../custom_modules/validation");

/**
 * @apiVersion 1.0.0
 * @api {post} /feeds/:projectID/:itemPath Create a new item structure
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} :itemPath Encapsulation path to item within the project
 * @apiParam {json} structure JSON to be added to to the projects structure
 * @apiName Create New Item Structure
 * @apiGroup Project Structure
 */
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
                                    var structureValidation = validation.validateNewStructure(itemName, newItem);
                                    if(structureValidation.allowed){
                                        structureFileData[parentName]["attributes"][itemName] = structureValidation.sanitisedStructure;
                                        req.gitCommitMessage = "New attribute structure added to " + parentName + ": '" + itemName + "'";
                                    }
                                    for(var i=0; i<structureValidation.errors.length; i++){
                                        req.feedsErrors.push(structureValidation.errors[i]);
                                    }
                                }
                            } else if(structureFileData[parentName]["items"] != undefined){
                                // Checking if this item name is already a property on the parent items object
                                if(structureFileData[parentName]["items"][itemName] != undefined){
                                    // Since this items parent items already contain a property by this name, cannot create this
                                    // item. Adding this to the feedsErrors array, and then returning this function so that no further 
                                    // attempt to create this item will be made. Since req.newItem will remain null, this error will 
                                    // be returned to the caller, further down along this route
                                    req.feedsErrors.push(itemName + " already exists in " + parentName + ".");
                                    return;
                                } else {
                                    // Adding this as a new property on the parents items object
                                    var structureValidation = validation.validateNewStructure(itemName, newItem);
                                    if(structureValidation.allowed){
                                        structureFileData[parentName]["items"][itemName] = structureValidation.sanitisedStructure;
                                        req.gitCommitMessage = "New item structure added to " + parentName + ": '" + itemName + "'";
                                    }
                                    for(var i=0; i<structureValidation.errors.length; i++){
                                        req.feedsErrors.push(structureValidation.errors[i]);
                                    }
                                }
                            } else {
                                // Checking if this item name is already a property on the parent object
                                if(structureFileData[parentName][itemName] != undefined){
                                    // Since this items parent already contain a property by this name, cannot create this
                                    // item. Adding this to the feedsErrors array, and then returning this function so that no further 
                                    // attempt to create this item will be made. Since req.newItem will remain null, this error will 
                                    // be returned to the caller, further down along this route
                                    req.feedsErrors.push(itemName + " already exists in " + parentName + ".");
                                    return;
                                } else {
                                    // Adding this as a new property on the parents object
                                    var structureValidation = validation.validateNewStructure(itemName, newItem);
                                    if(structureValidation.allowed){
                                        structureFileData[parentName][itemName] = structureValidation.sanitisedStructure;
                                        req.gitCommitMessage = "New structure added to " + parentName + ": '" + itemName + "'";
                                    }
                                    for(var i=0; i<structureValidation.errors.length; i++){
                                        req.feedsErrors.push(structureValidation.errors[i]);
                                    }
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
                                    req.feedsErrors.push(itemName + " already exists.");
                                    return;
                                } else {
                                    // Adding this as a new property on the global attributes object
                                    var structureValidation = validation.validateNewStructure(itemName, newItem);
                                    if(structureValidation.allowed){
                                        structureFileData["attributes"][itemName] = structureValidation.sanitisedStructure;
                                        req.gitCommitMessage = parentName != null ? "New structure attribute added to " + parentName + ": " + itemName : "New structure attribute added to global object: '" + itemName + "'";
                                    }
                                    for(var i=0; i<structureValidation.errors.length; i++){
                                        req.feedsErrors.push(structureValidation.errors[i]);
                                    }
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
                                    req.feedsErrors.push(itemName + " already exists.");
                                    return;
                                } else {
                                    // Adding this as a new property on the global items object
                                    var structureValidation = validation.validateNewStructure(itemName, newItem, req.feedsErrors);
                                    if(structureValidation.allowed){
                                        structureFileData["items"][itemName] = structureValidation.sanitisedStructure;
                                        req.gitCommitMessage = parentName != null ? "New structure item added to " + parentName + ": " + itemName :"New structure item added to global object: '" + itemName + "'";
                                    }
                                    for(var i=0; i<structureValidation.errors.length; i++){
                                        req.feedsErrors.push(structureValidation.errors[i]);
                                    }
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
                                    var structureValidation = validation.validateNewStructure(itemName, newItem);
                                    if(structureValidation.allowed){
                                        structureFileData[itemName] = structureValidation.sanitisedStructure;
                                        req.gitCommitMessage = parentName != null ? "New structure added to " + parentName + ": " + itemName : "New structure added to global object: '" + itemName + "'";
                                    }
                                    for(var i=0; i<structureValidation.errors.length; i++){
                                        req.feedsErrors.push(structureValidation.errors[i]);
                                    }
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

/**
 * @apiVersion 1.0.0
 * @api {post} /feeds/:projectID/:itemPath Create a new content item
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} :itemPath Encapsulation path to item within the project
 * @apiParam {any} content Content to be added to the project (datatype depends on project structure)
 * @apiName Create New Item Content
 * @apiGroup Project Content
 */
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
                            // Not including the last two indexes of the
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
                                // Not including the last two indexes of the
                                // array, as these will be the parentName and itemName (as referenced above). By
                                // the end of this loop, I should have the item into which the new item should
                                // be created.
                                if(i < encapsulationData.length - 2 && structureFileData[encapsulationData[i]] != undefined){
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

                        // Checking if a parent was specified in the request
                        if(parentName != null){
                            // Checking if a structure is defined for the parent
                            if(structureFileData[parentName] != null){
                                // Checking if content already exists for the parent
                                if(contentFileData[parentName] != null){
                                    // Checking if the parent is defined to contain items i.e. is it an
                                    // array or an object
                                    switch(structureFileData[parentName]["type"]){
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
                                                var contentValidation = validation.validateNewContent(newItem, structureFileData[parentName]["items"]);   
                                                // Looping through any errors that were returned from the content validation,
                                                // and adding them to the req.feedsErrors array
                                                for(var i=0; i<contentValidation.errors.length; i++){
                                                    req.feedsErrors.push(contentValidation.errors[i]);
                                                }
                                                if(contentValidation.allowed){
                                                    // Since this is an array, pushing the new item into the parent
                                                    // Note that even if the user has specified an index position to insert
                                                    // this item at, this will be ignored as the item can only ever be created
                                                    // at the end of an array (PUT requests are used to update exisiting items)
                                                    contentFileData[parentName].push(contentValidation.sanitisedContent);
                                                    req.gitCommitMessage = "New content pushed to array: '" + parentName + "'";
                                                } else {
                                                    // Returning the function, as this content cannot be added to the project 
                                                    // as it does not match with the project structure (details of which will 
                                                    // inclued in the errors)
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
                                                var contentValidation = validation.validateNewContent(newItem, structureFileData[parentName]["items"][itemName]);   
                                                // Looping through any errors that were returned from the content validation,
                                                // and adding them to the req.feedsErrors array
                                                for(var i=0; i<contentValidation.errors.length; i++){
                                                    req.feedsErrors.push(contentValidation.errors[i]);
                                                }
                                                if(contentValidation.allowed){
                                                    // Since this is an object, creating a new property on the parent item (with the item name
                                                    // supplied in the parameters), and setting its value to the new item value 
                                                    contentFileData[parentName][itemName] = contentValidation.sanitisedContent;
                                                    req.gitCommitMessage = "New content created in object:  '" + parentName + "." + itemName;
                                                } else {
                                                    // Returning the function, as this content cannot be added to the project 
                                                    // as it does not match with the project structure (details of which will 
                                                    // inclued in the errors)
                                                    return;
                                                }
                                            }
                                            break;
                                        }
                                        default: {
                                            req.feedsErrors.push(parentName + " is not defined to contain items.");
                                            return;
                                            break;
                                        }
                                    }
                                } else {
                                    req.feedsErrors.push(parentName + " does not exist. Please create the parent first.");
                                    return;
                                }
                            } else {
                                req.feedsErrors.push(parentName + " does not have a structure defined, so " + itemName + " cannot be added to it.");
                                return;
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
                            if(structureFileData[itemName] != null){
                                if(contentFileData[itemName] != null){
                                    // Since this property is already defined, checking whether it is an item
                                    // that can have other items added to it i.e. an Array or an Object.
                                    // Determing what type of item we are trying to insert the new item into i.e.
                                    // an Array, Object or other. Items can only ever be inserted to arrays or objects,
                                    // and so if the result is other, an error will be thrown i.e. you cannot insert
                                    // an object into a string
                                    switch(structureFileData[itemName]["type"].toLowerCase()){
                                        case "array": {
                                            var contentValidation = validation.validateNewContent(newItem, structureFileData[itemName]["items"]);   
                                            // Looping through any errors that were returned from the content validation,
                                            // and adding them to the req.feedsErrors array
                                            for(var i=0; i<contentValidation.errors.length; i++){
                                                req.feedsErrors.push(contentValidation.errors[i]);
                                            }
                                            if(contentValidation.allowed){
                                                // Since this is any array, pushing to the new item into it
                                                contentFileData[itemName].push(contentValidation.sanitisedContent); 
                                                req.gitCommitMessage = "New content added to array: " + itemName;
                                            } else {
                                                // Returning the function, as this content cannot be added to the project 
                                                // as it does not match with the project structure (details of which will 
                                                // inclued in the errors)
                                                return;
                                            }
                                            break;                   
                                        }
                                        default: {
                                            // Since this item is not an Array it is just an object or a
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
                                    var contentValidation = validation.validateNewContent(newItem, structureFileData[itemName]);   
                                    // Looping through any errors that were returned from the content validation,
                                    // and adding them to the req.feedsErrors array
                                    for(var i=0; i<contentValidation.errors.length; i++){
                                        req.feedsErrors.push(contentValidation.errors[i]);
                                    }
                                    if(contentValidation.allowed){
                                        // Since this is a new collection (top level property) on the file data object, 
                                        // creating a new property (with the item name supplied in the parameters), 
                                        // and setting its value to the new item value 
                                        contentFileData[itemName] = contentValidation.sanitisedContent;
                                        req.gitCommitMessage = "New content created: '" + itemName + "'";
                                    } else {
                                        // Returning the function, as this content cannot be added to the project 
                                        // as it does not match with the project structure (details of which will 
                                        // inclued in the errors)
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
                            } else {
                                req.feedsErrors.push(itemName + " does not have a structure defined.");
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
            if(req.body.structure == null){
                // As no content has been included in the request, unable to update the
                // collection. Adding this as an error to the feeds errors array.
                req.feedsErrors.push("No content provied in the request");
            } else {
                next();
            }
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