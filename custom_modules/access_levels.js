// Requiring the custom database connection module, so that the one
// connection to the database can be reused throughout the application.
var dbconn = require("./../database/connection.js");

var defaultAccessLevels = [
    {
        access_level_name: "Administrator",
        access_level_int: 1
    },
    {
        access_level_name: "Content Editor",
        access_level_int: 2
    },
    {
        access_level_name: "View Only",
        access_level_int: 3
    }
];

function accessLevelExists(requestedAccessLevel, currentAccessLevels){
    var accessLevelExists = false;

    for(var i=0; i<currentAccessLevels.length; i++){
        if(currentAccessLevels[i].access_level_int == requestedAccessLevel){
            accessLevelExists = true;
        }
    }

    return accessLevelExists;
}

function getProjectAccessLevels(projectID, cb){
    dbconn.query("SELECT * FROM Project WHERE id=" + projectID, function(err, rows, fields){
        if(err){
            console.log(err);
        } else {
            if(rows.length > 0){
                var projectAccessLevels = JSON.parse(rows[0].access_levels);
                cb(projectAccessLevels);
            } else {
                cb();
            }
        }
    });
}

function updateProjectAccessLevels(projectID, updatedProjectAccessLevels, cb){
    dbconn.query("UPDATE Project SET access_levels = " + dbconn.escape(JSON.stringify(updatedProjectAccessLevels)) + " WHERE id=" + projectID, function(err, result){
        if(err){
            console.log(err);
        } else {
            cb();
        }
    });
}

function getAccessLevelName(accessLevelInt, accessLevels){
    var accessLevelName = "";

    for(var i=0; i<accessLevels.length; i++){
        if(accessLevels[i].access_level_int == accessLevelInt){
            accessLevelName = accessLevels[i].access_level_name;
        }
    }

    return accessLevelName;
}

module.exports = {
    getDefaultAccessLevels: function(){
        return defaultAccessLevels;
    },
    getProjectAccessLevels: getProjectAccessLevels,
    getAccessLevelName: getAccessLevelName,
    appendAllAccessLevelNames: function(arrayOfCollaborators, projectID, cb){
        var totalCompleted = 0;
        if(projectID == null){
            arrayOfCollaborators.forEach(function(row){
                getProjectAccessLevels(row.project_id, function(currentAccessLevels){
                    if(currentAccessLevels != null){
                        row.access_level_name = getAccessLevelName(row.access_level_int, currentAccessLevels);
                    }   
                    totalCompleted++;

                    if(totalCompleted == arrayOfCollaborators.length){
                        cb(arrayOfCollaborators);
                    }
                });
            });
        } else {
            getProjectAccessLevels(projectID, function(currentAccessLevels){
                arrayOfCollaborators.forEach(function(row){
                    if(currentAccessLevels != null){
                        row.access_level_name = getAccessLevelName(row.access_level_int, currentAccessLevels);
                    }   
                    totalCompleted++;

                    if(totalCompleted == arrayOfCollaborators.length){
                        cb(arrayOfCollaborators);
                    }
                });
            });
        }
    },
    appendAccessLevelsInUse: function(projectID, accessLevels, cb){
        dbconn.query("SELECT * FROM User_Project WHERE project_id=" + projectID, function(err, rows, fields){
            if(err){
                console.log(err);
            } else {
                if(rows.length > 0){
                    for(var a=0; a<accessLevels.length; a++){
                        for(var r=0; r<rows.length; r++){
                            if(rows[r].access_level_int == accessLevels[a].access_level_int){
                                accessLevels[a].in_use = true;
                                break;
                            }
                        }
                    }
                }
                cb(accessLevels);
            }
        });
    },
    createNewAccessLevel: function(projectID, accessLevelName, accessLevelInt=null, cb){
        getProjectAccessLevels(projectID, function(currentAccessLevels){
            if(currentAccessLevels != null){
                var accessLevelInt = accessLevelInt == null ? currentAccessLevels[currentAccessLevels.length-1].access_level_int + 1 : accessLeveLInt;
                if(accessLevelInt > 3 && accessLevelExists(accessLevelInt, currentAccessLevels) == false){
                    currentAccessLevels.push({
                        access_level_name: accessLevelName,
                        access_level_int: accessLevelInt
                    });

                    updateProjectAccessLevels(projectID, currentAccessLevels, function(){
                        cb();
                    });
                } else {
                    console.log("This access level already exists");
                    cb();
                }
            } else {
                console.log("No access levels exist");
            }            
        });
    },
    removeAccessLevel: function(projectID, accessLevelInt, cb){
        if(accessLevelInt > 3){
            getProjectAccessLevels(projectID, function(currentAccessLevels){
                if(currentAccessLevels != null){
                    if(accessLevelExists(accessLevelInt, currentAccessLevels)){
                        for(var i=0; i<currentAccessLevels.length; i++){
                            if(currentAccessLevels[i].access_level_int == accessLevelInt){
                                currentAccessLevels.splice(i, 1);
                            }
                        }
                        updateProjectAccessLevels(projectID, currentAccessLevels, function(){
                            cb();
                        });
                    } else {
                        console.log("This access level does not exist");
                        cb();
                    }
                }
            });
        } else {
            console.log("Cannot delete default access levels");
            cb();
        }
    },
    updateAccessLevelName: function(projectID, accessLevelInt, newName, cb){
        if(newName != null && newName.length > 0){
            getProjectAccessLevels(projectID, function(currentAccessLevels){
                if(currentAccessLevels != null){
                    for(var i=0; i<currentAccessLevels.length; i++){
                        if(currentAccessLevels[i].access_level_int == accessLevelInt){
                            currentAccessLevels[i].access_level_name = newName;
                        }
                    }
                    updateProjectAccessLevels(projectID, currentAccessLevels, function(){
                        cb();
                    });
                }
            });
        }
    }
};