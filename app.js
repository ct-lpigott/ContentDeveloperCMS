var app = require("express")();
var pug = require("pug");
app.set("view engine", "pug");

app.get("/", function(req, res, next){
    console.log("Request Recieved");
    res.render("index", {});
});

app.listen(3000, function () {
  console.log("Listening on localhost:3000");
})

console.log("Initialised");