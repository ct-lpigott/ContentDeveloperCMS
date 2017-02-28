// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Requiring the custom database connection module, so that the one
// connection to the database can be reused throughout the application.
var dbconn = require("../../database/connection.js");

router.use(function(req, res, next){
	console.log("Authentication");
	if(req.headers.user_auth_token != null){
		dbconn.query("SELECT * FROM User WHERE cd_user_auth_token=" + dbconn.escape(req.headers.user_auth_token) + "", function(err, rows, fields){
			if(err){
				console.log(err);
				next(new Error("Unable to find user", null));			
			} else {
				if(rows.length > 0){
					req.userID = rows[0].id;
					console.log("Successful Auth");
					next();
				} else {
					next(new Error("Invalid user authentication token", null));
				}
			}
		});
	} else if(req.method == "GET"){
		next();
	} else {
		next(new Error("No user authentication token supplied in the request"));
	}
});

module.exports = router;