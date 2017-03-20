var frisby = require("frisby");
if(process.env.DEBUG_FEEDS_URL == null){
  require("./../../all-test-settings");
}

frisby.create("Feeds - Actions - Update Project Content")
  .put(process.env.DEBUG_FEEDS_URL + process.env.DEBUG_PROJECT_ID,{
      content: {
        home_page: {
            heading: "My Frisby Heading",
            further_info: [{title: "Google Frisby", link: "www.frisbyjs.com"}]
        }
    }
  }, {json: true})
  .expectMaxResponseTime(10000)
  .expectStatus(200)
  .expectHeaderContains("Content-Type", "application/json")
  .expectJSONTypes({
    content: Object,
    errors: function(val){
      expect(val).toBeTypeOrNull(Array);
      console.log(val);
    }
  })
  .expectJSONTypes("content.home_page",{
    heading: Object,
    further_info: Object
  })
.toss();

frisby.create("Feeds - Actions - Create Project Item Content")
  .post(process.env.DEBUG_FEEDS_URL + + process.env.DEBUG_PROJECT_ID + "/home_page/telephone",{
      content: "0863331636"
  }, {json: true})
  .expectMaxResponseTime(10000)
  .expectStatus(200)
  .expectHeaderContains("Content-Type", "application/json")
  .expectJSONTypes({
    content: Object,
    errors: function(val){
      expect(val).toBeTypeOrNull(Array);
      console.log(val);
    }
  })
  .expectJSONTypes("content.home_page",{
    telephone: String
  })
.toss();