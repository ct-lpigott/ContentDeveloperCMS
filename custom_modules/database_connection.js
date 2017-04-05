// Requiring the mySql module, to make a connection to the database
var mysql = require('mysql');

// Sourcing the connection string for the database from the env variables
var connectionString = process.env.DB_CONNECTION_STRING;

// Creating a new database connection using the connection string
var connection = mysql.createConnection(connectionString);

// Creating a variable to store the test connection interval, 
// so that if a reconnect is required, it can be cleared and a new one started
var testConnectionInterval;

// Checking if the connection is set up (in cases where this module is
// required by more than one module, only ever want to have one connection)
if (connection.threadId == null) {
    connectToDatabase();
}

// If an error occurs on the database connection, reconnecting to the database
connection.on("error", function(err){
    console.log("DB Error - " + err.code);
    connectToDatabase();
});

// Function used to connect to the database
function connectToDatabase(){
    // Creating a new connection to replace the current one (as 
    // calling connect on a connection with errors can cause additional issues)
    var newConnection = mysql.createConnection(connectionString);

    // Connecting to the new database connection
    newConnection.connect(function (err) {
        if (err) {
            console.error("Unable to connect to server " + err.stack + "\n");
        } else {
            // Checking if a test interval currently exists
            if(testConnectionInterval != null){
                // Clearing this interval (as this connection is about to be destroyed)
                clearInterval(testConnectionInterval);
            }
            // Checking if a connection currently exists
            if (connection.threadId == null) {
                // If so, then destroying it
                connection.destroy();
            }

            // Setting the current connection equal to the new connection
            connection = newConnection;
            
            // Updating the test connection interval to store the new
            // interval, so that it can be cleared if a reconnect is required again
            testConnectionInterval = setInterval(()=>{
                // Getting the id of user 1 from the database every 5 minutes
                // to ensure the connection remains alive
                connection.query("SELECT id FROM User WHERE id=1", function(err, rows, fields){
                    if(err){console.log(err);}
                    if(rows != null && rows.length > 0){
                        var now = new Date();
                        console.log("Got user at " + now.toISOString());
                    }
                });
            }, 1000 * 60 * 5); // Once every 5 minutes

            console.log("Successfully connected to database \n");
        }
    });
}

// Returning an object with a method to get the current database connection 
// as the export for this module. Since the connection may be renewed following
// an error, each dbQuery should request this connection fresh every time
module.exports = {
    getDatabaseConnection: function(){
        return connection;
    }
};