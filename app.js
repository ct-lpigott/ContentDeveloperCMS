// Including the modules which make up the basis of the application.
// Using express to manage the routing of requests to the server.
var express = require("express");
var fs = require("fs");
var http = require("http");
var https = require("https");
var redirectHttps = require("redirect-https");
var multer = require("multer");
var bodyParser = require('body-parser');
var checkDirectories = require("./custom_modules/check_directories");
var session = require("express-session");

// Checking if the env_config file exists, which 
// contains a self invoking function, to set up all
// configuration variables for the app
if(fs.existsSync("./env_config.js")){
  // Requiring the env_config file, so that it can invoke
  // its module exports to set up the env vars
  require("./env_config.js");
}

// Checking that all required directories exist (and creating
// them if they dont)
checkDirectories();

// Generating a new app using the express module
var app = express();

// Setting up the sessions for the server. Using the 
// session key from the env vars, setting resave to false (so
// that sessions that have no change will not be resaved).
// Setting save uninitialised to false, so that sessions
// that have no properties added to them are discarded.
// Setting the session cookie to be secure, if not in
// debug mode (as it will not work without HTTPS), and
// the max age to 15 minutes. Finally, setting the session
// cookie to "rolling", so that any interaction with the 
// server will reset the cookies 15 minute lifespan (otherwise
// the 15 minutes expires 15 mins after login)
app.use("/", session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.DEBUG != "true",
      maxAge: 1000 * 60 * 15 // 15 minutes
    },
    rolling: true
}));

// Setting the route for all static request to be "/public" i.e. this will deal
// with all requests for static elements of the site, such as JavaScript, CSS etc.
app.use(express.static("./public"));

// Redirecting all get requests for the route of the server to /cms i.e. the
// Angular app. This app required its own directory, as the API documentation
// also exists at the route, and both overwrite each other when ng build is run
// for the Angular app, or apidoc is used to generate the documentation
app.get("/", function(req, res, next){
  res.redirect("/cms");
});

// Intercepting all requests. Checking for cross origin requests, and dealing
// with preflight requests. Checking for authentication. If requests fail
// in either of these routes, an error will be returned to the user, and they
// will not be allowed to pass any furhter into the server
app.use("/", require("./routes/cross-origin.js"));
app.use("/", require("./routes/authentication.js"));

// Setting the app to use the body parser for all requests to the server.
// Using the json() method for parsing requests with a content type of
// "application/json"
app.use(bodyParser.json()); 

// Creating a multer upload method, to detal with requests to upload
// files to the server i.e. decide their destination and filename
var multerUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      // Setting the directory to upload files to the "./uploads" directory.
      // Files will only be stored here temporarily, while they are being 
      // uploaded to the relevant project's Google Drive folder, after which
      // they will be deleted from the server
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      // Prepending the filename with the current timestamp, so as to avoid 
      // naming conflicts on the server
      cb(null, Date.now() + "_" + file.originalname);
    }
  })
});

// Setting the app to pass all upload requests, to the feeds route, with an
// input name of "file" to the multer upload module above.
app.use("/feeds", multerUpload.single("file"));

// Setting up the routing structure of the app. Sending requests to a different
// route in the server based on the first URL parameter of their request i.e.
// requests that begin with "/admin" will be routed through the admin route etc. 
app.use("/google", require("./routes/google.js"));
app.use("/admin", require("./routes/admin.js"));
app.use("/feeds", require("./routes/feeds.js"));

// Setting up the error route for the app. Since all interactions with the 
// server will be through API, sending all errors as json
app.use(require("./routes/error-routes/feeds-errors.js"));

// Checking if the app is running in debug mode, as only a http server will work
// locally, while a https server is required remotely
if(process.env.DEBUG == null || process.env.DEBUG == "false"){
  // Creating a HTTPS options object, with the relative paths to the SSL certificate
  // private key and full chain cert file (on the GoDaddy server)
  var httpsOptions = {
    key: fs.readFileSync("./../../../../etc/letsencrypt/live/contentdevelopercms.eu/privkey.pem"),
    cert: fs.readFileSync("./../../../../etc/letsencrypt/live/contentdevelopercms.eu/fullchain.pem")
  };

  // Setting up a HTTP server, whose only purpose is to redirect any HTTP requests as 
  // HTTPS requests i.e. if a request is recieved at the process.env.PORT, it will be
  // redirected to the 443 (which will be received by the Apache HTTPS server, and 
  // redirected to the server running below).
  http.createServer(redirectHttps({port:443})).listen(process.env.PORT, function () {
    console.log("Listening for HTTP requests on " + process.env.PORT);
  });

  // Setting up a HTTP server, to deal with all HTTPS requests i.e. to be the main
  // server of the app.
  https.createServer(httpsOptions, app).listen(process.env.PORT_HTTPS, function () {
    console.log("Listening for HTTPS requests, and serving app, on port " + process.env.PORT_HTTPS);
  });
} else {
  // Setting the app to run on the port specified in the environment variables. This 
  // will set up the server to be available to receive requests on this route.
  app.listen(process.env.PORT, function () {
    console.log("Listening for all requests on port: " + process.env.PORT);
  });
}

// Setting the app, that was set up within this file, as the export for this module
module.exports = app;
