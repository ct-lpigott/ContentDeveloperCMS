// Requiring the nodemailer module, to build and send emails
var nodemailer = require('nodemailer');

// Requiring the pug module, to use templates to create the emails
var pug = require('pug');

// Setting up the transporter for sending the emails using
// a Gmail account, with the credentials stored in
// env variables
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send email, used by all other functions in this module
function sendEmail(to, subject, htmlBody){
    if(process.env.DEBUG == "true"){
        // If the app is running in debug mode, then no need to send the
        // email, just log it to the console
        console.log(htmlBody);
    } else {
        // Creating a mail options object, with the details supplied
        // to the function
        var mailOptions = {
            from: "'Content Developer' <" + process.env.EMAIL_ADDRESS + ">",
            to: to,
            subject: subject,
            html: htmlBody
        };

        // Sending the email
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email successfully sent: " + info.response);
            }
        });
    }
}

function addedToProject(userEmail, userDisplayName, projectName){
    // Compiling the appropriate tempalte file
    var addedToProjectTemplate = pug.compileFile("./views/emails/added_to_project.pug");
    // Rendering the template file with the details passed to the function
    var emailContent = addedToProjectTemplate({
        userEmail: userEmail,
        userDisplayName: userDisplayName,
        projectName: projectName,
        siteUrl: process.env.SITE_URL
    });
    // Calling the send email function (as defined above)
    sendEmail(userEmail, "Added as Collaborator", emailContent);
}

function accessLevelChanged(userEmail, userDisplayName, projectName, accessLevel){
    // Compiling the appropriate tempalte file
    var accessLevelChangedTemplate = pug.compileFile("./views/emails/access_level_changed.pug");
    // Rendering the template file with the details passed to the function
    var emailContent = accessLevelChangedTemplate({
        userEmail: userEmail,
        userDisplayName: userDisplayName,
        projectName: projectName,
        accessLevel: accessLevel,
        siteUrl: process.env.SITE_URL
    });
    // Calling the send email function (as defined above)
    sendEmail(userEmail, "Access Level Changed", emailContent);
}

function removedFromProject(userEmail, userDisplayName, projectName){
    // Compiling the appropriate tempalte file
    var removedFromProjectTemplate = pug.compileFile("./views/emails/removed_from_project.pug");
    // Rendering the template file with the details passed to the function
    var emailContent = removedFromProjectTemplate({
        userEmail: userEmail,
        userDisplayName: userDisplayName,
        projectName: projectName,
        siteUrl: process.env.SITE_URL
    });
    // Calling the send email function (as defined above)
    sendEmail(userEmail, "Removed as Collaborator", emailContent);
}

function projectDeleted(userEmail, userDisplayName, projectName){
    // Compiling the appropriate tempalte file
    var projectDeletedTemplate = pug.compileFile("./views/emails/project_deleted.pug");
    // Rendering the template file with the details passed to the function
    var emailContent = projectDeletedTemplate({
        userEmail: userEmail,
        userDisplayName: userDisplayName,
        projectName: projectName,
        siteUrl: process.env.SITE_URL
    });
    // Calling the send email function (as defined above)
    sendEmail(userEmail, "Project Deleted", emailContent);
}

// Setting the module exports to be an object, with all of the functions
// that will be used outside of this module (some functions will remain
// private and will not be included)
module.exports = {
    addedToProject: addedToProject,
    accessLevelChanged: accessLevelChanged,
    removedFromProject: removedFromProject,
    projectDeleted: projectDeleted
};
