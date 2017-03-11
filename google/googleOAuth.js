// Requiring the file system module, so that this module
// can have access to the file system (to read in the credentials
// of the projects client secret keys)
var fs = require("fs");

// Requiring the custom database connection module, so that the one
// connection to the database can be reused throughout the application.
var dbconn = require("../database/connection.js");

// Requiring the Google auth library, which will be used to 
// generate new OAuth2 clients (to be used to authorise, and
// make requests of the Google APIs throughout the server)
var googleAuth = require("google-auth-library");

var google = require("googleapis");

var drive = google.drive("v3");

var fs = require("fs");

// Storing the client secret data for the servers Google projects
// so that they can be used when setting up new OAuth2Clients
var clientSecretData = JSON.parse(fs.readFileSync("./google/client_secret.json"));

// Setting the redirectURL (which will be used by the OAuth2
// request to return a user to the server following a successful login)
// based on that specified in the environment variable i.e. this may
// vary depending on where the server is running
var redirectURL = process.env.SITE_URL + "/google/oauthRedirectURL";

// Setting the export of this module to be equal to an object, which 
// contains two methods - one to generate a new OAuth URL, and the other
// to generate new OAuth2Clients
module.exports = {
  generateOAuthUrl: function(cb){
    // Generating a new OAuth2Client using the other method defined in this object
    this.generateOAuth2Client(null, function(oauth2Client){
      // Creating a new OAuthURL (which the user will use to access the login page
      // on Google to authorise the server to access their account) by using the built
      // in method of the Google Auth libraries OAuth2Client, passing in the access type
      // and API scope that this login would authorise
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
  },
  generateOAuth2Client: function(userID, cb){
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
    
    if(userID == null){
      newOAuth2Client.redirectUri_ = redirectURL;
      cb(newOAuth2Client);
    } else {
      dbconn.query("SELECT google_access_token, google_refresh_token FROM User WHERE id=" + userID, function(err, rows, fields){
        if(err){
          console.log(err);
        } else {
          if(rows.length > 0){
            var userAccessToken = JSON.parse(rows[0].google_access_token);
            userAccessToken.refresh_token = rows[0].google_refresh_token;
            newOAuth2Client.credentials = userAccessToken;
            cb(newOAuth2Client);
          } else {
            console.log("User could not be found");
          }
        }
      });
    }
  },
  createNewProjectFolder: function(projectName, userID, cb){
    console.log("About to create new folder");
    this.generateOAuth2Client(userID, function(oauth2Client){
      var folderMeta = {
        "name" : "ContentDeveloper_" + projectName,
        "mimeType" : "application/vnd.google-apps.folder"
      };

      drive.files.create({
        auth: oauth2Client,
        resource: folderMeta,
        fields: "id"
      }, function(error, file) {
        if(error) {
          console.log(error);
        } else {
          console.log("Successfully created folder. Id: = " + file.id);
          makeFolderPublic(file.id, oauth2Client, function(){
            cb(file.id);
          });
        }
      });
    });
  },
  uploadMediaItem: function(fileInfo, mediaFolderId, userID, cb){  
    this.generateOAuth2Client(userID, function(oauth2Client){
      if(mediaFolderId != null){
        var fileMetadata = {
          "name": fileInfo.originalname,
          parents: [ mediaFolderId ]
        };
        
        var mediaItem = {
          mimeType: fileInfo.mimetype,
          body: fs.createReadStream(fileInfo.path)
        };
        
        drive.files.create({
          auth: oauth2Client,
          resource: fileMetadata,
          media: mediaItem,
          fields: "id"
        }, function(err, uploadedFile) {
          if(err) {
            console.log(err);
          } else {
            console.log("File successfully uploaded", uploadedFile.id);
            fs.unlink(fileInfo.path, function(err){
              if(err){
                console.log(err);
              }
            });
            cb(uploadedFile.id);
          }
        });
      }
    });    
  },
  addUserToMediaFolder: function(mediaFolderId, userEmailAddress, userID, role, cb){
    this.generateOAuth2Client(userID, function(oauth2Client){
      drive.permissions.create({
        auth: oauth2Client,
        resource: {
          "type": "user",
          "role": role,
          "emailAddress": userEmailAddress
        },
        fileId: mediaFolderId,
        fields: "id",
      }, function(err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log("User successfully added to media folder: " + res.id);
          cb(String(res.id));
        }
      });
    });
  },
  removeUserFromMediaFolder: function(mediaFolderId, userPermissionId, userID, cb){
    if(userPermissionId != null){
      this.generateOAuth2Client(userID, function(oauth2Client){
        dbconn.query("SELECT media_folder_permission_id")
        drive.permissions.delete({
          auth: oauth2Client,
          fileId: mediaFolderId,
          permissionId: userPermissionId
        }, function(err, res) {
          if (err) {
            console.log(err);
          } else {
            console.log("User successfully removed from media folder");
            cb();
          }
        });
      });
    } else {
      cb();
    }    
  },
  getAllProjectImages: function(projectID, mediaFolderId, userID, numFiles=10, nextPageToken=null, cb){
    this.generateOAuth2Client(userID, function(oauth2Client){
      nextPageToken = nextPageToken == "null" ? null : nextPageToken;
      numFiles = isNaN(numFiles) ? null : numFiles;

      var getFields = "id, name, mimeType";
      var queryString = "'" + mediaFolderId + "' in parents";
      queryString += " and trashed = false";
      
      drive.files.list({
        auth: oauth2Client,
        q: queryString,
        pageSize: numFiles,
        pageToken: nextPageToken,
        fields: "nextPageToken, files(" + getFields + ")"
      }, function(err, results){      
        if(results != null) {
          for(var file of results.files){
            file.url = "https://drive.google.com/uc?id=" + file.id;
          }
          cb(results);
        } else {
          cb(null);
        }
      });
    });
  }
};

function makeFolderPublic(fileId, oauth2Client, cb) {
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