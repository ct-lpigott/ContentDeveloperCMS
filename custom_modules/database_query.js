// Requiring the database connection module, which will be used
// to make queries to the database. This is the only module that
// should ever request this connection, as all other modules
// will use the prepared query statements below
var database = require("./database_connection");
var dbconn = database.getDatabaseConnection();

// Requiring the sendEmail module, which is used to send emails to
// collaborators when they are added/updated/removed from a project,
// or when a project they are a collaborator on is deleted
var sendEmail = require("./send_email");

// Requiring the validation module, which is used for sanitising all
// data which is to be used in a query statement
var validation = require("./validation");

// Requiring the built-in crypto module, which is used to generate random
// bytes, which are then used as auth tokens for the server
var crypto = require('crypto');

// Creating an array of column names that will always be encrypted, so that 
// when a request to add, remove, update or get data from any one of these
// columns is received, the appropriate encryption/decryption methods will
// be applied
const encryptedColumns = [
    "google_profile_id",
    "google_access_token",
    "google_refresh_token",
    "cd_user_auth_token",
    "media_folder_id",
    "media_folder_permission_id",
    "public_auth_token"
];

// GET
function get_User(selectCols="", userId, cb){
    // Checking if the required columns contain encrypted data, and if they are, adding the appropriate
    // decyption method to their names before passing them to the query
    selectCols = columnStringDecryption(selectCols);

    // Sanitising any parameters to be used in the query
    userId = validation.sanitise(userId);

    // Reloading the database connection incase it has disconnected
    dbconn = database.getDatabaseConnection();

    // Querying the database, with the sanitised data
    dbconn.query("SELECT " + selectCols + " FROM User WHERE id=" + dbconn.escape(userId), function(err, rows, fields){
        // Using a method to handle all get results i.e. to check if
        // there was an error, check that the appropriate number of rows
        // were returned, and pass them back to the callback function
        handleGetResult(err, rows, "single", cb);
    });
}

function get_Project(selectCols="", projectId, cb){
    // Checking if the required columns contain encrypted data, and if they are, adding the appropriate
    // decyption method to their names before passing them to the query
    selectCols = columnStringDecryption(selectCols);

    // Sanitising any parameters to be used in the query
    projectId = validation.sanitise(projectId);

    // Reloading the database connection incase it has disconnected
    dbconn = database.getDatabaseConnection();

    // Querying the database, with the sanitised data
    dbconn.query("SELECT " + selectCols + " FROM Project WHERE id=" + dbconn.escape(projectId), function(err, rows, fields){
        // Using a method to handle all get results i.e. to check if
        // there was an error, check that the appropriate number of rows
        // were returned, and pass them back to the callback function
        handleGetResult(err, rows, "single", cb);
    });
}

function get_UserProject(selectCols="", userId, projectId, cb){
    // Checking if the required columns contain encrypted data, and if they are, adding the appropriate
    // decyption method to their names before passing them to the query
    selectCols = columnStringDecryption(selectCols);

    // Sanitising any parameters to be used in the query
    userId = validation.sanitise(userId);
    projectId = validation.sanitise(projectId);

    // Reloading the database connection incase it has disconnected
    dbconn = database.getDatabaseConnection();

    // Querying the database, with the sanitised data
    dbconn.query("SELECT " + selectCols + " FROM User_Project WHERE user_id=" + dbconn.escape(userId) + " AND project_id=" + dbconn.escape(projectId), function(err, rows, fields){
        // Using a method to handle all get results i.e. to check if
        // there was an error, check that the appropriate number of rows
        // were returned, and pass them back to the callback function
        handleGetResult(err, rows, "single", cb);
    });
}

function get_UserProjects_forUser(selectCols, userId, cb){
    // Checking if the required columns contain encrypted data, and if they are, adding the appropriate
    // decyption method to their names before passing them to the query
    selectCols = columnStringDecryption(selectCols);

    // Sanitising any parameters to be used in the query
    userId = validation.sanitise(userId);

    // Reloading the database connection incase it has disconnected
    dbconn = database.getDatabaseConnection();

    // Querying the database, with the sanitised data
    dbconn.query("SELECT " + selectCols + " FROM User_Project up LEFT JOIN Project p ON up.project_id = p.id WHERE up.user_id=" + dbconn.escape(userId), function(err, rows, fields){
        // Using a method to handle all get results i.e. to check if
        // there was an error, check that the appropriate number of rows
        // were returned, and pass them back to the callback function
        handleGetResult(err, rows, "all", cb);
    });        
}

function get_UserProjects_forProject(selectCols, projectId, cb){
    // Checking if the required columns contain encrypted data, and if they are, adding the appropriate
    // decyption method to their names before passing them to the query
    selectCols = columnStringDecryption(selectCols);

    // Sanitising any parameters to be used in the query
    projectId = validation.sanitise(projectId);

    // Reloading the database connection incase it has disconnected
    dbconn = database.getDatabaseConnection();

    // Querying the database, with the sanitised data
    dbconn.query("SELECT " + selectCols + " FROM User_Project up LEFT JOIN User u ON up.user_id = u.id LEFT JOIN Project p ON up.project_id = p.id WHERE up.project_id=" + dbconn.escape(projectId), function(err, rows, fields){
        // Using a method to handle all get results i.e. to check if
        // there was an error, check that the appropriate number of rows
        // were returned, and pass them back to the callback function
        handleGetResult(err, rows, "all", cb);
    });        
}

