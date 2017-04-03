// Setting the export of this module to be an error handling
// middleware function i.e. it has four parameters, including
// one for the error that was thrown.
module.exports = function (err, req, res, next) {
    // Setting the request status to be equal to the specified status
    // of the error, or failing that (i.e. if one has not been specified)
    // setting it to 500 - Internal Server Error).
    if(err.message != "notify" && err.message != "loginRequired" && req.feedsErrors != null){
        res.status(err.status || 500);
    }

    if(req.responseObject != null){
        // Creating the errors array on the response object
        req.responseObject.errors = [];

        if(req.loginErrors != null){
            // Adding any errors that occurred within the login route, so that they
            // can be passed back to the user.
            for(var i=0; i<req.loginErrors.length; i++){
                req.responseObject.errors.push(req.loginErrors[i]);
            }
            
        }
        
        if(req.feedsErrors != null){
            // Adding any errors that occurred within the feeds route, so that they
            // can be passed back to the user.
            for(var i=0; i<req.feedsErrors.length; i++){
                req.responseObject.errors.push(req.feedsErrors[i]);
            }
            req.responseObject.success = false;
        }
        if(req.adminErrors != null){
            // Adding any errors that occurred within the admin route, so that they
            // can be passed back to the user.
            for(var i=0; i<req.adminErrors.length; i++){
                req.responseObject.errors.push(req.adminErrors[i]);
            }
        }
        if(req.preRequestErrors != null){
            // Adding any errors that occurred within the pre request routes, so that they
            // can be passed back to the user.
            for(var i=0; i<req.preRequestErrors.length; i++){
                req.responseObject.errors.push(req.preRequestErrors[i]);
            } 
        }   

        // If a login is required, adding a loginRequired property to the response
        // to notify the user and/or CMS
        if(err.message == "loginRequired"){
            req.responseObject.loginRequired = true;
            res.clearCookie("connect.sid");
        }

        // Sending the responseObject back as the response for this request. This 
        // will contain the array of any errors that have occurred within the feeds
        // route
        res.send(req.responseObject);
    } else {
        req.responseObject = {};
        // If a login is required, adding a loginRequired property to the response
        // to notify the user and/or CMS
        if(err.message == "loginRequired"){
            req.responseObject.loginRequired = true;
            res.clearCookie("connect.sid");
        }
        res.send(req.responseObject);
        console.log(err);
    }
};