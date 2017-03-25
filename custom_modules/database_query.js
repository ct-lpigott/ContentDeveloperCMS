var dbconn = require("./database_connection");
var sendEmail = require("./send_email");
var validation = require("./validation");
var crypto = require('crypto');

module.exports = {
    get_User: get_User,
    get_Project: get_Project,
    get_UserProject: get_UserProject,
    get_UserProject_Project: get_UserProject_Project,
    get_UserProjects_forUser: get_UserProjects_forUser,
    get_UserProjects_forProject: get_UserProjects_forProject,
    get_UserProject_Project_User: get_UserProject_Project_User,
    getWhere_User: getWhere_User,
    update_User: update_User,
    update_Project: update_Project,
    update_UserProject: update_UserProject,
    create_User: create_User,
    create_UserProject: create_UserProject,
    check_User: check_User,
    create_Project: create_Project,
    check_UserProject: check_UserProject,
    delete_Project: delete_Project,
    delete_UserProject: delete_UserProject
};


// GET
function get_User(selectCols="", userId, cb){
    userId = validation.sanitise(userId);
    dbconn.query("SELECT " + selectCols + " FROM User WHERE id=" + dbconn.escape(userId), function(err, rows, fields){
        handleGetResult(err, rows, "single", cb);
    });
}

function get_Project(selectCols="", projectId, cb){
    projectId = validation.sanitise(projectId);
    dbconn.query("SELECT " + selectCols + " FROM Project WHERE id=" + dbconn.escape(projectId), function(err, rows, fields){
        handleGetResult(err, rows, "single", cb);
    });
}

function get_UserProject(selectCols="", userId, projectId, cb){
    userId = validation.sanitise(userId);
    projectId = validation.sanitise(projectId);
    dbconn.query("SELECT " + selectCols + " FROM User_Project WHERE user_id=" + dbconn.escape(userId) + " AND project_id=" + dbconn.escape(projectId), function(err, rows, fields){
        handleGetResult(err, rows, "single", cb);
    });
}

function get_UserProjects_forUser(selectCols, userId, cb){
    userId = validation.sanitise(userId);
    dbconn.query("SELECT " + selectCols + " FROM User_Project up LEFT JOIN Project p ON up.project_id = p.id WHERE up.user_id=" + dbconn.escape(userId), function(err, rows, fields){
        handleGetResult(err, rows, "all", cb);
    });        
}

function get_UserProjects_forProject(selectCols, projectId, cb){
    projectId = validation.sanitise(projectId);
    dbconn.query("SELECT " + selectCols + " FROM User_Project up LEFT JOIN User u ON up.user_id = u.id LEFT JOIN Project p ON up.project_id = p.id WHERE up.project_id=" + dbconn.escape(projectId), function(err, rows, fields){
        handleGetResult(err, rows, "all", cb);
    });        
}

function get_UserProject_Project(selectCols, userId, projectId, cb){
    userId = validation.sanitise(userId);
    projectId = validation.sanitise(projectId);
    dbconn.query("SELECT " + selectCols + " FROM User_Project up LEFT JOIN Project p ON up.project_id = p.id WHERE up.user_id=" + dbconn.escape(userId) + " AND up.project_id=" + dbconn.escape(projectId), function(err, rows, fields){
        handleGetResult(err, rows, "single", cb);
    });
}

function get_UserProject_Project_User(selectCols, userId, projectId, cb){
    userId = validation.sanitise(userId);
    projectId = validation.sanitise(projectId);
    dbconn.query("SELECT " + selectCols + " FROM User_Project up LEFT JOIN Project p ON up.project_id = p.id LEFT JOIN User u ON up.user_id = u.id WHERE up.user_id=" + dbconn.escape(userId) + " AND up.project_id=" + dbconn.escape(projectId), function(err, rows, fields){
        handleGetResult(err, rows, "single", cb);
    });
}

// GET WHERE
function getWhere_User(selectCols="", whereCols=[], whereVals=[], cb){
    var where = "WHERE " + combineColVals(whereCols, whereVals, " AND ");
    dbconn.query("SELECT " + selectCols + " FROM User " + where, function(err, rows, fields){
        handleGetResult(err, rows, "single", cb);
    });
}