function get_UserProject_Project(selectCols, userId, projectId, cb){
    // Checking if the required columns contain encrypted data, and if they are, adding the appropriate
    // decyption method to their names before passing them to the query
    selectCols = columnStringDecryption(selectCols);

    // Sanitising any parameters to be used in the query
    userId = validation.sanitise(userId);
    projectId = validation.sanitise(projectId);

    // Reloading the database connection incase it has disconnected
    dbconn = database.getDatabaseConnection();

    // Querying the database, with the sanitised data
    dbconn.query("SELECT " + selectCols + " FROM User_Project up LEFT JOIN Project p ON up.project_id = p.id WHERE up.user_id=" + dbconn.escape(userId) + " AND up.project_id=" + dbconn.escape(projectId), function(err, rows, fields){
        // Using a method to handle all get results i.e. to check if
        // there was an error, check that the appropriate number of rows
        // were returned, and pass them back to the callback function
        handleGetResult(err, rows, "single", cb);
    });
}

function get_UserProject_Project_User(selectCols, userId, projectId, cb){
    // Checking if the required columns contain encrypted data, and if they are, adding the appropriate
    // decyption method to their names before passing them to the query
    selectCols = columnStringDecryption(selectCols);

    // Sanitising any parameters to be used in the query
    userId = validation.sanitise(userId);
    projectId = validation.sanitise(projectId);

    // Reloading the database connection incase it has disconnected
    dbconn = database.getDatabaseConnection();

    // Querying the database, with the sanitised data
    dbconn.query("SELECT " + selectCols + " FROM User_Project up LEFT JOIN Project p ON up.project_id = p.id LEFT JOIN User u ON up.user_id = u.id WHERE up.user_id=" + dbconn.escape(userId) + " AND up.project_id=" + dbconn.escape(projectId), function(err, rows, fields){
        // Using a method to handle all get results i.e. to check if
        // there was an error, check that the appropriate number of rows
        // were returned, and pass them back to the callback function
        handleGetResult(err, rows, "single", cb);
    });
}

// GET WHERE
function getWhere_User(selectCols="", whereCols=[], whereVals=[], cb){
    // Checking if the required columns contain encrypted data, and if they are, adding the appropriate
    // decyption method to their names before passing them to the query
    selectCols = columnStringDecryption(selectCols);
    
    // Joining the columns/values arrays into a string, all values sanitised and escaped, and all relevant 
    // encrypted columns set to be decrypted (for WHERE statements)
    var where = "WHERE " + combineColVals(whereCols, whereVals, "where",  " AND ");

    // Reloading the database connection incase it has disconnected
    dbconn = database.getDatabaseConnection();
    console.log("Database connection - " + dbconn.threadId);
    
    // Querying the database, with the sanitised data
    dbconn.query("SELECT " + selectCols + " FROM User " + where, function(err, rows, fields){
        // Using a method to handle all get results i.e. to check if
        // there was an error, check that the appropriate number of rows
        // were returned, and pass them back to the callback function
        handleGetResult(err, rows, "single", cb);
    });
}

function getWhere_UserProject(selectCols="", whereCols=[], whereVals=[], cb){
    // Checking if the required columns contain encrypted data, and if they are, adding the appropriate
    // decyption method to their names before passing them to the query
    selectCols = columnStringDecryption(selectCols);

    // Joining the columns/values arrays into a string, all values sanitised and escaped, and all relevant 
    // encrypted columns set to be decrypted (for WHERE statements)
    var where = "WHERE " + combineColVals(whereCols, whereVals, "where",  " AND ");

    // Reloading the database connection incase it has disconnected
    dbconn = database.getDatabaseConnection();

    // Querying the database, with the sanitised data
    dbconn.query("SELECT " + selectCols + " FROM User_Project " + where, function(err, rows, fields){
        // Using a method to handle all get results i.e. to check if
        // there was an error, check that the appropriate number of rows
        // were returned, and pass them back to the callback function
        handleGetResult(err, rows, "single", cb);
    });
}

// UPDATE
function update_User(updateCols=[], updateVals=[], userId, cb){
    // Joining the columns/values arrays into a string, all values sanitised and escaped, and all encrypted 
    // columns data set to be encrypted (for INSERT and UPDATE statements)
    var setCols = "SET " + combineColVals(updateCols, updateVals, "set", ", ", false);

    // Sanitising any parameters to be used in the query
    userId = validation.sanitise(userId);

    // Reloading the database connection incase it has disconnected
    dbconn = database.getDatabaseConnection();

    // Querying the database, with the sanitised data
    dbconn.query("UPDATE User " + setCols + " WHERE id=" + dbconn.escape(userId), function(err, result){
        // Using a method to handle all update/delete results i.e. to check if
        // there was an error, check if the update was successful, and pass back
        // the result to the callback function
        handleUpdateResult(err, result, cb);
    });
}

