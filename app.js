var express = require("express");
var app = express();
var pug = require("pug");
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use("/", require("./routes/general.js"));
app.use("/admin", require("./routes/admin.js"));
app.use("/google", require("./routes/google.js"));
app.use("/feeds", require("./routes/feeds.js"));

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("./public"));

app.listen(process.env.PORT, function () {
  console.log("Listening on port: " + process.env.PORT);
});

console.log("Initialised");

module.exports = app;