// UPDATE
function update_User(updateCols=[], updateVals=[], userId, cb){
    var setCols = "SET " + combineColVals(updateCols, updateVals);
    console.log(setCols);
    userId = validation.sanitise(userId);
    dbconn.query("UPDATE User " + setCols + " WHERE id=" + dbconn.escape(userId), function(err, result){
        handleUpdateResult(err, result, cb);
    });
}

function update_Project(updateCols=[], updateVals=[], userId, projectId, cb){
    var setCols = "SET " + combineColVals(updateCols, updateVals);
    userId = validation.sanitise(userId);
    projectId = validation.sanitise(projectId);
    dbconn.query("UPDATE Project p LEFT JOIN User_Project up ON p.id = up.project_id " + setCols + " WHERE up.project_id=" + dbconn.escape(projectId) + " AND up.user_id=" + dbconn.escape(userId), function(err, result){
        handleUpdateResult(err, result, cb);
    });
}

function update_UserProject(updateCols=[], updateVals=[], userId, projectId, cb){
    var setCols = "SET " + combineColVals(updateCols, updateVals);
    userId = validation.sanitise(userId);
    projectId = validation.sanitise(projectId);
    dbconn.query("UPDATE User_Project " + setCols + " WHERE user_id=" + userId  + " AND project_id=" + projectId, function(err, result) {
        handleUpdateResult(err, result, function(err, success){
            if(err || success == null){
                cb(err, false);
            } else {
                get_UserProject_Project_User("u.email_address, u.display_name, up.access_level_int, p.project_name, p.access_levels", userId, projectId, function(err, row){
                    if(row){
                        let accessLevels = require("./access_levels.js");
                        var accessLevelName = accessLevels.getAccessLevelName(row.access_level_int, row.access_levels);
                        sendEmail.accessLevelChanged(row.email_address, row.display_name, row.project_name, accessLevelName);
                    }
                    cb(err, success);
                });
            }
        });
    });
}

// CREATE
function create_User(emailAddress, cb){
    emailAddress = validation.sanitise(emailAddress);
    createUniqueUserAuthToken(function(newAuthToken){
        dbconn.query("INSERT INTO User(email_address, cd_user_auth_token) VALUES(" + dbconn.escape(emailAddress) + ", " + newAuthToken + ")", function(err, result){
            handleCreateResult(err, result, cb);
        });
    });
}

