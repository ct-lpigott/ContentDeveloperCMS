var app = require("express")();

app.get("/", function(req, res, next){
    console.log("Request Recieved");
    res.send("<h1>Content Developer CMS</h1>");
});

app.listen(3000, function () {
  console.log("Listening on localhost:3000");
})

console.log("Initialised");