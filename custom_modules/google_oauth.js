// Requiring the file system module, so that this module
// can have access to the file system (to read in the credentials
// of the projects client secret keys)
var fs = require("fs");

// Including the dbQuery module, which contains prepared queries to the 
// database, which ensures that all data used within them is sanitised and
// escaped before being included in a statement
var dbQuery = require("./database_query");

// Requiring the Google auth library, which will be used to 
// generate new OAuth2 clients (to be used to authorise, and
// make requests of the Google APIs throughout the server)
var googleAuth = require("google-auth-library");

// Accessing version 3 of the Google Drive API through the 
// googleapis module, which will be used to make requests
// to the Google Drive API
var drive = require("googleapis").drive("v3");

// Storing the client secret data for the servers Google projects
// so that they can be used when setting up new OAuth2Clients.
// Completing this task synchronously, as it will only
// be done once at start up.
var clientSecretData = JSON.parse(fs.readFileSync("./configuration/google/client_secret.json"));

// Setting the redirectURL (which will be used by the OAuth2
// request to return a user to the server following a successful login)
// based on that specified in the environment variable i.e. this may
// vary depending on where the server is running
var redirectURL = process.env.SITE_URL + "/google/oauthRedirectURL";

function generateOAuthUrl (cb){
  // Generating a new OAuth2Client using the other method defined in this object
  generateOAuth2Client(null, function(oauth2Client){
    // Creating a new OAuthURL (which the user will use to access the login page
    // on Google to authorise the server to access their account) by using the built
    // in method of the Google Auth libraries OAuth2Client, passing in the access type
    // and API scope that this login would authorise. Setting the prompt to 
    // "select_account", so that the user does not automatically have to log in
    // with the Google account logged into their browser/device at the time
    var oauthURL = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
        ],
        prompt: "select_account"
    });

    // Returning the OAuth URL to the caller
    cb(oauthURL);
  });
}

function generateOAuth2Client(currentUserID, cb){
  // Generating a new Auth object, using the Google Auth library
  var auth = new googleAuth();

  // Creating a new OAuth2Client using the OAuth2 method of the 
  // auth object, passing in the servers client id, client secret,
  // and the redirect URL to return the user to the server following
  // successful login
  var newOAuth2Client = new auth.OAuth2(
    clientSecretData.web.client_id,
    clientSecretData.web.client_secret
  );

  if(currentUserID == null){
    // If no user id was supplied, then this client will require
    // a redirect URL (for login)
    newOAuth2Client.redirectUri_ = redirectURL;
    cb(newOAuth2Client);
  } else {
    // Getting the users access token and refresh token. Adding the refresh
    // token to the credentials, so that if the access token expires
    // during the users session, Google can automatically regenerate a new one
    dbQuery.get_User("google_access_token, google_refresh_token", currentUserID, function(err, row){
      if(row){
        // Adding the refresh token back onto the parsed access token,
        // and these details as the credentials for the request
        var userAccessToken = JSON.parse(row.google_access_token);
        userAccessToken.refresh_token = row.google_refresh_token;
        newOAuth2Client.credentials = userAccessToken;
      }
      cb(newOAuth2Client);
    });
  }
}

function createNewProjectFolder(projectName, currentUserID, cb){
  console.log("About to create new folder");
  // Generating a new OAuth2Client
  generateOAuth2Client(currentUserID, function(oauth2Client){
    // Creating meta data for the new folder i.e. giving
    // it a name, and setting it to be a folder
    var folderMeta = {
      "name" : "ContentDeveloper_" + projectName,
      "mimeType" : "application/vnd.google-apps.folder"
    };

    // Using the Google Drive API to create a new file, 
    // passing in the OAuth2Client (which contains credentials for the 
    // app, as well as the user). Requesting only the id of the new folder,
    // and the permission id of the user in the result.
    drive.files.create({
      auth: oauth2Client,
      resource: folderMeta,
      fields: "id, permissions"
    }, function(error, file) {
      if(error) {
        console.log(error);
      } else {
        console.log("Successfully created folder. Id: = " + file.id);
        // Making the folder public, so that all media items that will be uploaded
        // to it will be public aswelll
        makeFolderPublic(file.id, oauth2Client, function(){
          // Returning the id of the new folder, and the id of the users permissions
          // on this folder to the caller
          cb(file.id, file.permissions[0].id);
        });
      }
    });
  });
}

