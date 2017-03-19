(function(){
    require("./../env_config.js");
    process.env.DEBUG_FEEDS_URL = process.env.SITE_URL + "/feeds/";

    // NEEDS TO BE UPDATED THE REFLECT THE APPROPRIATE PROJECT
    process.env.DEBUG_PROJECT_ID = 34;

    console.log("All settings loaded");
})();