var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.dbPath, {
    useMongoClient: true
});

var connection = mongoose.connection;
connection.on('error', function (error) {
    useMongoClient: true
	console.log('error occurred from db ',error);
});

connection.once('openUri', function dbOpen() {
	console.log('successfully opened the db');
});

// When the connection is disconnected
connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

exports.mongoose = mongoose;