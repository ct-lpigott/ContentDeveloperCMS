
var frisby = require("frisby");
if(process.env.DEBUG_FEEDS_URL == null){
  require("./../../all-test-settings");
}

frisby.create("Feeds - Actions - Update Project All Content")
  .put(process.env.DEBUG_FEEDS_URL + + process.env.DEBUG_PROJECT_ID,{
      content: {
        home_page: {
              heading: "My Updated Frisby Heading",
              further_info: [{title: "Updated Google Frisby", link: "www.frisbyjs.com"}],
              telephone: "123"
        }
      }
  }, {json: true})
  .expectMaxResponseTime(2000)
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

frisby.create("Feeds - Actions - Update Project Item Content")
  .put(process.env.DEBUG_FEEDS_URL + + process.env.DEBUG_PROJECT_ID + "/home_page/telephone",{
      content: 086123456
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
    telephone: Number
  })
.toss();

frisby.create("Feeds - Actions - Update Project Array Item Content")
  .put(process.env.DEBUG_FEEDS_URL + + process.env.DEBUG_PROJECT_ID + "/home_page/further_info/0/link",{
      content: "www.updatedfrisbyjs.com"
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
  .expectJSONTypes("content.0",{
    link: String
  })
.toss();