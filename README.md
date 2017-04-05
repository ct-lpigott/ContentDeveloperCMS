# Content Developer CMS
## Lanugage and platform agnostic content management system

Full Documentation available at [https://contentdevelopercms.eu/documentation](https://contentdevelopercms.eu/documentation)

* [How it Works](#how-it-works)
* [Rules](#rules)
* [Defaults](#defaults)
* [API Access](#api-access)
## How it works
![alt text](https://contentdevelopercms.eu/documentation/img/how-it-works.jpg "Content Developer CMS - How it Works")

* __You write the JSON__ that defines the structure for a project
* HTML inputs are generated in the Content Management System, to allow __users to add/update content__, as per the structure you defined
* The output of this content is a __JSON object__, that can be accessed through a HTTPS URL request
* The content created through this Content Management System is __not specifc to any platform__. The HTML-like references when defining a projects structure (such as input types, and keywords such as maxlength etc) is purely so that you don't have to learn a whole new range of terminology
* __All input types are supported__, such as "text", "number", "tel", "color", "date", "time" etc. (Note - not all input types are guaranteed to work across all browsers, so if in doubt, stick to the basics)
* When you create a new project, a __Google Drive folder__ is automatically created. This is where any image you upload to the project will be stored
* Every time you make a change to the structure or content of a project, a commit is made to the projects local __Git repository__
* You can roll back to a previous commit at any time
* Every project has three __default access levels__: Administrator (can update structure and content), Content Editor (can update content) and View Only (can only view content)
* __Custom access levels__ can be created, each with a unique number (or int, as it is referred to in the API), to allow more restricted access to some users. By default, all custom access levels are granted Content Editor permissions
* By defining a __"no_access" property__, with an array of access level ints, on any object in the projects structure, you can prevent a user with this access level from being able to edit this content. In fact, they wont even be able to see it when they log in to edit the project
* __Custom CSS__ can be added by administrators in the __settings__ panel, to control the style of the __content__ view for all access levels
* Every input is contained within an __&lt;app-collection-item&gt;__ container, which has classes automatically applied to it, depending on the items encapsulation path i.e. the input for ```{"contact_details": {"address":"LIT Clonmel"}}``` is contained within __&lt;app-collection-item class="contact_details address"&gt;__
* The Content Management System is built on top of a __REST API__, and so content can be dynamically added/updated/deleted through calls to the endpoints defined in the [API Documentation](https://contentdevelopercms.eu/documentation/api.html)
* Project settings
	* __Only Administators__ of a project (access level 1) will have __access to all settings__ for a project i.e. to update allowed origins, delete the project etc
	* The only settings that Content Editors (access level 2) are able to access are the name of the project, add/remove/update collaborators on a project, and add/remove/update access levels for a project
	* All other access levels (level 3 onwards) have no access to project settings
	
## Rules
* All objects in a projects structure must contain either an __items__ property or an __attributes__ property
          ```
{
	"books":{
		"items":{}
	},
	"username":{
		"attributes":{}
	}
}
          ``` 
        
* All properties within an items object must have an __items__ property or an __attributes__ property
        ```
{
	"books":{
		"items":{
			"title":{
				"attributes":{
					"type":"text"
				}
			},
			"authors":{
				"items":{
					"first_name":{
						"attributes":{
							"type": "text"
						}
					}
				}
			}
		}
	}
}``` 
* Any object that has an __items__ property, must also include a __type__ property, with a value of "object" or "array"
        ```
{
	"books":{
		"type":"array",
			"items":{
				"title":{
					"attributes":{
						"type":"text"
					}
				}
			}
		}
	}
}``` 
* An __attributes__ property can be an empty object, but must be present if the item is to have an input
        ```
{
	"username":{
		"attributes":{}
	}
}```
* All property names in the project structure should be __lowercase__ and use __underscores__ in place of spaces. These will be replaced in the CMS view i.e "my_books" will be displayed as "My Books"
          ```
{
	"my_books":{
		"type":"array",
			"items":{
				"title":{
					"attributes":{
						"type":"text"
					}
				}
			}
		}
	}
}```
* The __only attributes allowed__ are "class", "id", "type", "required", "maxlength", "max", "min", "alt" and "options" (for use with "select" input types)
            ```
{
	"username":{
		"attributes":{
			"class": "myusernameinput red",
			"type": "text",
			"maxlength": 15
		}
	},
	"category":{
		"attributes":{
			"required": "required",
			"options": [ "fiction", "non-fiction", "other" ]
		}
	}
}```
* The __only properties allowed__ on a structure object are "attributes", "items", "input_type", "type", "no_access" (where no_access defines an array of access levels that are not allowed to edit certain levels of content)
            ```
{
	"username":{
		"attributes":{},
		"no_access": [ 5, 6, 8]
	}
}```

## Defaults
* Any item that does not have an __attributes__ property will not have a HTML input associated with it
* Any item that has an __attributes__ property, but does not have a __input_type__ property, will default to a HTML input
* Any item that has an __attributes__ property which does not contain a __type__ property, will default to type "text"
* Any item that does not have a __no_access__ property will be editable by all collaborators (except for access level 3, which have View Only access)
* By default, all __custom access levels__ are granted Content Editor permissions
* By default, all origins are allowed __read access__, while no origins are allowed __update access__

## API Access
* To use the API, you must first source your __public_auth_token__ from the settings panel of the relevant project
* This token will be __unique__ to your relationship with that project, and so cannot be reused across projects (or collaborators)
* To limit the "read" access of a project, enter a comma seperated list of origins in the __read_origins__ option on the settings page
* To limit the "update" access of a project, enter a comma seperated list of origins in the __update_origins__ option on the settings page
* By default, all origins are allowed read access, while no origins are allowed update access
* Once you have your __public_auth_token__ and have given the origin the __appropriate access__, you're ready to start making requests to the API
* Now you just need to figure out which endpoint you want to make the request to, by looking at the [API Documentation](https://contentdevelopercms.eu/documentation/api.html) to see what properties/parameters it requires
* When creating your HTTPS request, in whatever language or platform you choose, make sure to add the __public_auth_token__ as a header on the request before sending it
* That's it! You're all set up and ready to make requests to the API
* If at any time you feel that your __public_auth_token__ has become compromised, or you just want to revoke access for all existing connections using it, you can regenerate a new token at any time in the settings panel of the project (Note - this cannot be undone)

&copy; [Laura Pigott](http://www.pigottlaura.com) 2017

_____________________________________________________

_The background image used in the app was sourced from "https://pixabay.com/en/computer-smartphone-online-digital-1231889/" and is "Free for commercial use, No attribution required" under CC0 Public Domain_