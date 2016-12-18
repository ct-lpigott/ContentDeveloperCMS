var fs = require("fs");
var google = require("googleapis");
var googleAuth = require("google-auth-library");

var clientSecretData = JSON.parse(fs.readFileSync("./google/client_secret.json"));
var redirectURL = "http://contentdevelopercms.azurewebsites.net/google/oauthRedirectURL";

var auth = new googleAuth();
var oauth2Client = new auth.OAuth2(
  clientSecretData.web.client_id,
  clientSecretData.web.client_secret,
  redirectURL
);

module.exports = oauth2Client;

