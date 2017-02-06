// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

var validation = require("./../validation.js");

// Request to delete a project
router.delete("/:projectID", function(req, res, next){
    res.send("DELETE request received from userID=" + req.userID + " for projectID=" + req.params.project);
});

// Request to delete an item or collections CONTENT in a project
// Note project structure cannot be deleted
router.delete("/:projectID/*", function(req, res, next){
    // Checking that the request contains more than just the project ID
    if(req.allParams.length > 1){
        // Checking that the fileData (i.e. the current content of the project) has
        // been loaded in the preload-filedata route
        if(req.fileData.content){           
            // Calling the deleteItem method (which is defined directly below this)
            // to delete the requested item. Passing it the current content file data, and the
            // encapsulationData (i.e. all the parameters of the request, excluding the
            // projectID parameter - by slicing the array so it starts at index 1), 
            // The purpose of using a function, that will only ever be available within this 
            // middleware, is that I need the file data content to be passed by reference, 
            // as opposed to JavaScripts default "pass by value" approach. By passing 
            // this content to a function, any updates to its properties will be reflected 
            // in the object itself.
            deleteItem(req.fileData.content, req.allParams.slice(1));
            
            // Defining the deleteItem function, as described above
            function deleteItem(contentFileData, encapsulationData){
                // Determining the itemName and parentItem name, based on the last
                // two values of the encapsulationData data (parameters of the request URL).
                // Parent name may not always have a value, as the item may be at the top
                // level of the content object, so defaulting this to null if no value exits
                var itemName = encapsulationData[encapsulationData.length-1];
                var parentName = encapsulationData[encapsulationData.length-2] || null;

                // Creating an removedItemFrom property on the request object, to track if and
                // when an item is deleted within this function (so as to determine if the 
                // content file needs to be updated)
                req.removedItemFrom = null;

                // Looping through the encapsulationData array (i.e. parameters passed to the
                // request URL) to drill down into the fileData object, to find the property that
                // needs to have an item removed from it. 
                for(var i=0; i<encapsulationData.length; i++){
                    // Not including the last two indexes of the
                    // array, as these will be the parentName and itemName (as referenced above). By
                    // the end of this loop, I should have the item from which the item should
                    // be removed.
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
                }

                // Checking whether the fileData object contains the property referred to in the parent
                // name variable i.e. does the request new item have a parent, or is it at the top-most
                // level of the project_structure object
                if(contentFileData[parentName] != null){
                    // Determing what type of item we are trying to remove the item from i.e.
                    // an Array, Object or other.
                    switch(contentFileData[parentName].constructor.name.toLowerCase()){
                        case "array": {
                            // Checking if the array we are trying to remove this item from contains an index
                            // with the same value as the itemName
                            if(contentFileData[parentName][itemName] != undefined){
                                contentFileData[parentName].splice(itemName, 1);
                            } else {
                                // Since this index does not exist within this array, adding this to the feedsErrors
                                // array, and then returning this function so that no further attempt to create this
                                // item will be made. Since req.newItem will remain null, this error will be returned
                                // to the caller, further down along this route
                                req.feedsErrors.push(itemName + " does not exist within " + parentName + " and so cannot be removed");
                                return;
                            } 
                            break;                   
                        }
                        case "object": {
                            // Checking if the object we are trying to remove this item from contains a property
                            // with the same value as the itemName
                            if(contentFileData[parentName][itemName] != undefined){
                                delete contentFileData[parentName][itemName];
                            } else {
                                // Since this property does not exist within this object, adding this to the feedsErrors
                                // array, and then returning this function so that no further attempt to create this
                                // item will be made. Since req.newItem will remain null, this error will be returned
                                // to the caller, further down along this route
                                req.feedsErrors.push(itemName + " does not exist within " + parentName + " and so cannot be removed");
                                return;
                            }
                            break;
                        }
                        default: {
                            res.send("uh oh");
                        }
                    }

                    // If the function has reached this point, then an item must have been deleted (as
                    // if this proved not to be possible, then the function would have returned by now).
                    // Setting this removedItemFrom property of the request object to be an empty object. Then
                    // creating a new property on this object, using the name of the parent (as this 
                    // will be the item from which the item was removed). Setting the value of this
                    // new property to be equal to the parent item we just removed the item from i.e. so
                    // that it now contains all of it's existing properties/indexes, minus the item
                    // we removed. Doing this in two seperate steps, as the parentName is being generated
                    // dynamically, so req.newItem.parentName would not be sufficient.
                    req.removedItemFrom = {};
                    req.removedItemFrom[parentName] = contentFileData[parentName];
                } else {
                    // Since this item does not appear to have a parent, checking whether it exists
                    // at the top level of the file data project_structure i.e. is there a property by this 
                    // name already defined
                    if(contentFileData[itemName] != undefined){
                        delete contentFileData[itemName];
                    } else {
                        // Since this property does not exist on the global object, adding this to the feedsErrors
                        // array, and then returning this function so that no further attempt to create this
                        // item will be made. Since req.newItem will remain null, this error will be returned
                        // to the caller, further down along this route
                        req.feedsErrors.push(itemName + " does not exist and so cannot be removed");
                        return;
                    }

                    // If the function has reached this point, then an item must have been deleted (as
                    // if this proved not to be possible, then the function would have returned by now).
                    // Setting this removedItemFrom property of the request object to be equal to the content
                    // file data that we just removed the item from.
                    req.removedItemFrom = contentFileData;
                }
            }
            
            // Checking if the removedItemFrom property on the request object is still null
            // i.e. has an item been removed? If not, then there will be no need to
            // update the project content file.
            if(req.removedItemFrom != null){
                console.log("Item deleted from project content");
                req.gitCommitMessage = itemName + " removed from project content";
                req.updateFile = "content";
                req.resultData = req.removedItemFrom;
                next();
            } else {
                // Returning any errors set in the createItem() function to the caller
                return next(new Error());
            }
        } else {
            // Adding this as an error to the feeds errors array.
            req.feedsErrors.push("This user does not have permission to delete this item");

            // Since this is a significant issue, passing this request to the feeds-errors
            // route, by calling the next method with an empty error (as all errors will be
            // accessible from the feedsErrors array).
            return next(new Error());
        }   

    } else {
        // Adding this as an error to the feeds errors array.
        req.feedsErrors.push("Not enough parameters provided to delete this content");

        // Since this is a significant issue, passing this request to the feeds-errors
        // route, by calling the next method with an empty error (as all errors will be
        // accessible from the feedsErrors array).
        next(new Error());
    }
});

// Exporting the router that was set up in this file, so that it can be included
// in the feeds.js route and specified as the route for all delete requests to delete
// elements from a project
module.exports = router;