var frisby = require("frisby");
if(process.env.DEBUG_FEEDS_URL == null){
  require("./../all-test-settings");
}

frisby.create("Feeds - Actions - Get Project Structure")
  .get(process.env.DEBUG_FEEDS_URL + + process.env.DEBUG_PROJECT_ID + "?include=structure")
  .expectMaxResponseTime(2000)
  .expectStatus(200)
  .expectHeaderContains("Content-Type", "application/json")
  .expectJSONTypes({
    structure: Object
  })
.toss();