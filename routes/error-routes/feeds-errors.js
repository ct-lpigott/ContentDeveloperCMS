// Setting the export of this module to be an error handling
// middleware function i.e. it has four parameters, including
// one for the error that was thrown.
module.exports = function (err, req, res, next) {
    // Setting the request status to be equal to the specified status
    // of the error, or failing that (i.e. if one has not been specified)
    // setting it to 500 - Internal Server Error).
    res.status(err.status || 500);

    // Creating an errors array on the response object, and setting it to be
    // equal to any errors that occurred within the feeds route, so that they
    // can be passed back to the user.
    req.responseObject.errors = req.feedsErrors;

    // Sending the responseObject back as the response for this request. This 
    // will contain the array of any errors that have occurred within the feeds
    // route
    res.send(req.responseObject);
};