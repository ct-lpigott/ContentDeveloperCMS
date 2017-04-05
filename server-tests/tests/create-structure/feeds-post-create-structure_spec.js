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
                telephone: {
                    attributes: {
                        type: "tel"
                    }
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
  .expectJSONTypes({
      structure: Object,
      errors: function(val){
        expect(val).toBeTypeOrNull(Array);
        console.log(val);
      }
  })
  .expectJSONTypes("structure.home_page",{
    heading: Object,
    further_info: Object
  })
.toss();