function update_Project(updateCols=[], updateVals=[], userId, projectId, cb){
    // Joining the columns/values arrays into a string, all values sanitised and escaped, and all encrypted 
    // columns data set to be encrypted (for INSERT and UPDATE statements)
    var setCols = "SET " + combineColVals(updateCols, updateVals, "set");

    // Sanitising any parameters to be used in the query
    userId = validation.sanitise(userId);
    projectId = validation.sanitise(projectId);

    // Reloading the database connection incase it has disconnected
    dbconn = database.getDatabaseConnection();
    
    // Querying the database, with the sanitised data
    dbconn.query("UPDATE Project p LEFT JOIN User_Project up ON p.id = up.project_id " + setCols + " WHERE up.project_id=" + dbconn.escape(projectId) + " AND up.user_id=" + dbconn.escape(userId), function(err, result){
        // Using a method to handle all update/delete results i.e. to check if
        // there was an error, check if the update was successful, and pass back
        // the result to the callback function
        handleUpdateResult(err, result, cb);
    });
}

function update_UserProject(updateCols=[], updateVals=[], currentUserId, updateUserId, projectId, cb){
    checkThatOneAdminWillAlwaysRemain(updateCols, updateVals, updateUserId, projectId, function(allowUpdate){
        if(allowUpdate){
            // Joining the columns/values arrays into a string, all values sanitised and escaped, and all encrypted 
            // columns data set to be encrypted (for INSERT and UPDATE statements)
            var setCols = "SET " + combineColVals(updateCols, updateVals, "set");

            // Sanitising any parameters to be used in the query
            updateUserId = validation.sanitise(updateUserId);
            projectId = validation.sanitise(projectId);

            // Reloading the database connection incase it has disconnected
            dbconn = database.getDatabaseConnection();

            // Querying the database, with the sanitised data
            dbconn.query("UPDATE User_Project " + setCols + " WHERE user_id=" + updateUserId  + " AND project_id=" + projectId, function(err, result) {
                // Using a method to handle all update/delete results i.e. to check if
                // there was an error, check if the update was successful, and pass back
                // the result to the callback function
                handleUpdateResult(err, result, function(err, success){
                    if(err || success == null){
                        cb(err, false);
                    } else {
                        // Creating temporary variables to determing if the access level was changed,
                        // and if so, what it was changed to
                        var accessLevelChanged = false;
                        var updatedAccessLevel = null;

                        // Looping through the columns used in the query, to determine if the 
                        // access_level_int column was one of them. If so, storing its value
                        for(var i=0; i<updateCols.length; i++){
                            if(updateCols[i] == "access_level_int"){
                                accessLevelChanged = true;
                                updatedAccessLevel = updateVals[i];
                                break;
                            }
                        }
                        
                        // Checking if the access level for this user to this project was changed,
                        // so that their access to the projects Google Drive folder can be updated,
                        // and an email sent to them to notify them of the change
                        if(accessLevelChanged){
                            // Only requiring the googleOAuth module at this point, as it cannot
                            // be declare at the top of the file like the other modules (as there is 
                            // a two way dependancy - this module requires the googleOAuth module, and
                            // the googleOAuth module requires this module. getting around this by 
                            // only requiring the googleOAuth module when needed)
                            var googleOAuth = require("./google_oauth");

                            // Updating the users access to the projects Google drive folder, based
                            // on the value of their access level int
                            googleOAuth.updateUserAccessToFolder(currentUserId, updateUserId, projectId, updatedAccessLevel, function(success){});
                            
                            // Getting the users details, along with the project details, so that the appropriate
                            // information can be included in the email, notifying them of this change
                            get_UserProject_Project_User("u.email_address, u.display_name, up.access_level_int, p.project_name, p.access_levels, p.media_folder_id", updateUserId, projectId, function(err, row){
                                if(row){
                                    // As with the googleOAuth module, only requiring the accessLevels module
                                    // as needed, as there is a two way dependancy between it and this module
                                    let accessLevels = require("./access_levels.js");
                                    // Getting the name of the users access level
                                    var accessLevelName = accessLevels.getAccessLevelName(row.access_level_int, row.access_levels);
                                    // Using the sendEmail module to generate an email to the user
                                    sendEmail.accessLevelChanged(row.email_address, row.display_name, row.project_name, accessLevelName);
                                }
                                cb(err, success);
                            });
                        } else {
                            // Since the access level was not changed, no further
                            // action is required
                            cb(err, success);
                        }
                    }
                });
            });
        } else {
            cb("Projects must always have one admin", false);
        }
    });
}

