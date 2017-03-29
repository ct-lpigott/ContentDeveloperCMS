// Including the dbQuery module, which contains prepared queries to the 
// database, which ensures that all data used within them is sanitised and
// escaped before being included in a statement
var dbQuery = require("./database_query");

// Creating an array of default access levels, that will be used
// in the creation of all new projects. Additional access levels
// can be added, but these initial access levels can only have
// their names changed
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

// Function to check if an access level already exists
function accessLevelExists(requestedAccessLevel, currentAccessLevels){
    // Assuming the access level does not exist until it is found
    var accessLevelExists = false;

    // Looping throught the access levels to check if the requested one exists
    for(var i=0; i<currentAccessLevels.length; i++){
        if(currentAccessLevels[i].access_level_int == requestedAccessLevel){
            accessLevelExists = true;
        }
    }

    // Returning true or false to the caller
    return accessLevelExists;
}

// Function to get all access levels belonging to a project
function getProjectAccessLevels(projectId, cb){
    // Getting all access levels for the project from the database
    dbQuery.get_Project("access_levels", projectId, function(err, row){
        if(row){
            // Parsing the result as an object
            var projectAccessLevels = JSON.parse(row.access_levels);
            cb(projectAccessLevels);
        } else {
            cb();
        }
    });
}

// Function to update all access levels for a project
function updateProjectAccessLevels(adminUserId, projectId, updatedProjectAccessLevels, cb){
    dbQuery.update_Project(["access_levels"], [JSON.stringify(updatedProjectAccessLevels)], adminUserId, projectId, function(err, success){
        cb();
    });
}

// Function to get the name of an access level based on its int
function getAccessLevelName(accessLevelInt, accessLevels){
    var accessLevelName = "";
    if(typeof accessLevels == "string"){
        accessLevels = JSON.parse(accessLevels);
    }

    // Looping through the access levels, to find
    // the one that matches the int provided
    for(var i=0; i<accessLevels.length; i++){
        if(accessLevels[i].access_level_int == accessLevelInt){
            // Storing the access level name, so that it can
            // be returned to the caller
            accessLevelName = accessLevels[i].access_level_name;
        }
    }

    // Retuning the access level name to the caller
    return accessLevelName;
}

// Function to append all access level names to an array of collaborators,
// i.e. when getting a list of collaborators for a project, or getting a list
// of projects belonging to a user, including the name of the access level so that
// it can be displayed alongside its int value
function appendAllAccessLevelNames(arrayOfCollaborators, projectId, cb){
    // Creating a totalCompleted variable, to monitor how many of the access
    // levels have their names added, as this will be completed asynchronously
    var totalCompleted = 0;

    // Checking if a projectId was supplied or not. If not, then this function call
    // is to get the access level names for all projects a user is on, otherwise it
    // is to get all the collaborators for a specific project
    if(projectId == null){
        // Looping through all the collaborators (which will all be the current user, as
        // no projectId has been supplied) and appending the access level name for each
        // of the projects they are a collaborator on
        arrayOfCollaborators.forEach(function(row){
            // Getting the access levels for this project
            getProjectAccessLevels(row.project_id, function(currentAccessLevels){
                if(currentAccessLevels != null){
                    row.access_level_name = getAccessLevelName(row.access_level_int, currentAccessLevels);
                }   

                // Incrementing the total completed, to keep track of how many access
                // level names have been appended
                totalCompleted++;

                // Checking if all access levels have been appended, before returning
                // the updated arrayOfCollaborators to the caller
                if(totalCompleted == arrayOfCollaborators.length){
                    cb(arrayOfCollaborators);
                }
            });
        });
    } else {
        // Getting the access levels for the specified project id
        getProjectAccessLevels(projectId, function(currentAccessLevels){
            arrayOfCollaborators.forEach(function(row){
                if(currentAccessLevels != null){
                    row.access_level_name = getAccessLevelName(row.access_level_int, currentAccessLevels);
                }   

                // Incrementing the total completed, to keep track of how many access
                // level names have been appended
                totalCompleted++;

                // Checking if all access levels have been appended, before returning
                // the updated arrayOfCollaborators to the caller
                if(totalCompleted == arrayOfCollaborators.length){
                    cb(arrayOfCollaborators);
                }
            });
        });
    }
}

// Function to append the "in_use" property to an access level, if there is currently
// a collaborator on the project using it
function appendAccessLevelsInUse(projectId, accessLevels, cb){
    // Gettign all user_project relationships for this project, returning only the
    // user's access level for this project
    dbQuery.get_UserProjects_forProject("access_level_int", projectId, function(err, rows){
        if(rows.length > 0){
            // Looping through all access levels passed to the function
            for(var a=0; a<accessLevels.length; a++){
                // looping through each of the access levels currently in use for this project
                for(var r=0; r<rows.length; r++){
                    // Checking if each of the access levels passed to the function, matches with
                    // any of the access levels in use for this project 
                    if(accessLevels[a].access_level_int == rows[r].access_level_int){
                        // If so, then setting this access levels in_use property to true
                        accessLevels[a].in_use = true;
                        break;
                    }
                }
            }
        }

        // Returning the updated access levels to the caller (i.e. with the in_use property
        // appended to any that are currently in use)
        cb(accessLevels);
    });
}

