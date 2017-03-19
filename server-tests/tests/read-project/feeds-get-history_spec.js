var frisby = require("frisby");
if(process.env.DEBUG_FEEDS_URL == null){
  require("./../../all-test-settings");
}

frisby.create("Feeds - Actions - Get Project History")
  .get(process.env.DEBUG_FEEDS_URL + process.env.DEBUG_PROJECT_ID + "?include=history")
  .expectStatus(200)
  .expectHeaderContains("Content-Type", "application/json")
  .expectJSONTypes({
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
  .afterJSON(function(response){
    var mostRecentCommitHash = response.structure_history[0].hash;
    frisby.create("Feeds - Actions - Get Commit History Content")
      .get(process.env.DEBUG_FEEDS_URL + process.env.DEBUG_PROJECT_ID + "?action=previewCommit&commitHash="+ mostRecentCommitHash + "&historyOf=structure")
      .expectStatus(200)
      .expectHeaderContains("Content-Type", "application/json")
      .expectJSONTypes({
        hash: String,
        commit_structure: Object
      })
    .toss();
  })
.toss();

