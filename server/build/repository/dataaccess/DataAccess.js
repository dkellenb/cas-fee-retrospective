"use strict";
var Mongoose = require('mongoose');
var nconf = require('nconf');
var DataAccess = (function () {
    function DataAccess() {
        DataAccess.connect();
    }
    DataAccess.connect = function () {
        if (this.mongooseInstance) {
            return this.mongooseInstance;
        }
        this.mongooseConnection = Mongoose.connection;
        this.mongooseConnection.once('open', function () {
            console.log('Connected to Mongo DB using ' + nconf.get('mongodbUrl'));
        });
        this.mongooseInstance = Mongoose.connect(nconf.get('mongodbUrl'));
        return this.mongooseInstance;
    };
    return DataAccess;
}());
exports.DataAccess = DataAccess;
