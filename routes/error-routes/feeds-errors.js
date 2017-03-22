// Setting the export of this module to be an error handling
// middleware function i.e. it has four parameters, including
// one for the error that was thrown.
module.exports = function (err, req, res, next) {
    // Setting the request status to be equal to the specified status
    // of the error, or failing that (i.e. if one has not been specified)
    // setting it to 500 - Internal Server Error).
    if(err.message != "notify" || req.feedsErrors != null){
        res.status(err.status || 500);
    }    
    //console.log(err);

    req.responseObject.errors = [];
    
    if(req.feedsErrors != null){
        // Creating an errors array on the response object, and setting it to be
        // equal to any errors that occurred within the feeds route, so that they
        // can be passed back to the user.
        for(var i=0; i<req.feedsErrors.length; i++){
            req.responseObject.errors.push(req.feedsErrors[i]);
        }
        
    }
    if(req.adminErrors != null){
        // Creating an errors array on the response object, and setting it to be
        // equal to any errors that occurred within the admin route, so that they
        // can be passed back to the user.
        for(var i=0; i<req.adminErrors.length; i++){
            req.responseObject.errors.push(req.adminErrors[i]);
        }
    }
    if(req.preRequestErrors != null){
        // Creating an errors array on the response object, and setting it to be
        // equal to any errors that occurred within the admin route, so that they
        // can be passed back to the user.
        for(var i=0; i<req.preRequestErrors.length; i++){
            req.responseObject.errors.push(req.preRequestErrors[i]);
        } 
    }   

    // Sending the responseObject back as the response for this request. This 
    // will contain the array of any errors that have occurred within the feeds
    // route
    res.send(req.responseObject);
};