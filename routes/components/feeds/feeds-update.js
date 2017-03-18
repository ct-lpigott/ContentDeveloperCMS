// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

var validation = require("../../../custom_modules/validation");

/**
 * @api {put} /feeds/:projectID Update entire project structure
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {json} structure JSON to update the projects structure
 * @apiName UpdateProjectStructure
 * @apiGroup ProjectStructure
 */
router.put("/:projectID", function(req, res, next){
    // Determining the level of access this user has to this project
    switch(req.user_access_level){
        case 1: {
            if(req.body.structure != null){
                // Transforming the project structure within the request body to lowercase,
                // as the project structure should not contain uppercase characters
                if(typeof req.body.structure != "string"){
                    if(validation.objectToJson(req.body.structure)){
                        req.body.structure = JSON.stringify(req.body.structure);
                    } else {
                        next(new Error("Invalid structure"));
                    }
                }
                req.body.structure = req.body.structure.toLowerCase();                   

                if(validation.jsonToObject(req.body.structure)){
                    // Setting the project_structure to the structure passed to the 
                    // request body
                    req.fileData.admin.project_structure = JSON.parse(req.body.structure);

                    console.log("Entire contents of project structure updated");
                    if(req.body.short_commit_id != null){
                        req.gitCommitMessage = "Project structure rolled back to commit id: " + req.body.short_commit_id;
                    } else if(req.body.commit_message != null){
                        req.gitCommitMessage = req.body.commit_message;
                    } else {
                        req.gitCommitMessage = "Update to entire structure of project";
                    }
                    req.updateFile = "structure";
                    next();
                } else {
                    // This is not a valid JSON object. Adding this as an 
                    // error to the feedsErrors array.
                    req.feedsErrors.push("This is not valid JSON. Cannot update the project structure");

                    // Since this is a significant issue, passing this request to the feeds-errors
                    // route, by calling the next method with an empty error (as all errors will be
                    // accessible from the feedsErrors array).
                    next(new Error());
                }

                
            } else if(req.body.content != null){
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
            if(req.body.content != null){
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

/**
 * @api {put} /feeds/:projectID Update entire project content
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {any} content Content to be added to the project (datatype depends on project structure)
 * @apiName UpdateProjectContent
 * @apiGroup ProjectContent
 */
router.put("/:projectID", function(req, res, next){
    if(req.body.content != null){
        if(typeof req.body.content != "string"){
            req.body.content = JSON.stringify(req.body.content);
        }
        if(validation.jsonToObject(req.body.content)){
            req.fileData.content = JSON.parse(req.body.content);
            console.log("Entire contents of project content updated");
            if(req.body.short_commit_id != null){
                req.gitCommitMessage = "Project content rolled back to commit id: " + req.body.short_commit_id;
            } else if(req.body.commit_message != null){
                req.gitCommitMessage = req.body.commit_message;
            } else {
                req.gitCommitMessage = "Update to entire contents of project";
            }
            req.updateFile = "content";
            next();
        } else {
            // This is not a valid JSON object. Adding this as an 
            // error to the feedsErrors array.
            req.feedsErrors.push("This is not valid JSON. Cannot update the project content");

            // Since this is a significant issue, passing this request to the feeds-errors
            // route, by calling the next method with an empty error (as all errors will be
            // accessible from the feedsErrors array).
            next(new Error());
        }
    } else {
        next();
    }
});

/**
 * @api {put} /feeds/:projectID/:itemPath Update encapsulated project content
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} :itemPath Encapsulation path to item within the project
 * @apiParam {any} content Content to be added to the project (datatype depends on project structure)
 * @apiName UpdateEncapsulatedContent
 * @apiGroup ProjectContent
 */
router.put("/:projectID/*", function(req, res, next){
    if(req.fileData.content == null){
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
                            var arrayIndex = null;

                            // Creating an updatedItem property on the request object, to track if and
                            // when an item is updated within this funciton (so as to determine if the 
                            // content file needs to be updated)
                            req.updatedItem = null;

                            // Looping through the encapsulationData array (i.e. parameters passed to the
                            // request URL) to drill down into the fileData object, to find the property that
                            // needs to have an item updated within it. 
                            for(var i=0; i<encapsulationData.length; i++){

                                

                                // Not including the last two indexes of the
                                // array, as these will be the parentName and itemName (as referenced above). By
                                // the end of this loop, I should have the parent which contains the item that
                                // should be updated.
                                if((isNaN(parentName) && i < encapsulationData.length -2) || (isNaN(parentName) == false && i < encapsulationData.length -3)){
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

                                // Checking if the next item in the encapsulatedData array in not a number, as
                                // I am ignoring index values for now, as these will not exist within the project 
                                // structure
                                if(isNaN(encapsulationData[i])){
                                    // Checking that the next level of encapsulation data exists within the current
                                    // level of the structure
                                    if((isNaN(parentName) && i < encapsulationData.length -2) || (isNaN(parentName) == false && i < encapsulationData.length -3)){
                                        if(structureFileData[encapsulationData[i]] != undefined){
                                            // Setting the structureFileData equal to the next level of the encapsulationData array
                                            // i.e. to keep drilling down into the structureFileData object
                                            structureFileData = structureFileData[encapsulationData[i]];
                                        }
                                    }                           
                                } else {
                                    if(parentName == encapsulationData[i]){
                                        parentName = encapsulationData[i-1];
                                        arrayIndex = encapsulationData[i];
                                    }
                                    // Since the next item in the encapsulatedData array is a number, then checking
                                    // to see if the current level of the structureFileData is set up to contain 
                                    // items
                                    if(structureFileData[parentName].items == undefined){
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

                            // Checking if a parent was specified in the request
                            if(parentName != null){
                                // Checking if a structure is defined for the parent
                                if(structureFileData[parentName] != null){
                                    // Checking if content already exists for the parent
                                    if(contentFileData[parentName] != null){
                                        // Determing what type of parent we are trying to update the item in i.e.
                                        // an Array, Object or other. Items can only ever be inserted to arrays or objects,
                                        // and so if the result is other, an error will be thrown i.e. you cannot insert
                                        // an object into a string, and so it cannot be possible to update an object
                                        // within one either
                                        switch(structureFileData[parentName]["type"]){
                                            case "array": case "object": {
                                                // Checking if the parent object/array we are trying to update already 
                                                // contains a property/index with the same value as the itemName
                                                if(contentFileData[parentName][itemName] != undefined || (arrayIndex != null && contentFileData[parentName][arrayIndex][itemName] != undefined)){
                                                    var validateWith = structureFileData[parentName]["items"][itemName] || structureFileData[parentName]["items"];
                                                    var validateContent = validation.contentStructure(updatedItemContent, validateWith);   
                                                    if(validateContent.successful){
                                                        req.gitCommitMessage = "Update to content of " + parentName + ": " + itemName;
                                                        if(arrayIndex != null){
                                                            contentFileData = contentFileData[parentName];
                                                            parentName = arrayIndex;
                                                        }
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
                                    } else {
                                        // Since the parent does not yet exist, the content within it cannot be updated, adding this to the 
                                        // feedsErrors array, and then returning this function so that no further attempt to update 
                                        // this item will be made. Since req.updatedItem will remain null, this error will be returned
                                        // to the caller, further down along this route
                                        req.feedsErrors.push(parentName + " does not exist. Use a POST request to create it.");
                                        return;
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
                                    
                                }
                            } else {
                                if(structureFileData[itemName] != null){
                                    if(contentFileData[itemName] != null){
                                        var validateContent = validation.contentStructure(updatedItemContent, structureFileData[itemName]);   
                                        if(validateContent.successful){
                                            // Updating the value of this top level item to the updated item value
                                            contentFileData[itemName] = updatedItemContent; 
                                            req.gitCommitMessage = "Update to content: " + itemName;
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
                                console.log("Project contents updated");
                                req.updateFile = "content";
                                req.resultData = req.updatedItem;
                                next();
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
    } else {
        next();
    }
});

// Exporting the router that was set up in this file, so that it can be included
// in the feeds.js route and specified as the route for all put requests to update
// elements in a project
module.exports = router;