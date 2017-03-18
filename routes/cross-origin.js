// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

var dbQuery = require("../custom_modules/database_query");

function setAccessControlHeaders(req, res, controlLevel){
	res.setHeader("Access-Control-Allow-Origin", "*");
	switch(controlLevel){
		case "r":{
			res.setHeader("Access-Control-Allow-Methods", "GET");
			break;
		}
		case "crud":{
			res.setHeader("Access-Control-Allow-Headers", "Content-Type, user_auth_token");
			res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
			break;
		}
		case "ru":{
			res.setHeader("Access-Control-Allow-Headers", "Content-Type, user_auth_token");
			res.setHeader("Access-Control-Allow-Methods", "GET, PUT");
			break;
		}
	}
	
	return res;
}

router.use(["/feeds/:projectID", "/admin/*/:projectID"], function(req, res, next){
	dbQuery.get_Project("update_origins, read_origins", req.params.projectID, function(err, row){
		req.allowedOrigins = {};
		if(row && (row.update_origins != null || row.read_origins != null)){
			if(row.update_origins != null){
				req.allowedOrigins.update_origins = row.update_origins;
			}

			if(row.read_origins != null){
				req.allowedOrigins.read_origins = row.read_origins;
			}
		}
		next();
	});
});

router.use(function(req, res, next){
	// Setting the Strict Transport Security header to be valid for 1 year,
	// and to include all subdomains. Implementing HSTS (HTTP Strict-Transport-Security)
	// to ensure the site can only ever be accessed through HTTPS
	res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

	if(req.method == "OPTIONS"){
		if(req.originalUrl.indexOf("/admin") == 0){
			res = setAccessControlHeaders(req, res, "ru");
		} else if(req.originalUrl.indexOf("/feeds") == 0){
			res = setAccessControlHeaders(req, res, "crud");
		}

		// Responding to preflight requests
		res.send();
	} else {
		if(req.headers.origin != null && req.headers.origin != process.env.SITE_URL && req.allowedOrigins != null  && req.allowedOrigins.read_origins != null){
            var rejectRequest = false;

			if(req.method == "GET"){
				if(req.allowedOrigins.read_origins != null && req.allowedOrigins.read_origins.length > 0){
					if(req.allowedOrigins.read_origins.indexOf(req.headers.origin) > -1){
						res = setAccessControlHeaders(req, res, "r");			
					} else {
						rejectRequest = true;
					}			
				} else {
					res = setAccessControlHeaders(req, res, "r");
				}
				
				if(rejectRequest){
					if(req.allowedOrigins.update_origins != null && req.allowedOrigins.update_origins.length > 0){
						if(req.allowedOrigins.update_origins.indexOf(req.headers.origin) > -1){
							if(req.originalUrl.indexOf("/feeds") == 0 || req.originalUrl.indexOf("/admin") == 0){
								res = setAccessControlHeaders(req, res, "r");
								rejectRequest = false;
							} else {
								rejectRequest = true;
							}					
						} else {
							rejectRequest = true;
						}			
					} else {
						rejectRequest = false;
						res = setAccessControlHeaders(req, res, "r");
					}
				}					
			} else {
				if(req.allowedOrigins.update_origins != null && req.allowedOrigins.update_origins.length > 0){
					if(req.allowedOrigins.update_origins.indexOf(req.headers.origin) > -1 || req.allowedOrigins.update_origins.indexOf("*") > -1){
						if(req.originalUrl.indexOf("/feeds") == 0){
							res = setAccessControlHeaders(req, res, "crud");
						} else if(req.originalUrl.indexOf("/admin") == 0){
							res = setAccessControlHeaders(req, res, "ru");
						} else {
							rejectRequest = true;
						}					
					} else {
						rejectRequest = true;
					}	
				}
			}

            if(rejectRequest){
                next(new Error("Origin not authorised"));
            } else {
                next();
            }
		} else {
			if(req.originalUrl.indexOf("/admin") == 0){
				res = setAccessControlHeaders(req, res, "ru");
			} else if(req.originalUrl.indexOf("/feeds") == 0){
				res = setAccessControlHeaders(req, res, "crud");
			} else {
				res = setAccessControlHeaders(req, res, "r");
			}
            next();
		}
    }
});

module.exports = router;