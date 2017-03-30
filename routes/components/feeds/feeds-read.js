// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Including the gitRep module, which handles all request to initialise, 
// commit and log from a projects git repo
var gitRepo = require("../../../custom_modules/git_repo");

/**
 * @apiVersion 1.0.0
 * @api {get} /feeds/:projectID?include=structure,content,history Get entire project structure
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string="structure", "content", "history"}  [include] To include the structure, content and commit history of the project
 * @apiName Get Project Structure
 * @apiGroup Project Structure
 */
/**
 * @apiVersion 1.0.0
 * @api {get} /feeds/:projectID Get entire project content
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string="structure", "content", "history"}  [include] To include the structure, content and commit history of the project
 * @apiName Get Project Content
 * @apiGroup Project Content
 */
/**
 * @apiVersion 1.0.0
 * @api {get} /feeds/:projectID?include=history Get commit history of project
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string="structure", "content", "history"}  [include] To include the structure, content and commit history of the project
 * @apiName Get Project Commit History
 * @apiGroup Project History
 */
router.get("/:projectID", function(req, res, next){
    if(req.fileData.admin != null){
        // Checking if the user only wants some pieces of data include in the response
        if(req.query.include != null){
            if(req.query.include.indexOf("structure") > -1){
                // Adding the value of the project structure property of the project admin file, 
                // as the structure property on the responseObject.
                req.responseObject.structure = req.fileData.admin.project_structure;
            }
            if(req.query.include.indexOf("content") > -1){
                // Adding the content of the project (as returned from the content.json file) as 
                // a property on the response object, as the response will contain both the content
                // and the structure
                req.responseObject.content = req.fileData.content;
            }
            if(req.query.include.indexOf("history") > -1){
                // Getting the history of this projects content
                gitRepo.logFromRepo(req.params.projectID, "content", function(err, contentGitLog){
                    if(contentGitLog != null){
                        req.responseObject.content_history = contentGitLog;
                    }
                    
                    // Getting the history of this projects structure
                    gitRepo.logFromRepo(req.params.projectID, "structure", function(err, structureGitLog){
                        if(structureGitLog != null){
                            req.responseObject.structure_history = structureGitLog;
                        }
                        // Returning the response object to the caller, which should now contain
                        // the project structure, content and commit history for each of these seperatley
                        res.send(req.responseObject);
                    });
                });
            } else {
                res.send(req.responseObject);
            }
        } else {
            // Adding the content of the project (as returned from the content.json file) as 
            // a property on the response object, as the response will contain both the content
            // and the structure
            req.responseObject.content = req.fileData.content;
            res.send(req.responseObject);
        }        
    } else {
        // If this project has maximum cache age, including this as a header
        // on the response
        if(req.max_cache_age != null && req.max_cache_age > 0){
            res.setHeader("Cache-control", "public; max-age=" + req.max_cache_age);
        } else {
            res.setHeader("Cache-control", "no-cache");
        }

        // Setting the content of the project (as stored on the request object) as 
        // the response object, as no structure will be returned alongside the content
        req.responseObject = req.fileData.content;

        // Returning the response object to the caller, containing just the content for the project
        res.send(req.responseObject);
    }
});

/**
 * @apiVersion 1.0.0
 * @api {get} /feeds/:projectID/:itemPath?include=structure Get an items structure
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} :itemPath Encapsulation path to item within the project
 * @apiParam {string="structure", "content"} [include] To include the structure and content of the item
 * @apiName Get Item Structure
 * @apiGroup Project Structure
 */
/**
 * @apiVersion 1.0.0
 * @api {get} /feeds/:projectID/:itemPath Get an items content
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} :itemPath Encapsulation path to item within the project
 * @apiParam {string="structure", "content"} [include] To include the structure and content of the item
 * @apiParam {int} [startAt] Index position to start at (if content is array)
 * @apiParam {int} [numItems] Number of items to return (if content is array)
 * @apiName Get Item Content
 * @apiGroup Project Content
 */