function update_UserProject_PublicAuthToken(userId, projectId, currentPublicAuthToken, cb){
    // Sanitising any parameters to be used in the query
    userId = validation.sanitise(userId);
    projectId = validation.sanitise(projectId);

    // Getting the users current public auth token for this project, as 
    // the person requesting the new token will need to match with 
    // this one first
    get_UserProject("public_auth_token", userId, projectId, function(err, row){
        if(row){
            // Checking that the public auth token provided by the user, matches
            // the curretn public auth token of this user/project relationship
            if(row.public_auth_token.toString() == currentPublicAuthToken){

                // Creating a new unique public auth token
                createUniquePublicAuthToken(function(newPublicAuthToken){
                    // Joining the columns/values arrays into a string, all values sanitised and escaped, and all encrypted 
                    // columns data set to be encrypted (for INSERT and UPDATE statements)
                    var setCols = "SET " + combineColVals(["public_auth_token"], [newPublicAuthToken], "set", ", ", false);
                    
                    // Reloading the database connection incase it has disconnected
                    dbconn = database.getDatabaseConnection();

                    // Querying the database, with the sanitised data
                    dbconn.query("UPDATE User_Project " + setCols + " WHERE user_id=" + userId + " AND project_id=" + projectId, function(err, result){
                        // Using a method to handle all update/delete results i.e. to check if
                        // there was an error, check if the update was successful, and pass back
                        // the result to the callback function
                        handleUpdateResult(err, result, function(err, success){
                            if(success){
                                // Returning the new token (toString(), as it is a binary array
                                // at this point), to the caller
                                cb(null, newPublicAuthToken.toString());
                            } else {
                                cb(err, null);
                            }
                        });
                    });
                });
            } else {
                cb("Valid auth token not included in the request", null);
            }
        } else {
            cb(err, null);
        }
    });
}

// CREATE
function create_User(emailAddress, cb){
    console.log("About to create user - " + emailAddress);
    // Sanitising any parameters to be used in the query
    emailAddress = validation.sanitise(emailAddress);

    // Creating a new unique user auth token
    createUniqueUserAuthToken(function(newAuthToken){
        // Joining the columns/values arrays into a string, all values sanitised and escaped, and all encrypted 
        // columns data set to be encrypted (for INSERT and UPDATE statements)
        var encryptedValues = combineColVals(["email_address", "cd_user_auth_token"], [emailAddress, newAuthToken], "insert");

        // Reloading the database connection incase it has disconnected
        dbconn = database.getDatabaseConnection();
        
        // Querying the database, with the sanitised data
        dbconn.query("INSERT INTO User(email_address, cd_user_auth_token) VALUES(" + encryptedValues + ")", function(err, result){
            console.log("User created - " + result);
            // Using a method to handle all create results i.e. to check if
            // there was an error, check if the insert was successful, and pass back
            // the id of the new row to the callback function
            handleCreateResult(err, result, cb);
        });
    });
}

function create_Project(projectName, accessLevels, mediaFolderId, userPermissionId, currentUserId, cb){
    // Sanitising any parameters to be used in the query
    projectName = validation.sanitise(projectName);
    currentUserId = validation.sanitise(currentUserId);

    // Joining the columns/values arrays into a string, all values sanitised and escaped, and all encrypted 
    // columns data set to be encrypted (for INSERT and UPDATE statements)
    var encryptedValues = combineColVals(["project_name", "access_levels", "media_folder_id"], [projectName, accessLevels, mediaFolderId], "insert");
    
    // Reloading the database connection incase it has disconnected
    dbconn = database.getDatabaseConnection();

    // Querying the database, with the sanitised data
    dbconn.query("INSERT INTO Project(project_name, access_levels, media_folder_id) VALUES(" + encryptedValues + ")", function(err, result){
        // Using a method to handle all create results i.e. to check if
        // there was an error, check if the insert was successful, and pass back
        // the id of the new row to the callback function
        handleCreateResult(err, result, function(err, newProjectId){
            if(err || newProjectId == null){
                cb(err, null);
            } else {
                create_UserProject(currentUserId, currentUserId, newProjectId, 1, userPermissionId, function(err, newUserProjectId){
                    if(err || newUserProjectId == null){
                        cb(err, null);
                    } else {
                        cb(err, newProjectId);
                    }
                })
            }
        });
    });
}

