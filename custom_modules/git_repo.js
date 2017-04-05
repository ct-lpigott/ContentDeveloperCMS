// Requiring the simple git module, which will be used to preform
// git commands on the servers project directories
var simpleGit = require("simple-git");

// Including the dbQuery module, which contains prepared queries to the 
// database, which ensures that all data used within them is sanitised and
// escaped before being included in a statement
var dbQuery = require("./database_query");

// Requiring the file system module, so that this module can access
// the server's file system
var fs = require("fs");

// Requiring the path module, so that strings can be joined and 
// normalised as paths to files on the server
var path = require('path');

// Storing the path to the projects directory, so that it can be reused
var allProjectsDirectory = path.join(process.env.ROOT_DIR, "/projects/");

// Using a function to get the git repo directory for all other functions
// in this module, so that if the directory does not exist, an attempt
// to access a git repo will not be made
function getGitRepoDirectory(projectId, cb){
    var projectDir = path.join(allProjectsDirectory, projectId.toString());
    var adminJsonFile = path.join(projectDir, "admin.json");
    // Using the file system module to check if this project's 
    // directory exists, by searching for the JSON file (to ensure
    // the project files have been created aswell)
    fs.exists(adminJsonFile, function(exists){
        // Defaulting the git repo to null
        var gitRepoDir = null;
        
        if(exists){
            // If the directory exists, then setting the git repo
            // to be a simpleGit object, based on this directory
            gitRepoDir = simpleGit(projectDir);
        }

        // Returning the git repo directory to the caller
        cb(gitRepoDir);
    });
}

function createNewRepo(projectId, userId, projectName, cb){
    // Getting the git repo directory for this project
    getGitRepoDirectory(projectId, function(newGitRepoDir){
        if(newGitRepoDir != null){
            // Initialising the repository
            newGitRepoDir.init();

            // Creating the initial commit message
            var commitMessage = "'" + projectName + "' project files created";

            // Commiting all files to the repository
            commitToRepo(projectId, userId, "./*", commitMessage, function(err, success){
                cb(err, success);
            }); 
        } else {
            cb("Dir does not exist", false);
        } 
    });
}

function commitToRepo(projectId, userId, filesToAdd, commitMessage, cb){
    // Getting the git repo directory for this project
    getGitRepoDirectory(projectId, function(gitRepoDir){
        if(gitRepoDir != null){

            // Getting the users details, so that their name and email can be
            // used as the credentials for the commit
            getUserDetails(userId, function(err, userDetails){
                if(err){ console.log(err); }
                gitRepoDir
                    .addConfig("user.name", userDetails.displayName)
                    .addConfig("user.email", userDetails.emailAddress)
                    .add(filesToAdd)
                    .commit(commitMessage, function(err){
                        cb(err, true);
                    }); 
            });
        } else {
            cb("Dir does not exist", false);
        }
    });
}

function getCommitContent(projectId, historyOf, commitHash, cb){
    // Getting the git repo directory for this project
    getGitRepoDirectory(projectId, function(gitRepoDir){
        if(gitRepoDir != null){
            // Determining the file to be accessed, based on the history required
            var filePath = historyOf == "content" ? "content.json" : "admin.json";

            // Getting the content of the relevant file, as it was at the specified
            // point in time (i.e. based on the commit hash provided)
            gitRepoDir.show([commitHash + ":" + filePath], function(err, commitData){
                if(err){
                    cb(err, null);
                } else {
                    // Parsing the data back to an object, and returning it to the caller
                    var commitDataObject = JSON.parse(commitData);
                    cb(null, commitDataObject);
                }
            });
        } else {
            cb("Dir does not exist", false);
        }
    });
}

function getMostRecentCommit(projectId, cb){
    // Getting the git repo directory for this project
    getGitRepoDirectory(projectId, function(gitRepoDir){
        if(gitRepoDir != null){
            // Logging only the most recent commit from the git repo
            gitRepoDir.log([-1], function(err, singleCommit){
                if(singleCommit != null){
                    // Returning the latest commit to the caller
                    cb(err, singleCommit.latest);
                } else {
                    cb(err, null);
                }   
            });
        } else {
            cb("Dir does not exist", false);
        }
    });
}

function appendMostRecentCommitData(userProjects=[], cb){
    // Using a temporary variable to monitor how many projects have been
    // processed, as this will be asynchoronous
    var numberOfProjectsCompleted = 0;

    // Looping through each of the projects
    userProjects.forEach(function(project, index){

        // Getting this projects most recent commit
        getMostRecentCommit(project.project_id, function(err, mostRecentCommit){
            if(mostRecentCommit != null){
                // Adding the last modified on/by to the project object
                project.last_modified_by = mostRecentCommit.author_name;
                project.last_modified_on = mostRecentCommit.date;
            }

            // Incrementing the number of projects completed
            numberOfProjectsCompleted++;

            // Checking if all projects have been completed
            if(numberOfProjectsCompleted == userProjects.length){
                // Returning the user projects array back to the caller.
                // Each project will now have the last modified on/by data
                // included with it
                cb(userProjects);
            }
        });
    });
}

function logFromRepo(projectId, historyOf, cb){
    // Getting the git repo directory for this project
    getGitRepoDirectory(projectId, function(gitRepoDir){
        if(gitRepoDir != null){
            // Determining the file to be accessed, based on the history required
            var filePath = historyOf == "content" ? "content.json" : "admin.json";

            // Logging all commits relating to this file from the git repo
            gitRepoDir.log([filePath], function(err, gitLog){
                if(err){
                    cb(err, null);
                } else {
                    if(gitLog.total > 0 && gitLog.all != null){
                        // If there are commits for this project, returning
                        // the "all" array to the caller i.e. an array of all
                        // the commits
                        cb(null, gitLog.all);
                    } else {
                        cb(null, null);
                    }             
                }
            });
        } else {
            cb("Dir does not exist", false);
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

    // Getting the users details from the database, to use as the credentials
    dbQuery.get_User("display_name, email_address", userId, function(err, row){
        if(err){ console.log(err); }
        if(row){
            // Setting the user details to be those of the current user
            userDetails.displayName = row.display_name;
            userDetails.emailAddress = row.email_address;
        }

        // Returning the user details to the caller
        cb(null, userDetails);
    });
}

// Setting the module exports to be an object, with all of the functions
// that will be used outside of this module (some functions will remain
// private and will not be included)
module.exports = {
    createNewRepo: createNewRepo,
    commitToRepo: commitToRepo,
    logFromRepo: logFromRepo,
    getCommitContent: getCommitContent,
    getMostRecentCommit: getMostRecentCommit,
    appendMostRecentCommitData: appendMostRecentCommitData
};