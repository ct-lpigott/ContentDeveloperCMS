var express = require("express");
var app = express();
var pug = require("pug");

app.use("/", require("./routes/general.js"));
app.use("/admin", require("./routes/admin.js"));
app.use("/google", require("./routes/google.js"));
app.use("/feeds", require("./routes/feeds.js"));

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("./www"));

app.listen(process.env.PORT, function () {
  console.log("Listening on port: " + process.env.PORT);
});

console.log("Initialised");

module.exports = app;