function create_Project(projectName, accessLevels, mediaFolderId, userId, cb){
    projectName = validation.sanitise(projectName);
    userId = validation.sanitise(userId);
    dbconn.query("INSERT INTO Project(project_name, access_levels, media_folder_id) VALUES(" + dbconn.escape(projectName) + ", " + dbconn.escape(accessLevels) + ", " + dbconn.escape(mediaFolderId) + ")", function(err, result){
        handleCreateResult(err, result, function(err, newProjectId){
            if(err || newProjectId == null){
                cb(err, null);
            } else {
                create_UserProject(userId, newProjectId, 1, function(err, newUserProjectId){
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

function create_UserProject (userId, projectId, accessLevelInt, cb){
    userId = validation.sanitise(userId);
    projectId = validation.sanitise(projectId);
    access_level_int = validation.sanitise(accessLevelInt);
    dbconn.query("INSERT INTO User_Project(user_id, project_id, access_level_int) VALUES(" + userId + ", " + projectId + ", " + accessLevelInt + ")", function(err, result){
        handleCreateResult(err, result, function(err, newUserProjectId){
            if(err){
                cb(err, null);
            } else {
                cb(err, newUserProjectId);
            }
        })
    });
}

// CHECK
function check_User(emailAddress, cb){
    emailAddress = validation.sanitise(emailAddress);
    getWhere_User("id", ["email_address"], [emailAddress], function(err, existingUser){
        if(err){console.log(err);}
        if(existingUser){
            cb(null, existingUser.id);
        } else {
            create_User(emailAddress, cb);
        }
    });
}

function check_UserProject(userId, projectId, accessLevelInt, cb){
    userId = validation.sanitise(userId);
    projectId = validation.sanitise(projectId);
    accessLevelInt = validation.sanitise(accessLevelInt);
    get_UserProject("access_level_int", userId, projectId, function(err, row){
        if(err){ console.log(err); }
        if(row){
            if(row.access_level_int != accessLevelInt){
                update_UserProject(["access_level_int"], [accessLevelInt], userId, projectId, function(err, success){
                    console.log("This users access level has been updated on this project");
                    cb(err, success);
                });
            } else {
                console.log("This user already has this access level to this project");
                cb(null, false);
            }
        } else {
            create_UserProject(userId, projectId, accessLevelInt, function(err, newUserProjectId){
                if(err || newUserProjectId == null){
                    cb(err, null);
                } else {
                    console.log("New user has been added to this project");
                    cb(null, true);
                }
            })
        }
    });
}

// DELETE
function delete_Project(userId, projectId, projectName, cb){
    userId = validation.sanitise(userId);
    projectId = validation.sanitise(projectId);
    projectName = validation.sanitise(projectName);
    var emailUsers = [];
    var allowDelete = false;
    get_UserProjects_forProject("up.user_id, up.access_level_int, u.email_address, u.display_name, p.project_name", projectId, function(err, rows){
        handleGetResult(err, rows, "all", function(err, rows){
            if(rows){
                for(var i=0; i<rows.length; i++){
                    if(rows[i].user_id == userId && rows[i].access_level_int == 1 && rows[i].project_name == projectName){
                        allowDelete = true;
                    }
                    emailUsers.push({
                        emailAddress: rows[i].email_address,
                        displayName: rows[i].display_name,
                        projectName: rows[i].project_name
                    });
                }
                if(allowDelete){
                    dbconn.query("DELETE FROM User_Project WHERE project_id=" + dbconn.escape(projectId), function(err, result){
                        handleUpdateResult(err, result, function(err, success){
                            dbconn.query("DELETE FROM Project WHERE id=" + dbconn.escape(projectId), function(err, result){
                                handleUpdateResult(err, result, function(err, success){
                                    if(success){
                                        for(var i=0; i<emailUsers.length; i++){
                                            sendEmail.projectDeleted(emailUsers[i].emailAddress, emailUsers[i].displayName, emailUsers[i].projectName);
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

function delete_UserProject(userId, projectId, cb){
    userId = validation.sanitise(userId);
    projectId = validation.sanitise(projectId);
    get_UserProject_Project_User("u.email_address, u.display_name, p.project_name", userId, projectId, function(err, row){
        dbconn.query("DELETE FROM User_Project WHERE user_id=" + dbconn.escape(userId) + " AND project_id=" + dbconn.escape(projectId), function(err, result){
            handleUpdateResult(err, result, cb);
        });
        
        if(row){
            sendEmail.removedFromProject(row.email_address, row.display_name, row.project_name);
        } 
    });               
}

// RESULT HANDLERS
function handleGetResult(err, rows, numRows="single", cb){
    if(err || rows == null){
        console.log(err);
        cb(err, null);
    } else {
        if(rows.length > 0){
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
    if(err){
        console.log(err);
        cb(err, false);
    } else {
        cb(null, result.insertId);
    }
};

function combineColVals(cols=[], vals=[], split=", "){
    var colVals = "";
    for(var i=0; i<cols.length; i++){
        var sanitisedValue = cols[i] == "custom_css" ? validation.sanitise(vals[i], true) : validation.sanitise(vals[i]);
        colVals += cols[i] + "=" + dbconn.escape(sanitisedValue);
        if(i != cols.length - 1){
            colVals += split;
        }
    }
    return colVals;
}

function createUniqueUserAuthToken(cb){
    crypto.randomBytes(256, function(err, buf){
        if (err){
            createUniqueUserAuthToken();
        } else {
            var randomAuthToken = buf.toString("hex") + Date.now();
            while(randomAuthToken.length > 525){
                randomAuthToken = randomAuthToken.substring(1);
            }
            console.log(randomAuthToken);
            
            getWhere_User("id", ["cd_user_auth_token"], [randomAuthToken], function(err, row){
                if(row != null && row.id != null){
                    createUniqueUserAuthToken();
                } else {
                    cb(randomAuthToken);
                }
            });
        }
    }); 
}