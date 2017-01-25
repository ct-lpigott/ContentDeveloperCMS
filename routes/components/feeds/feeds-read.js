// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

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

// Exporting the router that was set up in this file, so that it can be included
// in the feeds.js route and specified as the route for all get requests to read
// elements from a project
module.exports = router;