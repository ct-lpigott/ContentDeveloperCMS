var frisby = require("frisby");
if(process.env.DEBUG_FEEDS_URL == null){
  require("./../../all-test-settings");
}

frisby.create("Feeds - Actions - Get Project Collaborators")
  .get(process.env.DEBUG_FEEDS_URL + process.env.DEBUG_PROJECT_ID + "?action=collaborators")
  .expectStatus(200)
  .expectHeaderContains("Content-Type", "application/json")
  .expectJSONTypes({
    collaborators:Array
  })
  .expectJSONTypes("collaborators.0", {
    display_name: String,
    user_id: Number,
    access_level_int: Number,
    access_level_name: String,
  })
.toss();