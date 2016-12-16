var express = require('express');
var router = express.Router();
var dbconn = require("../database/connection.js");

dbconn.query("SHOW TABLES", function (err, rows, fields){
    if(err){
        console.log(err);
    } else {
        console.log(rows);
    }
});

router.get("/", function(req, res, next){
    console.log("Request recieved in admin route");
    res.render("admin", {pageTitle: "Admin Panel"});
});

module.exports = router;