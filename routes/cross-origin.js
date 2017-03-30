// Creating a new router through the express module. This router
// will be used within this module so set up the various requests
// which this route will accept.
var router = require('express').Router();

// Including the dbQuery module, which contains prepared queries to the 
// database, which ensure that all data used within them is sanitised and
// escaped before being included in a statement
var dbQuery = require("../custom_modules/database_query");

// Requests to the feeds or admin routes that have a project id associated with
// them will be caught here first, to load their allowed origins (as per the 
// project settings)
router.use(["/feeds/:projectID", "/admin/*/:projectID"], function(req, res, next){
	// Storing the project id, as it may be required in the authentication route
	// if this user is authenticating using a public auth token (as it will be specific
	// to a project)
	req.projectID = req.params.projectID;

	// Getting this projects update and read origins
	dbQuery.get_Project("update_origins, read_origins", req.params.projectID, function(err, row){
		// Creating an allowed origins object, to store these values on
		req.allowedOrigins = {};

		// Adding the allowed origins settings, only if they exist
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
	// Creating a response object, which will be used through all the routes of the server
	req.responseObject = {};

	// Creating a reRequestErrors array, to store any errors that occur before the 
	// request reaches the feeds/admin route (so that they can be sent back to the user)
	req.preRequestErrors = [];
	
	// Setting the Strict Transport Security header to be valid for 1 year,
	// and to include all subdomains. Implementing HSTS (HTTP Strict-Transport-Security)
	// to ensure the site can only ever be accessed through HTTPS. Including the preload
	// parameter, as contentdevelopercms.eu is set to be preloaded by Google Chrome
	res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

	if(req.method == "OPTIONS"){
		// If the method of the request is "options", then this is a 
		// preflight request
		if(req.originalUrl.indexOf("/feeds") == 0){
			// Responding to the preflight with full crud permissions,
			// so that the request can actually reach the server, where
			// the actual access levels afforeded to this origin will
			// be decided below
			res = setAccessControlHeaders(req, res, "crud");
		}

		// Responding to preflight requests
		res.send();
	} else {
		// If this is a cross origin request (from a source other than this server),
		// and allowedOrigins have been set on the request object, then checking if this
		// origin is allowed access to the projects resources
		if(req.headers.origin != null && req.allowedOrigins != null){
			if(req.headers.origin == process.env.SITE_URL){
				// This server will always have full access to the server
				res = setAccessControlHeaders(req, res, "crud");
				next();
			} else {
				// Assuming that we wont be rejecting the request
				var rejectRequest = false;

				if(req.method == "GET"){
					// If there are read origins specified, only allowing requests from these
					// origins to access the project 
					if(req.allowedOrigins.read_origins != null && req.allowedOrigins.read_origins.length > 0){
						if(req.allowedOrigins.read_origins.indexOf(req.headers.origin) > -1){
							if(req.originalUrl.indexOf("/feeds") == 0){
								// for the feeds route, read access will be given
								res = setAccessControlHeaders(req, res, "r");
								rejectRequest = false;
							} else {
								// For any other route, no access will be given
								rejectRequest = true;
							}			
						} else {
							// This origin does not have read access
							rejectRequest = true;
						}			
					} else {
						// Since no read origins were supplied, assuming that all origins
						// can read from the project data
						res = setAccessControlHeaders(req, res, "r");
						rejectRequest = false;
					}
					
					// If update origins also exist, then they should also be allowed to read
					// from the project
					if(rejectRequest && req.allowedOrigins.update_origins != null && req.allowedOrigins.update_origins.length > 0){
						if(req.allowedOrigins.update_origins.indexOf(req.headers.origin) > -1){
							if(req.originalUrl.indexOf("/feeds") == 0){
								// For the feeds route, read access will be given
								res = setAccessControlHeaders(req, res, "r");
								rejectRequest = false;
							} else {
								// For any other route, no access will be given
								rejectRequest = true;
							}					
						} else {
							// This origin does not have update access
							rejectRequest = true;
						}			
					}				
				} else {
					// If update origins are present, then checking if this origin
					// has permission to access this project
					if(req.allowedOrigins.update_origins != null && req.allowedOrigins.update_origins.length > 0){
						if(req.allowedOrigins.update_origins.indexOf(req.headers.origin) > -1 || req.allowedOrigins.update_origins.indexOf("*") > -1){
							if(req.originalUrl.indexOf("/feeds") == 0){
								// For feeds, full crud access will be given
								res = setAccessControlHeaders(req, res, "crud");
								rejectRequest = false;
							} else {
								// For any other route, no access will be given
								rejectRequest = true;
							}					
						} else {
							// This origin does not have update access
							rejectRequest = true;
						}	
					} else {
						// If no update origins are specified, then no cross origin
						// requests to update, delete or create on a project will be allowed
						rejectRequest = true;
					}
				}

				// Checking if the request should be rejected or allowed to pass through
				if(rejectRequest){
					// Including the origin in the request, so that the user knows what needs
					// to be added to the project settings to allow this request in the future
					req.preRequestErrors.push("Origin not authorised - " + req.headers.origin);
					next(new Error());
				} else {
					// Allowing the request to pass through
					next();
				}
			}
		} else {
			next();
		}
    }
});

function setAccessControlHeaders(req, res, controlLevel){
	// Setting access control allow origin to all origins (as this may be for
	// a preflight request, and so need to let the actual request come in to
	// see how much access (if any) they can have)
	res.setHeader("Access-Control-Allow-Origin", "*");

	// Switching the control level requested i.e. crud, ru, r etc.
	// - crud = create, read, update, delete
	// - ru = read, update
	// - r = read only
	switch(controlLevel){
		case "crud":{
			res.setHeader("Access-Control-Allow-Headers", "Content-Type, public_auth_token");
			res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
			break;
		}
		case "ru":{
			res.setHeader("Access-Control-Allow-Headers", "Content-Type, public_auth_token");
			res.setHeader("Access-Control-Allow-Methods", "GET, PUT");
			break;
		}
		case "r":{
			res.setHeader("Access-Control-Allow-Methods", "GET");
			break;
		}
	}
	
	// Returning the response object to the caller
	return res;
}

// Exporting the router that was set up in this file, so that it can be included
// in the app.js file and specified as the route for all requests to be authenticated
module.exports = router;