function uploadMediaItem(fileInfo, mediaFolderId, currentUserID, projectId, cb){  
  // Generating a new OAuth2Client
  generateOAuth2Client(currentUserID, function(oauth2Client){
    if(mediaFolderId != null){
      // Creating meta data for the file i.e. giving it a name, and setting its
      // parent to be the media folder id of this projects Google drive folder
      var fileMetadata = {
        "name": fileInfo.originalname,
        parents: [ mediaFolderId.toString() ]
      };
      
      // Setting the data for the media item, such as mimetype and where to 
      // load the file from (using a read stream through the file system)
      var mediaItem = {
        mimeType: fileInfo.mimetype,
        body: fs.createReadStream(fileInfo.path)
      };
      
      // Using the Google drive API to upload the file, passing
      // in the meta data (and file info) created above. Returning
      // only the id of the uploaded file in the result
      drive.files.create({
        auth: oauth2Client,
        resource: fileMetadata,
        media: mediaItem,
        fields: "id"
      }, function(err, uploadedFile) {
        if(err) {
          // If the resulting error code is 404, then the parent folder (projects
          // Google drive folder) could not be found
          if(err.code == 404){
            // Creating a new project folder (which will in turn re-add all collaborators
            // to it, with the same access levels they had previously)
            recreateProjectFolder(currentUserID, projectId, function(newFolderID){
              if(newFolderID != null){
                // Getting the function to call itself again, with the new media
                // folder id (as well as all the original arguments)
                uploadMediaItem(fileInfo, newFolderID, currentUserID, projectId, cb);
              } else {
                cb(null);
              }
            });
          } else {
            console.log(err);
            cb(null);
          }
        } else {
          console.log("File successfully uploaded", uploadedFile.id);
          // Deleting the file from the servers file system
          fs.unlink(fileInfo.path, function(err){
            if(err){
              console.log(err);
            }
          });
          // Returning the id of the new file to the caller
          cb(uploadedFile.id);
        }
      });
    }
  });    
}

function addUserToMediaFolder(currentUserID, addUserID, projectId, accessLevelInt, cb){
  // Determing the users role (permission level) for the Google Drive folder, 
  // based on their access level int
  var role = decideUserRole(accessLevelInt);  
  
  // Getting the projects media folder id, and the users email address
  // from the database
  dbQuery.get_UserProject_Project_User("p.media_folder_id, u.email_address", addUserID, projectId, function(err, row){
    if(row){
      // Generating a new OAuth2Client
      generateOAuth2Client(currentUserID, function(oauth2Client){
        // Using the Google Drive API to create a new permission for this
        // media items folder. Setting the permission for a user, with the 
        // appropriate role (either "writer" or "reader"). Requesting only
        // the id of the new permission to be returned in the result
        drive.permissions.create({
          auth: oauth2Client,
          resource: {
            "type": "user",
            "role": role,
            "emailAddress": row.email_address
          },
          fileId: row.media_folder_id,
          fields: "id"
        }, function(err, res) {
          if (err) {
            console.log(err);
            cb(false);
          } else {
            console.log("User successfully added to media folder: " + res.id);
            // Updating the users relationship with the project to the 
            // updated media folder permission id, as returned in the result
            dbQuery.update_UserProject(["media_folder_permission_id"], [res.id], currentUserID, addUserID, projectId, function(err, success){
              cb(success);
            });
          }
        });
      });
    }
  });
}

function removeUserFromMediaFolder(mediaFolderId, userPermissionId, currentUserID, cb){
  if(userPermissionId != null){
    // Generating a new OAuth2Client
    generateOAuth2Client(currentUserID, function(oauth2Client){
      // Using the Google Drive API to delete this users permissions for this
      // folder i.e. the media items folder of the project
      drive.permissions.delete({
        auth: oauth2Client,
        fileId: mediaFolderId,
        permissionId: userPermissionId
      }, function(err, res) {
        if (err) {
          console.log(err);
          cb(false);
        } else {
          console.log("User successfully removed from media folder");
          cb(true);
        }
      });
    });
  } else {
    cb();
  }    
}

function updateUserAccessToFolder(currentUserID, updateUserId, projectId, accessLevelInt, cb){
  // Determing the users role (permission level) for the Google Drive folder, 
  // based on their access level int
  role = decideUserRole(accessLevelInt);

  // Getting the media folder id, and the current permission id for this user
  // on this folder
  dbQuery.get_UserProject_Project("p.media_folder_id, up.media_folder_permission_id", updateUserId, projectId, function(err, row){
    // Generating a new OAuth2Client
    generateOAuth2Client(currentUserID, function(oauth2Client){
      // Using the Google Drive API to update this users access level.
      // Passing in the id of the media items folder, as well as the
      // users permissions id. Setting the role to the appropriate 
      // value (either "writer" or "reader")
      drive.permissions.update({
          auth: oauth2Client,
          fileId: row.media_folder_id,
          permissionId: row.media_folder_permission_id,
          resource: {
            "role": role
          },
          fields: "id"
        }, function(err, res) {
          if (err) {
              console.log(err);
            cb(false);
          } else {
            console.log("User access level successfully updated: " + res.id);
            // Updating the users relationship with the project to the 
            // updated media folder permission id, as returned in the result
            dbQuery.update_UserProject(["media_folder_permission_id"], [res.id], currentUserID, updateUserId, projectId, function(err, success){
              cb(success);
            });
          }
        });
    });
  });
}

