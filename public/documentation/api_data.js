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
            "field": "access_level_name",
            "description": "<p>Name for the new access level</p>"
          }
        ]
      }
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
            "type": "int",
            "optional": false,
            "field": "access_level_int",
            "description": "<p>Number of the access level to be deleted</p>"
          }
        ]
      }
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
          }
        ]
      }
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
            "field": "email",
            "description": "<p>Email address of the collaborator to be added</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "accessLevelInt",
            "description": "<p>Requested access level</p>"
          }
        ]
      }
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
            "type": "int",
            "optional": false,
            "field": "collaboratorID",
            "description": "<p>ID of the collaborator to be removed</p>"
          }
        ]
      }
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
          }
        ]
      }
    },
    "name": "Get_Collaborators",
    "group": "Collaborators",
    "filename": "routes/components/feeds/feeds-actions.js",
    "groupTitle": "Collaborators"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/feeds?action=collaborators",
    "title": "Get projects that current user is a collaborator on",
    "name": "Get_User_Projects",
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
            "field": "collaboratorID",
            "description": "<p>User id of the collaborator to be updated</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "accessLevelInt",
            "description": "<p>Requested access level</p>"
          }
        ]
      }
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
            "field": "custom_css",
            "description": "<p>Custom css rules to be added</p>"
          }
        ]
      }
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
          }
        ]
      }
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
            "field": "custom_css",
            "description": "<p>Custom css rules to be added</p>"
          }
        ]
      }
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
          }
        ]
      }
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
            "type": "file",
            "optional": false,
            "field": "file",
            "description": "<p>Media item file to be uploaded</p>"
          }
        ]
      }
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
            "description": "<p>Name for the new proejct</p>"
          }
        ]
      }
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
          }
        ]
      }
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
          }
        ]
      }
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
          }
        ]
      }
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
            "type": "int",
            "optional": false,
            "field": "max_cache_age",
            "description": "<p>Time in milliseconds</p>"
          }
        ]
      }
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
            "field": "project_name",
            "description": "<p>New name for the project</p>"
          }
        ]
      }
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
    "type": "post",
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
          }
        ]
      }
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
