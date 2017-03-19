var frisby = require("frisby");
if(process.env.DEBUG_FEEDS_URL == null){
  require("./../../all-test-settings");
}

frisby.create("Feeds - Actions - Create Project Structure")
  .put(process.env.DEBUG_FEEDS_URL + process.env.DEBUG_PROJECT_ID,{
      structure: {
        home_page: {
            type: "object",
            items: {
                heading: {
                    attributes: {type:"string"}
                },
                further_info: {
                    type: "array",
                    items: {
                        title: {
                            attributes: {
                            required: "required"
                            }
                        },
                        link: {
                            type: "link",
                            attributes: {
                            required: "required"
                            }
                        }
                    }
                }
            }
        }
    }
  }, {json: true})
  .expectMaxResponseTime(10000)
  .expectStatus(200)
  .expectHeaderContains("Content-Type", "application/json")
  .expectJSONTypes("home_page",{
    heading: Object,
    further_info: Object
  })
.toss();

frisby.create("Feeds - Actions - Create Project Structure")
  .post(process.env.DEBUG_FEEDS_URL + process.env.DEBUG_PROJECT_ID + "/home_page/telephone",{
    structure: {
        attributes: {type:"tel"}
    }
  }, {json: true})
  .expectMaxResponseTime(10000)
  .expectStatus(200)
  .expectHeaderContains("Content-Type", "application/json")
  .expectJSONTypes({
    telephone: Object
  })
.toss();