var nodemailer = require('nodemailer');
var pug = require('pug');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASS
    }
});

function sendEmail(to, subject, htmlBody){
    var mailOptions = {
        from: "'Content Developer' <" + process.env.EMAIL_ADDRESS + ">",
        to: to,
        subject: subject,
        html: htmlBody
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email successfully sent: " + info.response);
        }
    });
}

module.exports = {
    addedToProject: function(userEmail, userDisplayName, projectName){
        var addedToProjectTemplate = pug.compileFile("./views/emails/added_to_project.pug");
        var emailContent = addedToProjectTemplate({
            userEmail: userEmail,
            userDisplayName: userDisplayName,
            projectName: projectName,
            siteUrl: process.env.SITE_URL
        });
        console.log(emailContent);
        sendEmail(userEmail, "Added as Collaborator", emailContent);
    },
    accessLevelChanged: function(userEmail, userDisplayName, projectName, accessLevel){
        var accessLevelChangedTemplate = pug.compileFile("./views/emails/access_level_changed.pug");
        var emailContent = accessLevelChangedTemplate({
            userEmail: userEmail,
            userDisplayName: userDisplayName,
            projectName: projectName,
            accessLevel: accessLevel,
            siteUrl: process.env.SITE_URL
        });
        console.log(emailContent);
        sendEmail(userEmail, "Access Level Changed", emailContent);
    },
    removedFromProject: function(userEmail, userDisplayName, projectName){
        var removedFromProjectTemplate = pug.compileFile("./views/emails/removed_from_project.pug");
        var emailContent = removedFromProjectTemplate({
            userEmail: userEmail,
            userDisplayName: userDisplayName,
            projectName: projectName,
            siteUrl: process.env.SITE_URL
        });
        console.log(emailContent);
        sendEmail(userEmail, "Removed as Collaborator", emailContent);
    }
};
