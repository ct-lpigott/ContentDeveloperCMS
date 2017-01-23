// Including the modules which make up the basis of the application.
// Using express to manage the routing of requests to the server.
// Using pug to create the templates for the various pages on the site.
// Using the body parser to parse the HTML request body and store is
// on the "body" property of each request.
var express = require("express");
var pug = require("pug");
var bodyParser = require('body-parser');

// Generating a new app using the express module
var app = express();

// Setting the app to use the body parser for all requests to the server.
// Using the json() method for parsing requests with a content type of
// "application/json". Using the urlencoded() method for parsing requests
// with a content type of "application/x-www-form-urlencoded".
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// Setting up the routing structure of the app. Sending requests to a different
// route in the server based on the first URL parameter of their request i.e.
// requests that begin with "/admin" will be routed through the admin route etc. 
app.use("/", require("./routes/index.js"));
app.use("/admin", require("./routes/admin.js"));
app.use("/google", require("./routes/google.js"));
app.use("/feeds", require("./routes/feeds.js"));

// Setting up the error routes for the app. Errors in the admin panel and 
// feeds API will be dealt with through individual error routes, while all
// other errors will be dealt with through the general errors route.
app.use("/admin", require("./routes/error-routes/admin-errors.js"));
app.use("/feeds", require("./routes/error-routes/feeds-errors.js"));
app.use(require("./routes/error-routes/general-errors.js"));

// Setting the view engine (or tempate engine) that the app will use to be "pug"
// (previously know as Jade). Setting the views directory (where these templates)
// will be stored to be "/views".
app.set("view engine", "pug");
app.set("views", "./views");

// Setting the route for all static request to be "/public" i.e. this will deal
// with all requests for static elements of the site, such as JavaScript, CSS etc.
app.use(express.static("./public"));

// Setting the app to run on the port specified in the environment variables. This 
// will set up the server to be available to receive requests on this route.
app.listen(process.env.PORT, function () {
  console.log("Listening on port: " + process.env.PORT);
});

// Setting the app, that was set up within this file, as the export for this module
module.exports = app;