function create_UserProject(currentUserId, newUserId, projectId, accessLevelInt, userPermissionId=null, cb){
    // Sanitising any parameters to be used in the query
    newUserId = validation.sanitise(newUserId);
    projectId = validation.sanitise(projectId);
    access_level_int = validation.sanitise(accessLevelInt);

    createUniquePublicAuthToken(function(newPublicAuthToken){
        // Joining the columns/values arrays into a string, all values sanitised and escaped, and all encrypted 
        // columns data set to be encrypted (for INSERT and UPDATE statements)
        var encryptedValues = combineColVals(["user_id", "project_id", "access_level_int", "media_folder_permission_id", "public_auth_token"], [newUserId, projectId, accessLevelInt, userPermissionId, newPublicAuthToken], "insert");
        
        // Reloading the database connection incase it has disconnected
        dbconn = database.getDatabaseConnection();

        // Querying the database, with the sanitised data
        dbconn.query("INSERT INTO User_Project(user_id, project_id, access_level_int, media_folder_permission_id, public_auth_token) VALUES(" + encryptedValues + ")", function(err, result){
            // Using a method to handle all create results i.e. to check if
            // there was an error, check if the insert was successful, and pass back
            // the id of the new row to the callback function
            handleCreateResult(err, result, function(err, newUserProjectId){
                if(err){
                    cb(err, null);
                } else {
                    if(userPermissionId == null){
                        // Only requiring the googleOAuth module at this point, as it cannot
                        // be declare at the top of the file like the other modules (as there is 
                        // a two way dependancy - this module requires the googleOAuth module, and
                        // the googleOAuth module requires this module. getting around this by 
                        // only requiring the googleOAuth module when needed)
                        var googleOAuth = require("./google_oauth");
                        googleOAuth.addUserToMediaFolder(currentUserId, newUserId, projectId, accessLevelInt, function(success){
                            cb(err, newUserProjectId);
                        });
                    } else {
                        cb(err, newUserProjectId);
                    }

                    get_UserProject_Project_User("u.email_address, u.display_name, up.access_level_int, p.project_name, p.access_levels, p.media_folder_id", newUserId, projectId, function(err, row){
                        if(row){
                            // As with the googleOAuth module, only requiring the accessLevels module
                            // as needed, as there is a two way dependancy between it and this module
                            let accessLevels = require("./access_levels.js");
                            // Getting the name of the users access level
                            var accessLevelName = accessLevels.getAccessLevelName(row.access_level_int, row.access_levels);
                            // Using the sendEmail module to generate an email to the user
                            sendEmail.addedToProject(row.email_address, row.display_name, row.project_name, accessLevelName);
                        }
                    });
                }
            });
        });
    });    
}

// CHECK
function check_User(emailAddress, cb){
    console.log("About to query DB - " + emailAddress);
    // Checking if a user with this email exists
    getWhere_User("id", ["email_address"], [emailAddress], function(err, existingUser){
        if(err){console.log(err);}
        // If the user exists, return their id
        if(existingUser){
            console.log("DB user found - " + existingUser);
            cb(null, existingUser.id);
        } else {
            console.log("Need to create new user");
            // otherwise create a new user (which will in turn return 
            // the new user id to the callback funciton passed to the request)
            create_User(emailAddress, cb);
        }
    });
}

function check_UserProject(currentUserId, newUserId, projectId, accessLevelInt, cb){
    // Sanitising any parameters to be used in the query
    newUserId = validation.sanitise(newUserId);
    projectId = validation.sanitise(projectId);
    accessLevelInt = validation.sanitise(accessLevelInt);

    // Checking if this user is already connected to this project
    get_UserProject("access_level_int", newUserId, projectId, function(err, row){
        if(err){ console.log(err); }
        if(row){
            // Checking if this users current access level for this project is different 
            // to the one they have already
            if(row.access_level_int != accessLevelInt){
                // Updating the users access level for this project, which will in turn
                // send an email to the user, notifying them of the update, as well as
                // updating their access to the projects Google drive folder
                update_UserProject(["access_level_int"], [accessLevelInt], currentUserId, newUserId, projectId, function(err, success){
                    console.log("This users access level has been updated on this project");
                    cb(err, success);
                });
            } else {
                console.log("This user already has this access level to this project");
                cb(null, false);
            }
        } else {
            // Since this user does not have an existing relationship with this project, 
            // creating a new one
            create_UserProject(currentUserId, newUserId, projectId, accessLevelInt, null, function(err, newUserProjectId){
                if(err || newUserProjectId == null){
                    cb(err, false);
                } else {
                    console.log("New user has been added to this project");
                    cb(null, true);
                }
            });
        }
    });
}

// DELETE
function delete_Project(userId, projectId, projectName, cb){
    // Sanitising any parameters to be used in the query
    userId = validation.sanitise(userId);
    projectId = validation.sanitise(projectId);
    projectName = validation.sanitise(projectName);

    // Creating an empty array, to tore the details of the users that need
    // to be emailed about this projects deletion, before removing
    // this data from the database
    var emailUsers = [];
    var allowDelete = false;
    var deletedBy;

    // Getting all users that are collaborators on this project
    get_UserProjects_forProject("up.user_id, up.access_level_int, u.email_address, u.display_name, p.project_name", projectId, function(err, rows){
        // Using a method to handle all get results i.e. to check if
        // there was an error, check that the appropriate number of rows
        // were returned, and pass them back to the callback function
        handleGetResult(err, rows, "all", function(err, rows){
            if(rows){
                // Looping through all collaborators of this project
                for(var i=0; i<rows.length; i++){
                    // Checking that at least one of these collaborators is the current
                    // user, that they have the appropriate access level to delete this
                    // project, and that the name they supplied in the request matches
                    // the name of the project (to ensure they dont accidentally delete it)
                    if(rows[i].user_id == userId && rows[i].access_level_int == 1 && rows[i].project_name == projectName){
                        allowDelete = true;
                        deletedBy = rows[i].display_name;
                    }

                    // Pushing the details of each of the projects users to the email array,
                    // so they can be emailed once the project is deleted
                    emailUsers.push({
                        emailAddress: rows[i].email_address,
                        displayName: rows[i].display_name,
                        projectName: rows[i].project_name
                    });
                }
                if(allowDelete){
                    // Reloading the database connection incase it has disconnected
                    dbconn = database.getDatabaseConnection();

                    // Deleting all user realtionships for this project
                    dbconn.query("DELETE FROM User_Project WHERE project_id=" + dbconn.escape(projectId), function(err, result){
                        // Using a method to handle all update/delete results i.e. to check if
                        // there was an error, check if the update was successful, and pass back
                        // the result to the callback function
                        handleUpdateResult(err, result, function(err, success){
                            // Deleting this project
                            dbconn.query("DELETE FROM Project WHERE id=" + dbconn.escape(projectId), function(err, result){
                                handleUpdateResult(err, result, function(err, success){
                                    if(success){
                                        // Looping through the array of details for all users that 
                                        // were collaborators on this project
                                        for(var i=0; i<emailUsers.length; i++){
                                            // Using the sendEmail module to generate an email to each user
                                            sendEmail.projectDeleted(emailUsers[i].emailAddress, emailUsers[i].displayName, emailUsers[i].projectName, deletedBy);
                                        }     
                                        cb(err, success);                                   
                                    }
                                });
                            });
                        });
                    });
                } else {
                    cb("User does not have authority to delete this project", false);
                }
            } else {
                cb("No users exist for this project", false);
            }
        })
    });
};

