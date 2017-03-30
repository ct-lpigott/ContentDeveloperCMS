// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Including the dbQuery module, which contains prepared queries to the 
// database, which ensure that all data used within them is sanitised and
// escaped before being included in a statement
var dbQuery = require("../custom_modules/database_query");

router.use(function(req, res, next){
	// Checking if the request contains a public_auth_token i.e. used in cross
	// origin requests, to identify a users relationship with a project
	if(req.headers.public_auth_token != null){
		// Getting the user id of this user-project realationship (if this is
		// a valid public auth token)
		dbQuery.getWhere_UserProject("user_id", ["public_auth_token", "project_id"], [req.headers.public_auth_token, req.projectID], function(err, row){
			if(row){
				req.userID = row.user_id;
				next();
			} else {
				req.preRequestErrors.push("Invalid public authentication token for this project");
				next(new Error());
			}
		});
	} else {
		// Creating an empty variable to store the user auth token
		var userAuthToken;

		// If a session exists, and has a user_auth_token associated with it, this
		// will be the used to validate the user
		if(req.session != null && req.session.user_auth_token != null){
			userAuthToken = req.session.user_auth_token;
		}

		// DEBUG ONLY - as logins with Google are not supported locally (due to the
		// redirect required)
		if(userAuthToken == null && process.env.DEBUG_AUTH_TOKEN != null){
			userAuthToken = process.env.DEBUG_AUTH_TOKEN;
		}

		// Checking that an auth token has been found
		if(userAuthToken != null){
			// Getting the id of the user associated with this auth token
			dbQuery.getWhere_User("id", ["cd_user_auth_token"], [userAuthToken], function(err, row){
				if(row){
					req.userID = row.id;
					next();
				} else {
					req.preRequestErrors.push("Invalid user authentication token");
					next(new Error());
				}
			});
		} else {
			// Only GET requests can proceed without an auth token
			if(req.method == "GET"){
				next();
			} else {
				req.preRequestErrors.push("Valid user authentication token required to access this resource");
				next(new Error("loginRequired"));
			}
		}
	}
});

// Exporting the router that was set up in this file, so that it can be included
// in the app.js file and specified as the route for all requests to be authenticated
module.exports = router;