// Function to create a new access level
function createNewAccessLevel(adminUserId, projectId, accessLevelName, accessLevelInt, cb){
    // Getting the current access levels for this project
    getProjectAccessLevels(projectId, function(currentAccessLevels){
        // Determining the access level int based on whether or not one was provided, and 
        // whether it is a valid number. If not, then defaulting it to 4 (the next available
        // int after the first 3 default access levels)
        accessLevelInt = accessLevelInt == "" || isNaN(accessLevelInt) ? 4 : parseInt(accessLevelInt);

        if(currentAccessLevels != null){
            // Checking if this access level int already exists on this projects access levels. 
            // If it does, then incrementing the access level by 1. Doing this until the access 
            // level int is unqiue
            while(accessLevelExists(accessLevelInt, currentAccessLevels)){
                accessLevelInt++;
            }

            // Adding the new access level to this projects current access levels
            currentAccessLevels.push({
                access_level_name: accessLevelName,
                access_level_int: accessLevelInt
            });

            // Updating this projects access levels (which will save the updated 
            // access levels to the database)
            updateProjectAccessLevels(adminUserId, projectId, currentAccessLevels, function(){
                cb();
            });
        } else {
            console.log("No access levels exist");
            cb();
        }            
    });
}

// Function to remove an access level
function removeAccessLevel(adminUserId, projectId, accessLevelInt, cb){
    // Checking that the int of the access level to be removed is greater than 3 i.e.
    // so that default access levels can never be deleted
    if(Number(accessLevelInt) > 3){
        // Getting the projects current access levels
        getProjectAccessLevels(projectId, function(currentAccessLevels){
            if(currentAccessLevels != null){
                // Checking that the access level exists, before trying to delete it
                if(accessLevelExists(accessLevelInt, currentAccessLevels)){
                    // Looping through the projects access levels to find the index
                    // of the one to delete, and splicing it from the access levels array
                    for(var i=0; i<currentAccessLevels.length; i++){
                        if(currentAccessLevels[i].access_level_int == accessLevelInt){
                            currentAccessLevels.splice(i, 1);
                        }
                    }
                    // Updating this projects access levels (which will save the updated 
                    // access levels to the database)
                    updateProjectAccessLevels(adminUserId, projectId, currentAccessLevels, function(){
                        cb();
                    });
                } else {
                    console.log("This access level does not exist");
                    cb();
                }
            } else {
                console.log("This project does not have any access levels");
                cb();
            }
        });
    } else {
        console.log("Cannot delete default access levels");
        cb();
    }
}

// Function to update the name of an access level
function updateAccessLevelName(userId, projectId, accessLevelInt, newName, cb){
    // Checking that a name has been supplied, and that it has a value
    if(newName != null && newName.length > 0){
        // Getting the projects current access levels
        getProjectAccessLevels(projectId, function(currentAccessLevels){
            if(currentAccessLevels != null){
                // Looping through the array of access levels to find the one to update
                for(var i=0; i<currentAccessLevels.length; i++){
                    if(currentAccessLevels[i].access_level_int == accessLevelInt){
                        // Updating the name of this access level
                        currentAccessLevels[i].access_level_name = newName;
                    }
                }
                // Updating this projects access levels (which will save the updated 
                // access levels to the database)
                updateProjectAccessLevels(userId, projectId, currentAccessLevels, function(){
                    cb();
                });
            } else {
                console.log("This project does not have any access levels");
                cb();
            }
        });
    } else {
        console.log("No name provided. Cannot create access level");
        cb();
    }
}

// Function to return the default access levels as a JSON string (i.e. for
// inserting into a database when a new project is created)
function getDefaultAccessLevelsJson(){
    return JSON.stringify(defaultAccessLevels);
}

// Setting the module exports to be an object, with all of the functions
// that will be used outside of this module (some functions will remain
// private and will not be included)
module.exports = {
    getDefaultAccessLevelsJson: getDefaultAccessLevelsJson,
    getProjectAccessLevels: getProjectAccessLevels,
    getAccessLevelName: getAccessLevelName,
    appendAllAccessLevelNames: appendAllAccessLevelNames,
    appendAccessLevelsInUse: appendAccessLevelsInUse,
    createNewAccessLevel: createNewAccessLevel,
    removeAccessLevel: removeAccessLevel,
    updateAccessLevelName: updateAccessLevelName
};