router.get("/:projectID/*", function(req, res, next){
    // Creating temporary variables, to hold the content and structure
    // data that was loaded from the projects directory. The structure
    // data can appear in two forms:
    // - req.fileData.admin.project_structure if this is an admin, that will
    //   be allowed to request the contents of the projects structure
    // - req.projectStructure if this is a user that does not have permission
    //   to view the projects structure, but it will be required in order
    //   to validate the content
    var contentData = req.fileData.content;
    var structureData = req.fileData.admin != null ? req.fileData.admin.project_structure : req.projectStructure;

    // Getting the encapsulation data of the requested item, by slicing the first
    // parameter from the array of all params (as set up in the preload file data
    // route) as this will be the project id, which we no longer need
    var encapsulationData = req.allParams.slice(1);

    // Looping through the encapsulationData array (i.e. parameters passed to the
    // request URL) to drill down into the fileData object, to find the property that
    // needs to have an item created on it. 
    for(var i=0; i<encapsulationData.length; i++){

        if(contentData[encapsulationData[i]] != undefined){
            // Setting the contentData equal to the next level of the encapsulationData array
            // i.e. to keep drilling down into the contentData object
            contentData = contentData[encapsulationData[i]];
        } else {
            req.feedsErrors.push("'" + encapsulationData.join("/") + "' does not exist.");
            return next(new Error()); 
        }

        if(structureData != null){
            // Ignoring index values, as these will have no relevance to the project structure
            if(isNaN(encapsulationData[i])){
                if(structureData.items != undefined){
                    structureData = structureData.items;
                }
                
                if(structureData.attributes != undefined){
                    structureData = structureData.attributes;
                }

                if(structureData[encapsulationData[i]] != undefined){
                    structureData = structureData[encapsulationData[i]];
                }
            } else {
                if(structureData.items != undefined){
                    structureData = structureData.items;
                } else {
                    req.feedsErrors.push(encapsulationData[i] + " is not defined to contain items. Please create this items structure first.");
                    return next(new Error()); 
                }
            }
        }
        
    }

    // If this content is an array, checking if the user included an index to start at,
    // or a number of items to include in the response
    if(contentData.constructor.name.toLowerCase() == "array" && (req.query.startAt != null || req.query.numItems != null)){
        // Checking if a startAt value was supplied, and if not, starting at index 0
        var startAt = req.query.startAt != null && isNaN(req.query.startAt) == false ? parseInt(req.query.startAt) : 0;
        
        // Checking if a numItems value was supplied, and if not, ending at the length of the content data
        var endAt = req.query.numItems != null && isNaN(req.query.numItems) == false ? parseInt(req.query.numItems) + parseInt(startAt) : contentData.length;

        // ensuring that the endAt value has ended up being a larger
        // number than the start at value
        if(endAt > startAt){
            // Setting the content data to be equal to the shortened array
            contentData = contentData.slice(startAt, endAt);
        }            
    }

    // Checking if admin data has been read from the projects admin.json file
    if(req.fileData.admin != null){
        // Allowing admins to specify the content they would like in the request
        if(req.query.include != null){
            if(req.query.include.indexOf("structure") > -1){
                req.responseObject.structure = structureData;
            }
            if(req.query.include.indexOf("content") > -1){
                req.responseObject.content = contentData;
            }
        } else {
            // If no include specified, just returning the content
            req.responseObject = contentData;
        }    
    } else {
        // Checking for maximum cache age. If this content item has its own
        // specific cache age, this gets priority, otherwise the projects Setting
        // would get priority.
        if(structureData.max_cache_age != null && structureData.max_cache_age > 0){
            res.setHeader("Cache-control", "public; max-age=" + structureData.max_cache_age);
        } else if(req.max_cache_age != null && req.max_cache_age > 0){
            res.setHeader("Cache-control", "public; max-age=" + req.max_cache_age);
        } else {
            res.setHeader("Cache-control", "no-cache");
        }
        
        // Setting the collection content of the project as the response object, as no structure 
        // will be returned alongside the content
        req.responseObject = contentData;
    }
            
    // Sending the response object back in the response (which may contain the project structure,
    // project content and possibly some errors)
    res.send(req.responseObject);
});

// Exporting the router that was set up in this file, so that it can be included
// in the feeds.js route and specified as the route for all get requests to read
// elements from a project
module.exports = router;