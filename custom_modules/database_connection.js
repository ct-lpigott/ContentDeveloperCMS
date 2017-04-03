// Requiring the mySql module, to make a connection to the database
var mysql = require('mysql');

// Sourcing the connection string for the database from the env variables
var connectionString = process.env.DB_CONNECTION_STRING;

// Creating a new database connection using the connection string
var connection = mysql.createConnection(connectionString);

// Checking if the connection is set up (in cases where this module is
// required by more than one module, only ever want to have one connection)
if (connection.threadId == null) {
    connectToDatabase();
}

// If an error occurs on the database connection, reconnecting to the database
connection.on("error", function(err){
    console.log("DB Error - " + err.code);
    if(err.code == "PROTOCOL_CONNECTION_LOST"){
        connectToDatabase();
    }
});

// Function used to connect to the database
function connectToDatabase(){
    var newConnection = mysql.createConnection(connectionString);
    newConnection.connect(function (err) {
        if (err) {
            console.error("Unable to connect to server " + err.stack + "\n");
        } else {
            console.log("DB thread - " + connection.threadId);
            if(connection.threadId != null){
                connection.destroy(); 
            }
            connection = newConnection;
            console.log("Successfully connected to database \n");
        }
    });
}

function getDatabaseConnection(){
    console.log("Getting DB connection - " + threadId);
    return connection;
}

// Returning the database connection as the export for this module,
// so that no many how many files request it, only one connection will
// ever be used
module.exports = {
    getDatabaseConnection: getDatabaseConnection,
    reconnectToDatabase: connectToDatabase
};