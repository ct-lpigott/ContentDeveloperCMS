var fs = require("fs");
var google = require("googleapis");
var googleAuth = require("google-auth-library");

var clientSecretData = JSON.parse(fs.readFileSync("./google/client_secret.json"));
var redirectURL = process.env.GOOGLE_OAUTH_REDIRECT_URL;

var auth = new googleAuth();


function generateNewOAuth2Client(){
  var newOAuth2Client = new auth.OAuth2(
    clientSecretData.web.client_id,
    clientSecretData.web.client_secret,
    redirectURL
  );
  return newOAuth2Client;
}

module.exports = {
  oauth2Client: generateNewOAuth2Client(),
  generateOAuthUrl: function(){
    var newOAuth2Client = generateNewOAuth2Client();
    var oauthURL = newOAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
        ]
    });
    return oauthURL;
  }
};
  

