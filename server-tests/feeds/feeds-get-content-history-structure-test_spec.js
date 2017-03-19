var frisby = require("frisby");
if(process.env.DEBUG_FEEDS_URL == null){
  require("./../all-test-settings");
}

frisby.create("Feeds - Actions - Get Project Content Structure And History")
  .get(process.env.DEBUG_FEEDS_URL + + process.env.DEBUG_PROJECT_ID + "?include=content,structure,history")
  .expectMaxResponseTime(2000)
  .expectStatus(200)
  .expectHeaderContains("Content-Type", "application/json")
  .expectJSONTypes({
    content: Object,
    structure: Object,
    content_history: Array,
    structure_history: Array
  })
  .expectJSONTypes("content_history.*", {
    hash: String,
    date: Date,
    message: String,
    author_name: String,
    author_email: String
  })
  .expectJSONTypes("structure_history.*", {
    hash: String,
    date: Date,
    message: String,
    author_name: String,
    author_email: String
  })
.toss();