function delete_UserProject(currentUserId, removeUserId, projectId, cb){
    // Sanitising any parameters to be used in the query
    removeUserId = validation.sanitise(removeUserId);
    projectId = validation.sanitise(projectId);

    // Getting details of the user that is going to be removed from the 
    // project, so that they can be notified once it is deleted
    get_UserProject_Project_User("u.email_address, u.display_name, p.project_name, p.media_folder_id, up.media_folder_permission_id", removeUserId, projectId, function(err, row){
        // Reloading the database connection incase it has disconnected
        dbconn = database.getDatabaseConnection();
        
        // Deleting this users relationship with the project
        dbconn.query("DELETE FROM User_Project WHERE user_id=" + dbconn.escape(removeUserId) + " AND project_id=" + dbconn.escape(projectId), function(err, result){
            // Using a method to handle all update/delete results i.e. to check if
            // there was an error, check if the update was successful, and pass back
            // the result to the callback function
            handleUpdateResult(err, result, cb);
        });
        
        if(row){
            // Only requiring the googleOAuth module at this point, as it cannot
            // be declare at the top of the file like the other modules (as there is 
            // a two way dependancy - this module requires the googleOAuth module, and
            // the googleOAuth module requires this module. getting around this by 
            // only requiring the googleOAuth module when needed)
            var googleOAuth = require("./google_oauth");
            // Removing this user from the projects Google drive folder
            googleOAuth.removeUserFromMediaFolder(row.media_folder_id, row.media_folder_permission_id, currentUserId, function(success){

            });
            // Using the sendEmail module to generate an email to the user
            sendEmail.removedFromProject(row.email_address, row.display_name, row.project_name);
        } 
    });               
}

// RESULT HANDLERS
function handleGetResult(err, rows, numRows="single", cb){
    console.log("Handling get result - " + err + " - " + rows);
    // Handling all get results i.e. to check if
    // there was an error, check that the appropriate number of rows
    // were returned, and pass them back to the callback function
    if(err || rows == null){
        console.log(err);
        cb(err, null);
    } else {
        if(rows != null && rows.length > 0){
            if(numRows == "single"){
                cb(null, rows[0]);
            } else if(numRows = "all") {
                cb(null, rows);
            }            
        } else {
            cb(null, null);
        }
    }
};

function handleUpdateResult(err, result, cb){
    // Handling all update/delete results i.e. to check if
    // there was an error, check if the update was successful, and pass back
    // the result to the callback function
    if(err){
        console.log(err);
        cb(err, false);
    } else {
        if(result.affectedRows > 0){
            cb(null, true);          
        } else {
            cb(null, false);
        }
    }
};

function handleCreateResult(err, result, cb){
    // Handling all create results i.e. to check if
    // there was an error, check if the insert was successful, and pass back
    // the id of the new row to the callback function
    if(err){
        console.log(err);
        cb(err, false);
    } else {
        cb(null, result.insertId);
    }
};

