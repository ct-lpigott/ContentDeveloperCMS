var frisby = require("frisby");
if(process.env.DEBUG_FEEDS_URL == null){
  require("./../../all-test-settings");
}

frisby.create("Feeds - Actions - Get User Projects")
  .get(process.env.DEBUG_FEEDS_URL + "?action=collaborators")
  .expectStatus(200)
  .expectHeaderContains("Content-Type", "application/json")
  .expectJSONTypes("0", {
    user_id: Number,
    project_id: Number,
    project_name: String,
    access_level_int: Number,
    access_level_name: String,
    last_modified_by: String,
    last_modified_on: Date
  })
.toss();

frisby.create("Feeds - Actions - Get Project Collaborators")
  .get(process.env.DEBUG_FEEDS_URL + process.env.DEBUG_PROJECT_ID + "?action=collaborators")
  .expectStatus(200)
  .expectHeaderContains("Content-Type", "application/json")
  .expectJSONTypes("0", {
    display_name: String,
    user_id: Number,
    access_level_int: Number,
    access_level_name: String,
  })
.toss();