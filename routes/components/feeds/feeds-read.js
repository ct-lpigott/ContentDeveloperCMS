// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

var gitRepo = require("../../../custom_modules/git_repo");

/**
 * @api {get} /feeds/:projectID?include=structure,content,history Get entire project structure
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string="structure", "content", "history"}  [include] To include the structure, content and commit history of the project
 * @apiName GetProjectStructure
 * @apiGroup ProjectStructure
 */
/**
 * @api {get} /feeds/:projectID Get entire project content
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string="structure", "content", "history"}  [include] To include the structure, content and commit history of the project
 * @apiName GetProjectContent
 * @apiGroup ProjectContent
 */
/**
 * @api {get} /feeds/:projectID?include=history Get commit history of project
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string="structure", "content", "history"}  [include] To include the structure, content and commit history of the project
 * @apiName GetProjectCommitHistory
 * @apiGroup ProjectHistory
 */
router.get("/:projectID", function(req, res, next){
    if(req.fileData.admin != null){
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
                gitRepo.logFromRepo(req.params.projectID, "content", function(err, contentGitLog){
                    if(contentGitLog != null){
                        req.responseObject.content_history = contentGitLog;
                    }
                    
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
 * @api {get} /feeds/:projectID/:itemPath?include=structure Get an items structure
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} :itemPath Encapsulation path to item within the project
 * @apiParam {string="structure", "content"} [include] To include the structure and content of the item
 * @apiName GetItemStructure
 * @apiGroup ProjectStructure
 */
/**
 * @api {get} /feeds/:projectID/:itemPath Get an items content
 * @apiParam {int} :projectID Projects unique ID
 * @apiParam {string} :itemPath Encapsulation path to item within the project
 * @apiParam {string="structure", "content"} [include] To include the structure and content of the item
 * @apiName GetItemContent
 * @apiGroup ProjectContent
 */
router.get("/:projectID/*", function(req, res, next){
    var contentData = req.fileData.content;
    var structureData = req.fileData.admin != null ? req.fileData.admin.project_structure : req.projectStructure;

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

    if(contentData.constructor.name.toLowerCase() == "array" && (req.query.startAt != null || req.query.numItems != null)){
        var startAt = req.query.startAt != null ? req.query.startAt : 0;
        var endAt = req.query.numItems != null ? parseInt(req.query.numItems) + parseInt(startAt) : contentData.length;

        if(contentData.length > startAt){
            contentData = contentData.slice(startAt, endAt);
        }            
    }

    // Checking if admin data has been read from the projects admin.json file
    if(req.fileData.admin != null){
        if(req.query.include != null){
            if(req.query.include.indexOf("structure") > -1){
                req.responseObject.structure = structureData;
            }
            if(req.query.include.indexOf("content") > -1){
                req.responseObject.content = contentData;
            }
        } else {
            req.responseObject = contentData;
        }    
    } else {
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