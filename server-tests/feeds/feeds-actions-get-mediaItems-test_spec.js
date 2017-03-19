var frisby = require("frisby");
if(process.env.DEBUG_FEEDS_URL == null){
  require("./../all-test-settings");
}

frisby.create("Feeds - Actions - Get Project Media Items")
  .get(process.env.DEBUG_FEEDS_URL + process.env.DEBUG_PROJECT_ID + "?action=mediaItems")
  .expectStatus(200)
  .expectHeaderContains("Content-Type", "application/json")
  .expectJSONTypes("files.*", {
    id: String,
    name: String,
    mimeType: String,
    url: String
  })
.toss();