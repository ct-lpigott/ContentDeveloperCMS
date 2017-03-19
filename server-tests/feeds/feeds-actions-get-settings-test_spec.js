var frisby = require("frisby");
if(process.env.DEBUG_FEEDS_URL == null){
  require("./../all-test-settings");
}

frisby.create("Feeds - Actions - Get All Project Settings")
  .get(process.env.DEBUG_FEEDS_URL + process.env.DEBUG_PROJECT_ID + "?allSettings")
  .expectMaxResponseTime(2000)
  .expectStatus(200)
  .expectHeaderContains("Content-Type", "application/json")
  .expectJSONTypes({
    collaborators: Array,
    access_levels: Array,
    project_name: String,
    max_cache_age: function(val) { expect(val).toBeTypeOrNull(Number); },
    custom_css: function(val) { expect(val).toBeTypeOrNull(String); }
  })
.toss();

frisby.create("Feeds - Actions - Get Project Access Levels")
  .get(process.env.DEBUG_FEEDS_URL + process.env.DEBUG_PROJECT_ID + "?action=accessLevels")
  .expectStatus(200)
  .expectHeaderContains("Content-Type", "application/json")
  .expectJSONTypes("0", {
    access_level_name: String,
    access_level_int: Number,
    in_use: Boolean
  })
.toss();

frisby.create("Feeds - Actions - Get Project Name")
  .get(process.env.DEBUG_FEEDS_URL + process.env.DEBUG_PROJECT_ID + "?action=projectName")
  .expectStatus(200)
  .expectHeaderContains("Content-Type", "application/json")
  .expectJSONTypes({
    project_name: String
  })
.toss();

frisby.create("Feeds - Actions - Get Project Maximum Cache")
  .get(process.env.DEBUG_FEEDS_URL + process.env.DEBUG_PROJECT_ID + "?action=cache")
  .expectStatus(200)
  .expectHeaderContains("Content-Type", "application/json")
  .expectJSONTypes({
    max_cache_age: function(val) { expect(val).toBeTypeOrNull(Number); }
  })
.toss();

frisby.create("Feeds - Actions - Get Project Custom CSS")
  .get(process.env.DEBUG_FEEDS_URL + process.env.DEBUG_PROJECT_ID + "?action=css")
  .expectStatus(200)
  .expectHeaderContains("Content-Type", "application/json")
  .expectJSONTypes({
    custom_css: function(val) { expect(val).toBeTypeOrNull(String); }
  })
.toss();