define({ "api": [
  {
    "version": "1.0.0",
    "type": "post",
    "url": "/feeds/:projectID?action=accessLevels",
    "title": "Create a new access level",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "access_level_name",
            "description": "<p>Name for the new access level</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "access_level_int",
            "description": "<p>Int value for the new access level (needs to be unique to the project)</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=accessLevels  <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br> <strong>REQUEST BODY:</strong> { access_level_name: &quot;Photographer&quot;, access_level_int: 5 }</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     success: true\n}",
          "type": "json"
        }
      ]
    },
    "name": "Create_Access_Level",
    "group": "Access_Levels",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Access_Levels"
  },
  {
    "version": "1.0.0",
    "type": "delete",
    "url": "/feeds/:projectID?action=accessLevels",
    "title": "Delete access level",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "access_level_int",
            "description": "<p>Number of the access level to be deleted</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=accessLevels <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br> <strong>REQUEST BODY:</strong> { access_level_int: 5 }</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     success: true\n}",
          "type": "json"
        }
      ]
    },
    "name": "Delete_Access_Level",
    "group": "Access_Levels",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Access_Levels"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/feeds/:projectID?action=accessLevels",
    "title": "Get project access levels",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=accessLevels <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br></p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     access_levels: [\n         { \n             access_level_name: \"Administrator\",\n             access_level_int: 1,\n             in_use: true\n         }\n     ]\n}",
          "type": "json"
        }
      ]
    },
    "name": "Get_Access_Levels",
    "group": "Access_Levels",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Access_Levels"
  },
  {
    "version": "1.0.0",
    "type": "put",
    "url": "/feeds/:projectID?action=accessLevels",
    "title": "Update access level name",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "access_level_int",
            "description": "<p>Number of the access level to be updated</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "access_level_name",
            "description": "<p>New name for the access level</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=accessLevels <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br> <strong>REQUEST BODY:</strong> { access_level_int: 5, access_level_name: &quot;Shop Assistant&quot; }</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     success: true\n}",
          "type": "json"
        }
      ]
    },
    "name": "Update_Access_Level_Name",
    "group": "Access_Levels",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Access_Levels"
  },
  {
    "version": "1.0.0",
    "type": "post",
    "url": "/feeds/:projectID?action=collaborators",
    "title": "Add a collaborator to a project",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>Email address of the collaborator to be added</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "access_level_int",
            "description": "<p>Requested access level</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=collaborators <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br> <strong>REQUEST BODY:</strong> { email: &quot;pigottlaura@gmail.com&quot;, access_level_int: 2 }</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     success: true\n}",
          "type": "json"
        }
      ]
    },
    "name": "Add_Collaborator",
    "group": "Collaborators",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Collaborators"
  },
  {
    "version": "1.0.0",
    "type": "delete",
    "url": "/feeds/:projectID?action=collaborators",
    "title": "Remove a collaborator from a project",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "collaborator_id",
            "description": "<p>ID of the collaborator to be removed</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=collaborators <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br> <strong>REQUEST BODY:</strong> { collaborator_id: 305 }</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     success: true\n}",
          "type": "json"
        }
      ]
    },
    "name": "Delete_Collaborator",
    "group": "Collaborators",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Collaborators"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/feeds/:projectID?action=collaborators",
    "title": "Get all collaborators for a project",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=collaborators <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br></p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "collaborators: [\n     {\n         display_name: {string},\n         user_id: {int},\n         access_level_int: {int},\n         access_level_name: {string}\n     }\n]",
          "type": "json"
        }
      ]
    },
    "name": "Get_Collaborators",
    "group": "Collaborators",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Collaborators"
  },
  {
    "version": "1.0.0",
    "type": "put",
    "url": "/feeds/:projectID?action=collaborators",
    "title": "Update a collaborators access level to a project",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "collaborator_id",
            "description": "<p>User id of the collaborator to be updated</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "access_level_int",
            "description": "<p>Requested access level</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=collaborators <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br> <strong>REQUEST BODY:</strong> { collaborator_id: 305, access_level_int: 3 }</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     success: true\n}",
          "type": "json"
        }
      ]
    },
    "name": "Update_Collaborator",
    "group": "Collaborators",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Collaborators"
  },
  {
    "version": "1.0.0",
    "type": "post",
    "url": "/feeds/:projectID?action=css",
    "title": "Create or append to custom css",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "custom_css",
            "description": "<p>Custom css rules to be added</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=css <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br> <strong>REQUEST BODY:</strong> { custom_css: &quot;h2:{color:red;}&quot; }</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     success: true\n}",
          "type": "json"
        }
      ]
    },
    "name": "Create_CustomCss",
    "group": "Custom_CSS",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Custom_CSS"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/feeds/:projectID?action=css",
    "title": "Get custom css",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=css <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br></p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     custom_css: \"h2{color:red;}\"  \n}",
          "type": "json"
        }
      ]
    },
    "name": "Get_Custom_Css",
    "group": "Custom_CSS",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Custom_CSS"
  },
  {
    "version": "1.0.0",
    "type": "put",
    "url": "/feeds/:projectID?action=css",
    "title": "Update custom content css",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "custom_css",
            "description": "<p>Custom css rules to be added</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=css <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br> <strong>REQUEST BODY:</strong> { custom_css: &quot;h2:{color:red;}&quot;}</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     success: true \n}",
          "type": "json"
        }
      ]
    },
    "name": "Update_Custom_Css",
    "group": "Custom_CSS",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Custom_CSS"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/feeds/:projectID?action=mediaItems",
    "title": "Get all media items for a project",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=mediaItems <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br></p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     media_items: [\n         {\n             id: \"0Bzkz0DzYRLAuUHRzVmFXZFF3dDQ\",\n             name: \"thumb.jpg\",\n             mimeType: \"image/jpeg\",\n             url: \"https://drive.google.com/uc?id=0Bzkz0DzYRLAuUHRzVmFXZFF3dDQ\"\n         }\n     ]\n     \n}",
          "type": "json"
        }
      ]
    },
    "name": "Get_Media_Items",
    "group": "Media_Items",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Media_Items"
  },
  {
    "version": "1.0.0",
    "type": "post",
    "url": "/feeds/:projectID?action=mediaItems",
    "title": "Upload a media item",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          },
          {
            "group": "Parameter",
            "type": "file",
            "optional": false,
            "field": "file",
            "description": "<p>Media item file to be uploaded</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=mediaItems <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br> <strong>REQUEST BODY:</strong> { file: {file} }</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     media_item_url: https://drive.google.com/uc?id=0Bzkz0DzYRLAuUHRzVmFXZFF3dDQ\n}",
          "type": "json"
        }
      ]
    },
    "name": "Upload_Media_Item",
    "group": "Media_Items",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Media_Items"
  },
  {
    "version": "1.0.0",
    "type": "post",
    "url": "/feeds/:projectID/:itemPath",
    "title": "Create a new content item",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": ":itemPath",
            "description": "<p>Encapsulation path to item within the project</p>"
          },
          {
            "group": "Parameter",
            "type": "any",
            "optional": false,
            "field": "content",
            "description": "<p>Content to be added to the project (datatype depends on project structure)</p>"
          }
        ]
      }
    },
    "name": "Create_New_Item_Content",
    "group": "Project_Content",
    "filename": "routes/components/feeds/feeds-create.js",
    "groupTitle": "Project_Content"
  },
  {
    "version": "1.0.0",
    "type": "delete",
    "url": "/feeds/:projectID/:itemPath",
    "title": "Delete a content item",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": ":itemPath",
            "description": "<p>Encapsulation path to item within the project</p>"
          }
        ]
      }
    },
    "name": "Delete_Content_Item",
    "group": "Project_Content",
    "filename": "routes/components/feeds/feeds-delete.js",
    "groupTitle": "Project_Content"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/feeds/:projectID/:itemPath",
    "title": "Get an items content",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": ":itemPath",
            "description": "<p>Encapsulation path to item within the project</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"structure\"",
              "\"content\""
            ],
            "optional": true,
            "field": "include",
            "description": "<p>To include the structure and content of the item</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "startAt",
            "description": "<p>Index position to start at (if content is array)</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "numItems",
            "description": "<p>Number of items to return (if content is array)</p>"
          }
        ]
      }
    },
    "name": "Get_Item_Content",
    "group": "Project_Content",
    "filename": "routes/components/feeds/feeds-read.js",
    "groupTitle": "Project_Content"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/feeds/:projectID",
    "title": "Get entire project content",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"structure\"",
              "\"content\"",
              "\"history\""
            ],
            "optional": true,
            "field": "include",
            "description": "<p>To include the structure, content and commit history of the project</p>"
          }
        ]
      }
    },
    "name": "Get_Project_Content",
    "group": "Project_Content",
    "filename": "routes/components/feeds/feeds-read.js",
    "groupTitle": "Project_Content"
  },
  {
    "version": "1.0.0",
    "type": "put",
    "url": "/feeds/:projectID/:itemPath",
    "title": "Update encapsulated project content",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": ":itemPath",
            "description": "<p>Encapsulation path to item within the project</p>"
          },
          {
            "group": "Parameter",
            "type": "any",
            "optional": false,
            "field": "content",
            "description": "<p>Content to be added to the project (datatype depends on project structure)</p>"
          }
        ]
      }
    },
    "name": "Update_Encapsulated_Content",
    "group": "Project_Content",
    "filename": "routes/components/feeds/feeds-update.js",
    "groupTitle": "Project_Content"
  },
  {
    "version": "1.0.0",
    "type": "put",
    "url": "/feeds/:projectID",
    "title": "Update entire project content",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "any",
            "optional": false,
            "field": "content",
            "description": "<p>Content to be added to the project (datatype depends on project structure)</p>"
          }
        ]
      }
    },
    "name": "Update_Project_Content",
    "group": "Project_Content",
    "filename": "routes/components/feeds/feeds-update.js",
    "groupTitle": "Project_Content"
  },
  {
    "version": "1.0.0",
    "type": "post",
    "url": "/feeds?action=createProject",
    "title": "Create a new project",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "project_name",
            "description": "<p>Name for the new project</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds?action=createProject <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br> <strong>REQUEST BODY:</strong> { project_name: &quot;My New Project&quot; }</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     new_project_id: 652\n}",
          "type": "json"
        }
      ]
    },
    "name": "Create_Project",
    "group": "Project_Details",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Project_Details"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/feeds/:projectID?action=cache",
    "title": "Get maximum cache age",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=cache <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br></p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     max_cache_age: 25000\n}",
          "type": "json"
        }
      ]
    },
    "name": "Get_Maximum_Cache_Age",
    "group": "Project_Details",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Project_Details"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/feeds/:projectID?action=projectName",
    "title": "Get projects name",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=projectName <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br></p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     project_name: \"My New Project\"  \n}",
          "type": "json"
        }
      ]
    },
    "name": "Get_Project_Name",
    "group": "Project_Details",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Project_Details"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/feeds/:projectID?allSettings",
    "title": "Get all settings for a project",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?allSettings <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br></p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     collaborators: [\n         {\n             display_name: {string},\n             user_id: {int},\n             access_level_int: {int},\n             access_level_name: {string}\n         }\n     ],\n     access_levels: [\n         { \n             access_level_name: \"Administrator\",\n             access_level_int: 1,\n             in_use: true\n         }\n     ],\n     project_name: \"My Project\",\n     max_cache_age: 250000,\n     custom_css: \"h2:{color:red;}\"\n}",
          "type": "json"
        }
      ]
    },
    "name": "Get_Project_Settings",
    "group": "Project_Details",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Project_Details"
  },
  {
    "version": "1.0.0",
    "type": "put",
    "url": "/feeds/:projectID?action=cache",
    "title": "Update maximum cache age",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "max_cache_age",
            "description": "<p>Time in milliseconds</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=cache <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br> <strong>REQUEST BODY:</strong> { max_cache_age: 25000 }</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     success: true  \n}",
          "type": "json"
        }
      ]
    },
    "name": "Update_Maximum_CacheAge",
    "group": "Project_Details",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Project_Details"
  },
  {
    "version": "1.0.0",
    "type": "put",
    "url": "/feeds/:projectID?action=projectName",
    "title": "Update projects name",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "project_name",
            "description": "<p>New name for the project</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=projectName <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br> <strong>REQUEST BODY:</strong> { project_name: &quot;My Updated Project Name&quot; }</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     success: true\n}",
          "type": "json"
        }
      ]
    },
    "name": "Update_Project_Name",
    "group": "Project_Details",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Project_Details"
  },
  {
    "version": "1.0.0",
    "type": "put",
    "url": "/feeds/:projectID?allSettings",
    "title": "Update all settings for a project",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "project_name",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "max_cache_age",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "custom_css",
            "description": ""
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/19456?allSettings <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br> <strong>REQUEST BODY:</strong> { project_name: &quot;My New Project Name&quot;, max_cache_age: 250000, custom_css: &quot;h2:{color:red;}&quot; }</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     project_name: true,\n     max_cache_age: true,\n     custom_css: true\n}",
          "type": "json"
        }
      ]
    },
    "name": "Update_Project_Settings",
    "group": "Project_Details",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Project_Details"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/feeds/:projectID?include=history",
    "title": "Get commit history of project",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"structure\"",
              "\"content\"",
              "\"history\""
            ],
            "optional": true,
            "field": "include",
            "description": "<p>To include the structure, content and commit history of the project</p>"
          }
        ]
      }
    },
    "name": "Get_Project_Commit_History",
    "group": "Project_History",
    "filename": "routes/components/feeds/feeds-read.js",
    "groupTitle": "Project_History"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/feeds/:projectID?action=previewCommit&historyOf=structure&commitHash=***",
    "title": "Preview contents of a file at a specific commit",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"structure\"",
              "\"content\""
            ],
            "optional": false,
            "field": "historyOf",
            "description": "<p>To get the contents for the history of the content or structure</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "commitHash",
            "description": "<p>The hash of the commit to be accessed</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "public_auth_token",
            "description": "<p>Public authentication token for the project (unique to all collaborators)</p>"
          }
        ]
      }
    },
    "description": "<p><strong>EXAMPLE REQUEST:</strong> https://contentdevelopercms.eu/feeds/198729?action=previewCommit&amp;historyOf=structure&amp;commitHash=ca82a6dff817ec66f44342007202690a93763949 <br> <strong>REQUEST HEADER:</strong> { public_auth_token: 6bb3dfbb7d41c20bdb622e6a2541490879693355 } <br></p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     commit_structure: {object}\n}",
          "type": "json"
        }
      ]
    },
    "name": "Preview_Commit_Content",
    "group": "Project_History",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Project_History"
  },
  {
    "version": "1.0.0",
    "type": "post",
    "url": "/feeds/:projectID/:itemPath",
    "title": "Create a new item structure",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": ":itemPath",
            "description": "<p>Encapsulation path to item within the project</p>"
          },
          {
            "group": "Parameter",
            "type": "json",
            "optional": false,
            "field": "structure",
            "description": "<p>JSON to be added to to the projects structure</p>"
          }
        ]
      }
    },
    "name": "Create_New_Item_Structure",
    "group": "Project_Structure",
    "filename": "routes/components/feeds/feeds-create.js",
    "groupTitle": "Project_Structure"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/feeds/:projectID/:itemPath?include=structure",
    "title": "Get an items structure",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": ":itemPath",
            "description": "<p>Encapsulation path to item within the project</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"structure\"",
              "\"content\""
            ],
            "optional": true,
            "field": "include",
            "description": "<p>To include the structure and content of the item</p>"
          }
        ]
      }
    },
    "name": "Get_Item_Structure",
    "group": "Project_Structure",
    "filename": "routes/components/feeds/feeds-read.js",
    "groupTitle": "Project_Structure"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/feeds/:projectID?include=structure,content,history",
    "title": "Get entire project structure",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"structure\"",
              "\"content\"",
              "\"history\""
            ],
            "optional": true,
            "field": "include",
            "description": "<p>To include the structure, content and commit history of the project</p>"
          }
        ]
      }
    },
    "name": "Get_Project_Structure",
    "group": "Project_Structure",
    "filename": "routes/components/feeds/feeds-read.js",
    "groupTitle": "Project_Structure"
  },
  {
    "version": "1.0.0",
    "type": "put",
    "url": "/feeds/:projectID",
    "title": "Update entire project structure",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": ":projectID",
            "description": "<p>Projects unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "json",
            "optional": false,
            "field": "structure",
            "description": "<p>JSON to update the projects structure</p>"
          }
        ]
      }
    },
    "name": "Update_Project_Structure",
    "group": "Project_Structure",
    "filename": "routes/components/feeds/feeds-update.js",
    "groupTitle": "Project_Structure"
  }
] });
