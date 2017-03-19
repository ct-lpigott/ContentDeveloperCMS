(function(){
    require("./../env_config.js");
    process.env.DEBUG_PROJECT_ID = 1;
    process.env.DEBUG_FEEDS_URL = process.env.SITE_URL + "/feeds/";
    process.env.DEBUG_COMMIT_HASH = "059c76c0edb2c465bea115f771e1bb42c4a1fe65";

    console.log("All settings loaded");
})();