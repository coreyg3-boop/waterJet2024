module.exports = function () {

    let mysql = require('mysql2')
    let conncreds = require('./connectionsconfig.json');

    //establish connection to the db
    let connection = mysql.createconnection({
        host: conncreds["host"],
        user: conncreds['username'],
        password: conncreds['password'],
        database: conncreds['database'],
        port: 3306
    });

    //instantiate the connection
    connection.connect(function (err) {
        if (err) {
            console.log(`connectionrequest failed ${err.stack}`)
        } else {
            console.log(`db connectionrequest successful ${connection.threadid}`)
        }
    });

    //return connection object
    return connection
}