// Function to combine an array of column names, with an array of values.
// Sanitising and escaping the values as they are joined, and returning
// a string that can be passed directly to a database query. Changing
// the approach based on the SQL method required i.e. SET, INSERT or WHERE
function combineColVals(cols=[], vals=[], method, split=", ", sanitise=true){
    // Creating an empty string, upon which each col/val pair will be added
    var colVals = "";

    // Looping through all the columns
    for(var i=0; i<cols.length; i++){
        // Creating an empty value variable, to store the sanitised values 
        var value;

        // If this is a SET or INSERT method, then there will be user generated
        // data that needs to be sanitised
        if(method == "set" || method == "insert"){
            // Checking if this data is to be sanitised or not (i.e. when creating a
            // new user, none of the data should be sanitised, as none of it is
            // user generated
            if(sanitise){
                if(cols[i] == "google_access_token" || cols[i] == "access_levels"){
                    // Neither of these columns should be sanitised, as they contain objects
                    // that are generated server side.
                    value = vals[i];
                } else if(cols[i] == "custom_css"){
                    // Sanitising this data, but setting CSS characters such as {}
                    // to be allowed
                    value = validation.sanitise(vals[i], true);
                } else if(cols[i] == "read_origins" || cols[i] == "update_origins"){
                    // Sanitising this data, but allowing HTML characters such as /
                    // = and \ to be included (as these will contain URLS)
                    value = validation.sanitise(vals[i], false, true);
                } else {
                    // Sanitising this data, replacing special characters
                    // with their entity values i.e. & becomes &amp;
                    value = validation.sanitise(vals[i]);
                }
            } else {
                // Since this data does not need to be sanitised, setting it to 
                // its initial value
                value = vals[i];
            }

            // Checking if this column needs to be encrypted
            if(encryptedColumns.indexOf(cols[i]) > -1 && value != null){
                // Wrapping the escaped and sanitised value in an AES_ENCRYPT method, 
                // passing it to the key that will be used to encrypt/decrypt it
                value = "AES_ENCRYPT(" + dbconn.escape(value) + ", " + dbconn.escape(process.env.DATABASE_KEY) + ")";
            } else {
                // Since this is not an encrypted column, just escaping the sanitised data
                value = dbconn.escape(value);
            }
        }
        
        // Determining how to join the column/values based on the SQL method that 
        // will be used i.e if the col was "user_id" and the value was "k123456"
        if(method == "set"){
            // i.e. user_id=k123456
            colVals += cols[i] + "=" + value;
        } else if(method == "insert"){
            // i.e. k123456
            colVals += value;
        } else if(method == "where"){
            // Creating a temporary variable to store the column name, as it may 
            // need to be wrapped in a decryption method first
            var col = cols[i];

            // Checking if this column is encrypted
            if(encryptedColumns.indexOf(cols[i]) > -1){
                // Wrapping the original column name in an AES_DECRYPT method, passing
                // in the database key that was used to encrypt the data
                // i.e. AES_DECRYPT(user_id, *****)
                col = "AES_DECRYPT(" + cols[i] + ", " + dbconn.escape(process.env.DATABASE_KEY) + ")";
            }
            // i.e. user_id=k123456
            colVals += col + "=" + dbconn.escape(vals[i]);
        }
        
        // While the current column is not the last column, adding
        // the appropriate "split" value i.e. for WHERE the split 
        // is usually "AND", while for INSERT it is always ", "
        if(i < cols.length - 1){
            colVals += split;
        }
    }

    // Returning the joined column/values string, with all encrypted columns
    // set to be decrypted (for WHERE statements), all values sanitised and
    // escaped, and all encrypted columns data set to be encrypted (for
    // INSERT and UPDATE statements)
    return colVals;
}

function createRandomToken(cb){
    // Using the crypto module to generate a random buffer of 
    // bytes, to be used as an auth token
    crypto.randomBytes(15, function(err, buf){
        if (err){
            // Attempting the call again
            createRandomToken(cb);
        } else {
            // Storing the buffer as a string, and appending the current
            // timestamp to it (to increase the likelyhood of it being unique)
            var randomAuthToken = buf.toString("hex") + Date.now();

            // To ensure that no auth token is ever more than 40 characters
            // long, removing the first character until it is 
            while(randomAuthToken.length > 40){
                randomAuthToken = randomAuthToken.substring(1);
            }

            // Returning the random auth token to the caller
            cb(randomAuthToken);
        }
    });
}

function createUniqueUserAuthToken(cb){
    // Creating a random string
    createRandomToken(function(randomAuthToken){
        // Querying the database for any user with a user_auth_token that matches
        // this new random value (to make sure it is unique)
        getWhere_User("id", ["cd_user_auth_token"], [randomAuthToken], function(err, row){
            // If a row is returned, then this auth token already exists
            if(row != null && row.id != null){
                // Calling this function again, to create a new token,
                // as this one was not unique
                createUniqueUserAuthToken(cb);
            } else {
                // Returning this string to the caller, as it is unique
                cb(randomAuthToken);
            }
        });
    });
}

function createUniquePublicAuthToken(cb){
    // Creating a random string
    createRandomToken(function(randomPublicToken){
        // Querying the database for any user_project realationship with a public_auth_token
        //  that matches this new random value (to make sure it is unique)
        getWhere_UserProject("id", ["public_auth_token"], [randomPublicToken], function(err, row){
            // If a row is returned, then this auth token already exists
            if(row != null && row.id != null){
                // Calling this function again, to create a new token,
                // as this one was not unique
                createUniquePublicAuthToken(cb);
            } else {
                // Returning this string to the caller, as it is unique
                cb(randomPublicToken);
            }
        });
    });
}