function getAllProjectImages(projectID, mediaFolderId, currentUserID, numFiles=10, nextPageToken=null, cb){
  // Generating a new OAuth2Client
  generateOAuth2Client(currentUserID, function(oauth2Client){
    // Checking if the nextPageToken is null or has a value. This is used by 
    // Google to determine if there are "more" files to view i.e. if the
    // amount of files previously requested is less than the total number
    // of files. Allows for sequential loading of "pages" of files
    nextPageToken = nextPageToken == "null" ? null : nextPageToken;

    // Checking if the number of files value is a number
    numFiles = isNaN(numFiles) ? null : numFiles;

    // Determing what fields to get, as these will be specified
    // seperatley to the next page token
    var getFields = "id, name, mimeType";

    // Creating a query string, so that only the files that belong
    // to the projects media items folder will be returned, and
    // ensuring that they haven't been trashed (as trashed files
    // would still be returned until they are deleted permenantly
    // by the user on Google Drive)
    var queryString = "'" + mediaFolderId + "' in parents";
    queryString += " and trashed = false";
    
    // Using the Google Drive API to query the users files 
    // using the values defined above.
    drive.files.list({
      auth: oauth2Client,
      q: queryString,
      pageSize: numFiles,
      pageToken: nextPageToken,
      fields: "nextPageToken, files(" + getFields + ")"
    }, function(err, results){      
      if(results != null) {
        // Looping through all of the files, and prepending them
        // with the appropriate URL (so that they will be viewable in the browser)
        for(var file of results.files){
          file.url = "https://drive.google.com/uc?id=" + file.id;
        }
        // Returning all results to the caller, including the array of
        // files, and the nextPageToken (if one is present)
        cb(results);
      } else {
        cb(null);
      }
    });
  });
}

function makeFolderPublic(fileId, oauth2Client, cb) {
  // Using the Google drive API to create public permissions for
  // the projects folder, so that all files uploaded to it will
  // be viewable publicly. Resuing the oauth2Client used
  // in the creation of the folder, as this will still be valid.
  // Including the id of the folder, and requesting the id in
  // return (to confirm the update)
  drive.permissions.create({
    auth: oauth2Client,
    resource: {
      "type": "anyone",
      "role": "reader"
    },
    fileId: fileId,
    fields: 'id',
  }, function(error, res) {
    if (error) {
      console.log(error);
    } else {
      console.log("Successfully updated permission for: " +  res.id);
      cb();
    }
  }); 
}

// Invoked if a media item folder is deleted after project creation,
// to create a new media item folder, with all the same users
function recreateProjectFolder(currentUserID, projectId, cb){
  // Getting the projects name
  dbQuery.get_Project("project_name", projectId, function(err, row){
    if(row){
      // Creating a new folder
      createNewProjectFolder(row.project_name, currentUserID, function(newFolderID, ownerPermissionId){
        if(newFolderID != null){
          // Updating the media_folder_id of the project
          dbQuery.update_Project(["media_folder_id"], [newFolderID], currentUserID, projectId, function(err, success){
            if(success){
              // Invoking the callback, so that this folder can be used straight
              // away i.e. as a request to upload a media item will be waiting
              // on this response in order to continue
              cb(newFolderID);

              // Getting all collaborators for this project
              dbQuery.get_UserProjects_forProject("up.access_level_int, up.user_id", projectId, function(err, rows){
                if(rows){

                  // Looping through all users for this project, to add them back
                  // to the new project media items folder
                  for(var i=0; i<rows.length; i++){

                    if(rows[i].user_id == currentUserID){
                      // If this is the current user, then they will have automatically been
                      // granted permissions on this folder when it was created, so just
                      // updating their media folder permission id on their relationship
                      // with the project
                      dbQuery.update_UserProject(["media_folder_permission_id"], [ownerPermissionId], currentUserID, currentUserID, projectId, function(err, success){});
                    } else {
                      // Adding this user to the new media folder. The role they will be 
                      // granted will be determined based on their access level int
                      addUserToMediaFolder(currentUserID, rows[i].user_id, projectId, rows[i].access_level_int, function(success){
                        if(success){
                          console.log("User readded to project folder");
                        }
                      })
                    }
                  }
                }
              });
            } else {
              cb(null);
            }
          });
        } else {
          cb(null);
        }
      });
    } else {
      cb(null);
    }
  })
}

// Deciding what role a user should have
function decideUserRole(accessLevelInt){
  // Users with access level int 3 are "view only", and will only be
  // granted "reader" access, while all other users will be granted 
  // "writer" access
  var role = accessLevelInt == 3 ? "reader" : "writer";

  // Returning the appropriate role to the caller
  return role;
}

// Setting the module exports to be an object, with all of the functions
// that will be used outside of this module (some functions will remain
// private and will not be included)
module.exports = {
  generateOAuthUrl: generateOAuthUrl,
  generateOAuth2Client: generateOAuth2Client,
  createNewProjectFolder: createNewProjectFolder,
  uploadMediaItem: uploadMediaItem,
  addUserToMediaFolder: addUserToMediaFolder,
  removeUserFromMediaFolder: removeUserFromMediaFolder,
  updateUserAccessToFolder: updateUserAccessToFolder,
  getAllProjectImages: getAllProjectImages
};