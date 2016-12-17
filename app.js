var express = require("express");
var app = express();
var pug = require("pug");

var port = process.env.PORT;

var general_route = require("./routes/general.js");
var admin_route = require("./routes/admin.js");

app.use("/", general_route);
app.use("/admin", admin_route);

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("./www"));

app.listen(port, function () {
  console.log("Listening on port " + port);
});

console.log("Initialised");

module.exports = app;