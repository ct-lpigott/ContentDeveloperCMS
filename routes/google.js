var express = require('express');
var router = express.Router();

router.get("/oauthRedirectURL", function(req, res, next){
    res.send("Google ID: " + req.param.code);
});

module.exports = router;