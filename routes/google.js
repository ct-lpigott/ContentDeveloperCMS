var express = require('express');
var router = express.Router();

router.get("/oauthRedirectURL", function(req, res, next){
    console.log(req.params.code);
});

module.exports = router;