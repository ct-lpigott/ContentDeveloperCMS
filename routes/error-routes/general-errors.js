// Setting the export of this module to be an error handling
// middleware function i.e. it has four parameters, including
// one for the error that was thrown.
module.exports = function (err, req, res, next) {
    // Setting the request status to be equal to the specified status
    // of the error, or failing that (i.e. if one has not been specified)
    // setting it to 500 - Internal Server Error).
    res.status(err.status || 500);

    res.send({});

    console.log(err);
};