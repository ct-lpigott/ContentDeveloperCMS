var mysql = require('mysql');

var connectionString = process.env.DB_CONNECTION_STRING;

var connection = mysql.createConnection(connectionString);

if (connection.threadId == null) {
    connectToDatabase();
}

function connectToDatabase(){
    connection.connect(function (err) {
        if (err) {
            console.error("Unable to connect to server " + err.stack + "\n");
        } else {
            console.log("Successfully connected to database \n");
        }
    });
}

connection.on("error", function(err){
    if(err == "PROTOCOL_CONNECTION_LOST"){
        connectToDatabase();
    } else {
        console.log("SQL Database connection error " + err);
    }
});

module.exports = connection;