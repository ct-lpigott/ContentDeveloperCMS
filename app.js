var app = require("express")();
var pug = require("pug");

var general_route = require("./routes/general.js");
var admin_route = require("./routes/admin.js");

app.use("/", general_route);
app.use("/admin", admin_route);

app.set("view engine", "pug");

app.listen(3000, function () {
  console.log("Listening on localhost:3000");
});

console.log("Initialised");

module.exports = app;