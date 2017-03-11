// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Requiring the custom database connection module, so that the one
// connection to the database can be reused throughout the application.
var dbconn = require("../../database/connection.js");

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

		userAuthToken = "32614ac97a6c2e2b707786f65313f1a5532a3ab9218b59203751d9f31104e0c0b21b302e26be649bf9939fec6bd1629a2b50241e5302c68e3fcaa9fb838588eca1e0e207c57be33ca411fddf24a572d6ff198af04d4beb056cb8f99f8c7ffd22216ca467102fb29901d4f3abb61f21e9f2164297844c53a6e205ed693bb3ba804f7c955ba4ca8e375b95c710af49a7d1bef7f8f33abec4ea67f884a9943d6d5e7d7b9241e70b316cfe849d892326861b28b1cb996252452d534f2282484fab66a89f0b4e9e7a6295c6170c2b3ead0a5badbefe5b4917a436a35e19ef636effc230c6ceec28998c9a192ddcafe765d3c30d200fff6216dcf147adebb72e0acce81488647819623";
			
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