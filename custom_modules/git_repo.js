var simpleGit = require("simple-git");
var dbQuery = require("./database_query");
var projectsDir = "./projects/";
var fs = require("fs");

function createNewRepo(projectId, userId, projectName, cb){
    // Creating a new Git repository for this project, and initialising it
    var newGitRepo = simpleGit(projectsDir + projectId);
    newGitRepo.init();
    var commitMessage = "'" + projectName + "' project files created";
    commitToRepo(projectId, userId, "./*", commitMessage, function(err, success){
        cb(err, success);
    });
}

function commitToRepo(projectId, userId, filesToAdd, commitMessage, cb){

    var gitRepo = simpleGit(projectsDir + projectId);
    getUserDetails(userId, function(err, userDetails){
        if(err){ console.log(err); }
        gitRepo
            .addConfig("user.name", userDetails.displayName)
            .addConfig("user.email", userDetails.emailAddress)
            .add(filesToAdd)
            .commit(commitMessage, function(){
                cb(err, true);
            }); 
    });  
}

function getCommitContent(projectId, historyOf, commitHash, cb){
    var projectGit = simpleGit(projectsDir + projectId);
    var filePath = historyOf == "content" ? "content.json" : "admin.json";
    projectGit.show([commitHash + ":" + filePath], function(err, commitData){
        if(err){
            cb(err, null);
        } else {
            var commitDataObject = JSON.parse(commitData);
            cb(null, commitDataObject);
        }
    });
}

function getMostRecentCommit(projectId, cb){
    var projectGit = simpleGit(projectsDir + projectId);
    projectGit.log([-1], function(err, singleCommit){
        if(singleCommit != null){
            cb(err, singleCommit.latest);
        } else {
            cb(err, null);
        }   
    });
}

function appendMostRecentCommitData(userProjects=[], cb){
    var numberOfProjectsCompleted = 0;
    userProjects.forEach(function(project, index){
        getMostRecentCommit(project.project_id, function(err, mostRecentCommit){
            if(mostRecentCommit != null){
                project.last_modified_by = mostRecentCommit.author_name;
                project.last_modified_on = mostRecentCommit.date;
            }
            numberOfProjectsCompleted++;
            if(numberOfProjectsCompleted == userProjects.length){
                cb(userProjects);
            }
        });
    });
}

function logFromRepo(projectId, historyOf, cb){
    var projectGit = simpleGit(projectsDir + projectId);
    var filePath = historyOf == "content" ? "content.json" : "admin.json";
    projectGit.log([filePath], function(err, gitLog){
         if(err){
             cb(err, null);
         } else {
             if(gitLog.total > 0 && gitLog.all != null){
                 cb(null, gitLog.all);
             } else {
                 cb(null, null);
             }             
         }
    });
}

function getUserDetails(userId, cb){
    // Setting defaults to be used as the Git Credentials, incase there
    // is any issue with the query to the database, or the user's details
    // are not available
    var userDetails = {
        displayName: "Content Developer CMS",
        emailAddress: process.env.EMAIL_ADDRESS
    }

    dbQuery.get_User("display_name, email_address", userId, function(err, row){
        if(err){ console.log(err); }
        if(row){
            userDetails.displayName = row.display_name;
            userDetails.emailAddress = row.email_address;
        }
        cb(null, userDetails);
    });
}

module.exports = {
    createNewRepo: createNewRepo,
    commitToRepo: commitToRepo,
    logFromRepo: logFromRepo,
    getCommitContent: getCommitContent,
    getMostRecentCommit: getMostRecentCommit,
    appendMostRecentCommitData: appendMostRecentCommitData
};