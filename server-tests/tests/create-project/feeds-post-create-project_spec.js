var frisby = require("frisby");
if(process.env.DEBUG_FEEDS_URL == null){
  require("./../../all-test-settings");
}

frisby.create("Feeds - Actions - Create New Project")
  .post(process.env.DEBUG_FEEDS_URL + "?action=createProject",{
      project_name: "Frisby Test - " + Date.now()
  }, {json: true})
  .expectMaxResponseTime(20000)
  .expectStatus(200)
  .expectHeaderContains("Content-Type", "application/json")
  .expectJSONTypes({
    new_project_id: function(val){
      expect(val).toBeType(Number);
      console.log("NEW PROJECT CREATED - ID=" + val);
    }
  })
.toss();