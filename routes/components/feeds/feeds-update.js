// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Requiring the file system module, so that this route can have access
// to the file system of the server i.e. to be able to create, open, edit 
// and save project files to the /projects directory
var fs = require("fs");

var validation = require("./../validation.js");

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

// Request to update an item or collections CONTENT in a project
router.put("/:projectID/*", function(req, res, next){
    // Checking that the request contains more than just the project ID
    if(req.allParams.length > 1){

        // Checking that the body of the request contains content i.e. the content
        // of the item we are about to update
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

                    // Calling the updateItem method (which is defined directly below this)
                    // to update this item. Passing it the current content file data, the
                    // encapsulationData (i.e. all the parameters of the request, excluding the
                    // projectID parameter - by slicing the array so it starts at index 1), as
                    // well as the content required for the item update. The purpose of using a 
                    // function, that will only ever be available within this middleware, is that
                    // I need the file data content to be passed by reference, as opposed to JavaScripts
                    // default "pass by value" approach. By passing this content to a function, any 
                    // updates to its properties will be reflected in the object itself.
                    updateItem(req.fileData.content, req.fileData.admin.project_structure, req.allParams.slice(1), req.body.content);
                    
                    // Defining the updateItem funciton, as described above
                    function updateItem(contentFileData, structureFileData, encapsulationData, updatedItemContent){

                        // Determining the itemName and parentItem name, based on the last
                        // two values of the encapsulationData data (parameters of the request URL).
                        // Parent name may not always have a value, as the item may be at the top
                        // level of the content object, so defaulting this to null if no value exits
                        var itemName = encapsulationData[encapsulationData.length-1];
                        var parentName = encapsulationData[encapsulationData.length-2] || null;

                        // Creating an updatedItem property on the request object, to track if and
                        // when an item is updated within this funciton (so as to determine if the 
                        // content file needs to be updated)
                        req.updatedItem = null;

                        // Looping through the encapsulationData array (i.e. parameters passed to the
                        // request URL) to drill down into the fileData object, to find the property that
                        // needs to have an item updated within it. 
                        for(var i=0; i<encapsulationData.length; i++){

                            // CONTENT
                            // Not including the last two indexes of the
                            // array, as these will be the parentName and itemName (as referenced above). By
                            // the end of this loop, I should have the parent which contains the item that
                            // should be updated.
                            if(i < encapsulationData.length - 2){
                                // Checking that the next level of encapsulation data exists within the current
                                // level of the content
                                if(contentFileData[encapsulationData[i]] != null){
                                    // Setting the contentFileData equal to the next level of the encapsulationData array
                                    // i.e. to keep drilling down into the contentFileData object
                                    contentFileData = contentFileData[encapsulationData[i]];
                                } else {
                                    // Since it does not seem possible to drill down into the current content
                                    // file data using the encapsulationData provided in the URL parameters,
                                    // adding this as an error to the feedsErrors array, including the encapsulationData
                                    // as a string seperated by "/". Adding this as an error to the req.feedsErrors 
                                    // array, before returning this function so that no further attempt to update this 
                                    // item will be made. Since req.updatedItem will remain null, this error will 
                                    // be returned to the caller, further down along this route
                                    req.feedsErrors.push("'" + encapsulationData.join("/") + "' does not exist, so this content cannot be updated.");
                                    return;
                                }
                            }

                            // STRUCTURE
                            // Checking if the next item in the encapsulatedData array in not a number, as
                            // I am ignoring index values for now, as these will not exist within the project 
                            // structure
                            if(isNaN(encapsulationData[i])){
                                // Checking that the next level of encapsulation data exists within the current
                                // level of the structure
                                if(structureFileData[encapsulationData[i]] != undefined){
                                    // Setting the structureFileData equal to the next level of the encapsulationData array
                                    // i.e. to keep drilling down into the structureFileData object
                                    structureFileData = structureFileData[encapsulationData[i]];
                                }                                

                                // Checking if the structureFileData object currently contains an attributes
                                // property, in which case we will step down another level (as the user will never
                                // be required to specifically request the attributes property)
                                if(structureFileData.attributes != undefined){
                                    // Setting the structureFileData equal to the attributes property of its current value
                                    // i.e. to keep drilling down into the structureFileData object
                                    structureFileData = structureFileData.attributes;
                                }                              
                            } else {
                                // Since the next item in the encapsulatedData array is a number, then checking
                                // to see if the current level of the structureFileData is set up to contain 
                                // items
                                if(structureFileData.items != undefined){
                                    // Setting the structureFileData equal to the items property of its current value
                                    // i.e. to keep drilling down into the structureFileData object
                                    structureFileData = structureFileData.items;
                                } else {
                                    // Since the next item in the encapsulatedData array was a number, but the project
                                    // structure at this point does not contain an items property, then this object
                                    // is not structured to accept items. Adding this as an error to the req.feedsErrors 
                                    // array, before returning this function so that no further attempt to update this 
                                    // item will be made. Since req.updatedItem will remain null, this error will 
                                    // be returned to the caller, further down along this route
                                    req.feedsErrors.push(encapsulationData[i] + " is not defined to contain items. Please update this items structure first.");
                                    return;
                                }
                            }
                        }


                        // Checking that there is structure provided for this item
                        if(structureFileData != null){
                            
                            // Checking whether the fileData object contains the property referred to in the parent
                            // name variable i.e. does the request new item have a parent, or is it at the top-most
                            // level of the project_structure object
                            if(contentFileData[parentName] != null){

                                // Determing what type of parent we are trying to update the item in i.e.
                                // an Array, Object or other. Items can only ever be inserted to arrays or objects,
                                // and so if the result is other, an error will be thrown i.e. you cannot insert
                                // an object into a string, and so it cannot be possible to update an object
                                // within one either
                                switch(contentFileData[parentName].constructor.name.toLowerCase()){

                                    case "array": case "object": {
                                        // Checking if the parent object/array we are trying to update already 
                                        // contains a property/index with the same value as the itemName
                                        if(contentFileData[parentName][itemName] != undefined){

                                            // PLACEHOLDER - For validating content against structure
                                            var validateContent = validation.contentStructure(updatedItemContent, structureFileData);   
                                            if(validateContent.successful){
                                                // Since this is an object/array, updating the property/index on the parent 
                                                // item (with the item name supplied in the parameters), and setting its 
                                                // value to the updated item value 
                                                contentFileData[parentName][itemName] = updatedItemContent;
                                            } else {
                                                // Looping through any errors that were returned from the content validation,
                                                // and adding them to the req.feedsErrors array, before returning the function,
                                                // as this content cannot be updated in the project as it does not match with the
                                                // project structure (details of which will be inclued in the errors)
                                                for(var i=0; i<validateContent.errors.length; i++){
                                                    req.feedsErrors.push(validateContent.errors[i]);
                                                }
                                                return;
                                            }
                                        } else {
                                            // Since this property/index does not currently exist within this object/array, adding this to the 
                                            // feedsErrors array, and then returning this function so that no further attempt to update 
                                            // this item will be made. Since req.updatedItem will remain null, this error will be returned
                                            // to the caller, further down along this route
                                            req.feedsErrors.push(itemName + " does not exist in " + parentName + ". Use a POST request to create it.");
                                            return;
                                        }
                                        break;
                                    }
                                    default: {
                                        // Since this items parent is neither an Array or an Object, this item cannot be updated inside 
                                        // it. Adding this to the feedsErrors array, and then returning this function so that no further 
                                        // attempt to create this item will be made. Since req.updatedItem will remain null, this error will 
                                        // be returned to the caller, further down along this route
                                        req.feedsErrors.push(parentName + " cannot not contain items, such as " + itemName);
                                        return;
                                        break;
                                    }
                                }

                                // If the function has reached this point, then an item must have been updated (as
                                // if this proved not to be possible, then the function would have returned by now).
                                // Setting this updatedItem property of the request object to be an empty object. Then
                                // creating a new property on this object, using the name of the parent (as this 
                                // will be the object in which the item was updated). Setting the value of this
                                // new property to be equal to the parent item we just updated the item in i.e. so
                                // that it now contains all of it's existing properties/indexes, plus the item
                                // we updated. Doing this in two seperate steps, as the parentName is being generated
                                // dynamically, so req.updatedItem.parentName would not be sufficient.
                                req.updatedItem = {};
                                req.updatedItem[parentName] = contentFileData[parentName];
                            } else {
                                // Since this item does not appear to have a parent, checking whether it exists
                                // at the top level of the file data project_structure i.e. is there a property by this 
                                // name already defined
                                if(contentFileData[itemName] != undefined){

                                    // PLACEHOLDER - For validating content against structure
                                    var validateContent = validation.contentStructure(updatedItemContent, structureFileData);   
                                    if(validateContent.successful){
                                        // Updating the value of this top level item to the updated item value
                                        contentFileData[itemName] = updatedItemContent; 
                                    } else {
                                        // Looping through any errors that were returned from the content validation,
                                        // and adding them to the req.feedsErrors array, before returning the function,
                                        // as this content cannot be updated as it does not match with the
                                        // project structure (details of which will be inclued in the errors)
                                        for(var i=0; i<validateContent.errors.length; i++){
                                            req.feedsErrors.push(validateContent.errors[i]);
                                        }
                                        return;
                                    }
                                } else {
                                    // Since this item does not exist within a parent, or the global object, it cannot be
                                    // updated. Adding this to the feedsErrors array, and then returning this function so that no further 
                                    // attempt to create this item will be made. Since req.updatedItem will remain null, this error will 
                                    // be returned to the caller, further down along this route
                                    req.feedsErrors.push(itemName + " does not exist. Please use a POST request to create it.");
                                    return;
                                }

                                // If the function has reached this point, then an item must have been updated (as
                                // if this proved not to be possible, then the function would have returned by now).
                                // Setting this updatedItem property of the request object to be an empty object. Then
                                // creating a new property on this object, using the name of the updated item. Setting 
                                // the value of this new property to be equal to the item we just updated i.e. so
                                // that it now contains the updated content. Doing this in two seperate steps, as the 
                                // itemName is being generated dynamically, so req.updatedItem.itemName would not 
                                // be sufficient.
                                req.updatedItem = {};
                                req.updatedItem[itemName] = contentFileData[itemName];
                            }
                        } else {
                            // Since there is no structure available for this item, it will not be possible to update
                            // it. Determing the error to return based on whether a parent name was present
                            if(parentName != null){
                                // Adding this to the feedsErrors array, and then returning this function so
                                // that no further attempt to update this item will be made. Since req.updatedItem
                                // will remain null, this error will be returned to the caller, further down 
                                // along this route
                                req.feedsErrors.push("There is no structure defined for " + itemName + " within " + parentItem + " , so this content cannot be updated.");
                                return;
                            } else {
                                // Adding this to the feedsErrors array, and then returning this function so
                                // that no further attempt to update this item will be made. Since req.updatedItem
                                // will remain null, this error will be returned to the caller, further down 
                                // along this route
                                req.feedsErrors.push("There is no structure defined for " + itemName + ", so this content cannot be updated.");
                                return;
                            }
                        }
                    }
                    
                    // Checking if the updatedItem property on the request object is still null
                    // i.e. has an item been updated? If not, then there will be no need to
                    // update the project content file.
                    if(req.updatedItem != null){

                        // Checking that the fileData content is still a valid object, by attempting
                        // to parse it to JSON. Since the item that was updated will have been reflected
                        // in this object (as it was passed by reference to a function) completing this recheck
                        // to ensure that updating the new item did not corrupt the existing content
                        if(validation.objectToJson(req.fileData.content)){

                            // Updating this project's content.json file, passing the JSON stringified version
                            // of the fileData content object as the contents
                            fs.writeFile("./projects/" + req.params.projectID + "/content.json", JSON.stringify(req.fileData.content), function(err){
                                if(err) {
                                    // Logging the error to the console
                                    console.log("Error updating project content file " + err);

                                    // As it has not been possible to update the content.json file for this 
                                    // project, adding this as an error to the feedsErrors array.
                                    req.feedsErrors.push("Server error - unable to update item");

                                    // Since this is a significant issue, passing this request to the feeds-errors
                                    // route, by calling the next method with an empty error (as all errors will be
                                    // accessible from the feedsErrors array).
                                    return next(new Error());
                                } else {
                                    console.log("Item was updated in the project");

                                    res.send(req.updatedItem);
                                }
                            });
                        } else {
                            // As it has not been possible parse the updated object to JSON, the content
                            // cannot be updated. Adding this as an error to the feeds errors array.
                            req.feedsErrors.push("The content included is not valid JSON. Cannot update item");

                            // Since this is a significant issue, passing this request to the feeds-errors
                            // route, by calling the next method with an empty error (as all errors will be
                            // accessible from the feedsErrors array).
                            return next(new Error());
                        }
                    } else {
                        // Returning any errors set in the createItem() function to the caller
                        return next(new Error());
                    }
                    
                } else {
                    // As it has not been possible parse the updated object to JSON, the content
                    // cannot be updated. Adding this as an error to the feeds errors array.
                    req.feedsErrors.push("The content included is not valid JSON. Cannot update item");

                    // Since this is a significant issue, passing this request to the feeds-errors
                    // route, by calling the next method with an empty error (as all errors will be
                    // accessible from the feedsErrors array).
                    return next(new Error());
                }
            } else {
                // Adding this as an error to the feeds errors array.
                req.feedsErrors.push("This user does not have permission to update this project");

                // Since this is a significant issue, passing this request to the feeds-errors
                // route, by calling the next method with an empty error (as all errors will be
                // accessible from the feedsErrors array).
                return next(new Error());
            }   
        } else {
            // As no content has been included in the request, unable to update the
            // collection. Adding this as an error to the feeds errors array.
            req.feedsErrors.push("No content provied in the request");

            // Since this is a significant issue, passing this request to the feeds-errors
            // route, by calling the next method with an empty error (as all errors will be
            // accessible from the feedsErrors array).
            next(new Error());
        }
    } else {
        // Adding this as an error to the feeds errors array.
        req.feedsErrors.push("Not enough parameters provided to update this content");

        // Since this is a significant issue, passing this request to the feeds-errors
        // route, by calling the next method with an empty error (as all errors will be
        // accessible from the feedsErrors array).
        next(new Error());
    }
});

// Exporting the router that was set up in this file, so that it can be included
// in the feeds.js route and specified as the route for all put requests to update
// elements in a project
module.exports = router;