// Function to apply the decryption to any columns that will
// contain encrypted data
function columnStringDecryption(stringOfCols){
    // Splitting the string of column names into an array
    var columns = stringOfCols.split(", ");

    // Looping through all the column names to see if they
    // are in the list of encrypted columns
    for(var i=0; i<columns.length; i++){
        // Creating a temporary variable, so that the column
        // name can be manipulated if it contains a prefix i.e.
        // queries to a table join will have column names such
        // as up.user_id and p.project_name. In order to determine
        // if the column is encrypted, we only need the actual name 
        // of the column i.e. user_id or project_name
        var col = columns[i];
        if(columns[i].indexOf(".") > -1){
            // Getting the name of the column, without the prefix
            col = columns[i].split(".")[1];
        }

        // Checking if the column name (without any prefix) is the the
        // array of encyrpted columns
        if(encryptedColumns.indexOf(col) > -1){
            // Wrapping the original column name in an AES_DECRYPT method, passing
            // in the database key that was used to encrypt the data, and setting
            // it to be aliased as the column name without any prefix
            // i.e. AES_DECRYPT(up.user_name, *****) AS 'user_name'
            columns[i] = "AES_DECRYPT(" + columns[i] + ", " + dbconn.escape(process.env.DATABASE_KEY) + ") AS " + dbconn.escape(col);
        }
    }
    // Joining the array of columns back into a comma seperated string,
    // and returning them to the caller
    return columns.join(", ");
}

function checkThatOneAdminWillAlwaysRemain(updateCols, updateVals, userId, projectId, cb){
    // Temporary variable to see what the access level is being updated to
    var updatingAccessLevelTo;

    // Looping through all the colummns passed to the original update function,
    // to see if "access_level_int" was specified as one of them
    for(var i=0; i<updateCols.length; i++){
        if(updateCols[i] == "access_level_int"){
            updatingAccessLevelTo = updateVals[i];
            break;
        }
    }

    // Checking if an attempt is being made to update an access level (based
    // on the loop preformed above) and if the resulting access level will be
    // greater than 2 (i.e. no longer an admin level access)
    if(updatingAccessLevelTo != null && parseInt(updatingAccessLevelTo) > 2){
        // Getting the users current access level
        var currentUserAccessLevel = get_UserProject("access_level_int", userId, projectId, function(err, currentUserRow){
            if(currentUserRow.access_level_int <= 2){
                // Since this user is an admin, checking to see that the project currently
                // contains more than one admin i.e. that removing this one will not leave the project
                // without an admin (i.e. a user of level 1 or 2, that will be able to add/remove
                // collaborators from the project)
                var currentProjectUsers = get_UserProjects_forProject("up.access_level_int", projectId, function(err, collaboratorRows){
                    if(collaboratorRows != null && collaboratorRows.length > 0){
                        // Creating a temporary variable to store the number of admin
                        // level users (with access level 1 or 2) found for this project)
                        var numOfAdmins = 0;

                        // Looping through all of the collaborator rows returned,
                        // to count the number of admins
                        for(var i=0; i<collaboratorRows.length; i++){
                            // If this user has an access level less than or equal to two,
                            // then they will be counted as an admin (as they can add other
                            // collaborats to a project)
                            if(collaboratorRows[i].access_level_int <= 2){
                                numOfAdmins++;
                            }
                        }
                        
                        if(numOfAdmins > 1){
                            // Since there is currently more than one admin, then at least
                            // one will remain following this update, so allowing it to go ahead
                            cb(true);
                        } else {
                            // Since there appears to be only one admin on this project, and the
                            // user being updated is an admin, then not allowing their access level to
                            // be updated
                            cb(false);
                        }
                    } else {
                        // Since there were no rows returned, there must have been
                        // an error, so not allowing the update to happen just incase
                        cb(false);
                    }
                });
            } else {
                // Since this user is not an admin (level 1 or 2) then this update
                // can proceed, as it will not lessen the number of admins on the project
                cb(true);
            }
        });
    } else {
        // Since the access level is not being updated, or is being
        // updated to another admin level value, then allowing this update to proceed
        cb(true);
    }
}

// Setting the module exports to be an object, with all of the functions
// that will be used outside of this module (some functions will remain
// private and will not be included)
module.exports = {
    get_User: get_User,
    get_Project: get_Project,
    get_UserProject: get_UserProject,
    get_UserProject_Project: get_UserProject_Project,
    get_UserProjects_forUser: get_UserProjects_forUser,
    get_UserProjects_forProject: get_UserProjects_forProject,
    get_UserProject_Project_User: get_UserProject_Project_User,
    getWhere_User: getWhere_User,
    getWhere_UserProject: getWhere_UserProject,
    update_User: update_User,
    update_UserProject: update_UserProject,
    update_UserProject_PublicAuthToken: update_UserProject_PublicAuthToken,
    update_Project: update_Project,
    create_User: create_User,
    create_UserProject: create_UserProject,
    check_User: check_User,
    create_Project: create_Project,
    check_UserProject: check_UserProject,
    delete_Project: delete_Project,
    delete_UserProject: delete_UserProject
};