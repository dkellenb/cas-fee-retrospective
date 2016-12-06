"use strict";
var Mongoose = require('mongoose');
var nconf = require('nconf');
var DataAccess = (function () {
    function DataAccess() {
        DataAccess.connect();
    }
    DataAccess.connect = function () {
        var _this = this;
        if (this.mongooseInstance) {
            return this.mongooseInstance;
        }
        this.dbConnectionUrl = process.env.MONGODB_URI || nconf.get('mongodbUrl');
        this.mongooseConnection = Mongoose.connection;
        this.mongooseConnection.once('open', function () {
            console.log('Connected to Mongo DB using ' + _this.dbConnectionUrl);
        });
        this.mongooseInstance = Mongoose.connect(this.dbConnectionUrl);
        return this.mongooseInstance;
    };
    return DataAccess;
}());
exports.DataAccess = DataAccess;
