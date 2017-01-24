// Requiring the file system module, so that this module
// can have access to the file system (to read in the credentials
// of the projects client secret keys)
var fs = require("fs");

// Requiring the Google auth library, which will be used to 
// generate new OAuth2 clients (to be used to authorise, and
// make requests of the Google APIs throughout the server)
var googleAuth = require("google-auth-library");

// Storing the client secret data for the servers Google projects
// so that they can be used when setting up new OAuth2Clients
var clientSecretData = JSON.parse(fs.readFileSync("./google/client_secret.json"));

// Setting the redirectURL (which will be used by the OAuth2
// request to return a user to the server following a successful login)
// based on that specified in the environment variable i.e. this may
// vary depending on where the server is running
var redirectURL = process.env.GOOGLE_OAUTH_REDIRECT_URL;

// Setting the export of this module to be equal to an object, which 
// contains two methods - one to generate a new OAuth URL, and the other
// to generate new OAuth2Clients
module.exports = {
  generateOAuthUrl: function(){
    // Generating a new OAuth2Client using the other method defined in this object
    var newOAuth2Client = this.generateOAuth2Client();

    // Creating a new OAuthURL (which the user will use to access the login page
    // on Google to authorise the server to access their account) by using the built
    // in method of the Google Auth libraries OAuth2Client, passing in the access type
    // and API scope that this login would authorise
    var oauthURL = newOAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
        ]
    });

    // Returning the OAuth URL to the caller
    return oauthURL;
  },
  generateOAuth2Client: function(){
    // Generating a new Auth object, using the Google Auth library
    var auth = new googleAuth();

    // Creating a new OAuth2Client using the OAuth2 method of the 
    // auth object, passing in the servers client id, client secret,
    // and the redirect URL to return the user to the server following
    // successful login
    var newOAuth2Client = new auth.OAuth2(
      clientSecretData.web.client_id,
      clientSecretData.web.client_secret,
      redirectURL
    );

    // Returning the new OAuth2Client to the caller
    return newOAuth2Client;
  }
};