var dbQuery = require("./database_query");

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

function getProjectAccessLevels(projectId, cb){
    dbQuery.get_Project("access_levels", projectId, function(err, row){
        if(row){
            var projectAccessLevels = JSON.parse(row.access_levels);
            cb(projectAccessLevels);
        } else {
            cb();
        }
    });
}

function updateProjectAccessLevels(adminUserId, projectId, updatedProjectAccessLevels, cb){
    dbQuery.update_Project(["access_levels"], [JSON.stringify(updatedProjectAccessLevels)], adminUserId, projectId, function(err, success){
        cb();
    });
}

function getAccessLevelName(accessLevelInt, accessLevels){
    var accessLevelName = "";
    if(typeof accessLevels == "string"){
        accessLevels = JSON.parse(accessLevels);
    }

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
    getDefaultAccessLevelsJson: function(){
        return JSON.stringify(defaultAccessLevels);
    },
    getProjectAccessLevels: getProjectAccessLevels,
    getAccessLevelName: getAccessLevelName,
    appendAllAccessLevelNames: function(arrayOfCollaborators, projectId, cb){
        var totalCompleted = 0;
        if(projectId == null){
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
            getProjectAccessLevels(projectId, function(currentAccessLevels){
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
    appendAccessLevelsInUse: function(projectId, accessLevels, cb){
        dbQuery.get_UserProjects_forProject("access_level_int", projectId, function(err, rows){
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
        });
    },
    createNewAccessLevel: function(adminUserId, projectId, accessLevelName, accessLevelInt, cb){
        getProjectAccessLevels(projectId, function(currentAccessLevels){
            accessLevelInt = accessLevelInt == "" || isNaN(accessLevelInt) ? 4 : parseInt(accessLevelInt);
            if(currentAccessLevels != null){
                while(accessLevelExists(accessLevelInt, currentAccessLevels)){
                    accessLevelInt++;
                }

                currentAccessLevels.push({
                    access_level_name: accessLevelName,
                    access_level_int: accessLevelInt
                });

                updateProjectAccessLevels(adminUserId, projectId, currentAccessLevels, function(){
                    cb();
                });
            } else {
                console.log("No access levels exist");
            }            
        });
    },
    removeAccessLevel: function(adminUserId, projectId, accessLevelInt, cb){
        if(accessLevelInt > 3){
            getProjectAccessLevels(projectId, function(currentAccessLevels){
                if(currentAccessLevels != null){
                    if(accessLevelExists(accessLevelInt, currentAccessLevels)){
                        for(var i=0; i<currentAccessLevels.length; i++){
                            if(currentAccessLevels[i].access_level_int == accessLevelInt){
                                currentAccessLevels.splice(i, 1);
                            }
                        }
                        updateProjectAccessLevels(adminUserId, projectId, currentAccessLevels, function(){
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
    updateAccessLevelName: function(userId, projectId, accessLevelInt, newName, cb){
        if(newName != null && newName.length > 0){
            getProjectAccessLevels(projectId, function(currentAccessLevels){
                if(currentAccessLevels != null){
                    for(var i=0; i<currentAccessLevels.length; i++){
                        if(currentAccessLevels[i].access_level_int == accessLevelInt){
                            currentAccessLevels[i].access_level_name = newName;
                        }
                    }
                    updateProjectAccessLevels(userId, projectId, currentAccessLevels, function(){
                        cb();
                    });
                }
            });
        }
    }
};