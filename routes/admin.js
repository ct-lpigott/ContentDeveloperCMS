var express = require('express');
var router = express.Router();
var dbconn = require("../database/connection.js");

router.get("/", function(req, res, next){
    console.log("Request recieved in admin route");
    dbconn.query("SHOW TABLES", function (err, rows, fields){
        if(err){
            console.log(err);
        } else {
            console.log(rows);
        }
        res.render("admin", {pageTitle: "Admin Panel", dbTables: rows});
    });
});

module.exports = router;