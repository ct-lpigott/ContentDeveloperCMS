// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Requiring the custom database connection module, so that the one
// connection to the database can be reused throughout the application.
var dbconn = require("../database/connection.js");

function setAccessControlHeaders(req, res, controlLevel){
	res.setHeader("Access-Control-Allow-Origin", "*");
	switch(controlLevel){
		case "r":{
			res.setHeader("Access-Control-Allow-Methods", "GET");
			break;
		}
		case "crud":{
			if(req.originalUrl.indexOf("/feeds") == 0){
				res.setHeader("Access-Control-Allow-Headers", "Content-Type, user_auth_token");
				res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
			} else {
				res.setHeader("Access-Control-Allow-Methods", "GET");
			}
			break;
		}
	}
	
	return res;
}

router.use(function(req, res, next){
	console.log("Authentication");

	// Setting the Strict Transport Security header to be valid for 1 year,
	// and to include all subdomains. Implementing HSTS (HTTP Strict-Transport-Security)
	// to ensure the site can only ever be accessed through HTTPS
	res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

	if(req.method == "OPTIONS"){
		res = setAccessControlHeaders(req, res, "crud");
		// Responding to preflight requests
		res.send();
	} else {
		var userAuthToken;
	
		if(req.headers.user_auth_token != null){
			userAuthToken = req.headers.user_auth_token;
		} else if(req.session != null && req.session.user_auth_token != null){
			userAuthToken = req.session.user_auth_token;
		}

		if(userAuthToken != null){
			dbconn.query("SELECT * FROM User WHERE cd_user_auth_token=" + dbconn.escape(userAuthToken) + "", function(err, rows, fields){
				if(err){
					console.log(err);
					next(new Error("Unable to find user", null));			
				} else {
					if(rows.length > 0){
						req.userID = rows[0].id;
						res = setAccessControlHeaders(req, res, "crud");
						console.log("Successful Auth");
						next();
					} else {
						// Since this does not appear to be a recognised user, only allowing
						// the origins of this request to preform GET requests on the server
						res = setAccessControlHeaders(req, res, "r");
						next(new Error("Invalid user authentication token", null));
					}
				}
			});
		} else {
			// Since there was no user auth token provided in the request, only allowing
			// the origins of this request to preform GET requests on the server
			res = setAccessControlHeaders(req, res, "r");
			if(req.method == "GET"){
				next();
			} else {
				next(new Error("Valid user authentication token required to access this resource"));
			}
		}
	}  
});

module.exports = router;