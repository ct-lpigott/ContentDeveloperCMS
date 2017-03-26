// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

var dbQuery = require("../custom_modules/database_query");

router.use(function(req, res, next){
	var userAuthToken;

	if(req.headers.user_auth_token != null){
		userAuthToken = req.headers.user_auth_token;
	} else if(req.session != null && req.session.user_auth_token != null){
		userAuthToken = req.session.user_auth_token;
	}
	
	if(userAuthToken == null && process.env.DEBUG_AUTH_TOKEN != null){
		userAuthToken = process.env.DEBUG_AUTH_TOKEN;
	}

	if(userAuthToken != null){
		dbQuery.getWhere_User("id", ["cd_user_auth_token"], [userAuthToken], function(err, row){
			if(row){
				req.userID = row.id;
				//console.log("Successful Auth");
				next();
			} else {
				req.preRequestErrors.push("Invalid user authentication token");
				next(new Error());
			}
		});
	} else {
		if(req.method == "GET"){
			next();
		} else {
			req.preRequestErrors.push("Valid user authentication token required to access this resource");
			next(new Error("loginRequired"));
		}
	}
});

module.exports = router;