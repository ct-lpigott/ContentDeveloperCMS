var express = require('express');
var router = express.Router();

router.get("/", function(req, res, next){
    console.log("Request recieved in admin route");
    res.render("admin", {pageTitle: "Admin Panel"});
});

module.exports = router;