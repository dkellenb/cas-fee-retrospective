"use strict";
var mongoose = require('mongoose');
var UserDbSchema = (function () {
    function UserDbSchema() {
    }
    Object.defineProperty(UserDbSchema, "schema", {
        get: function () {
            return new mongoose.Schema({
                uuid: {
                    type: String,
                    required: true,
                    index: true,
                    unique: true
                },
                shortName: {
                    type: String,
                    required: true
                },
                name: {
                    type: String
                },
                email: {
                    type: String
                },
                systemRole: {
                    type: String,
                    required: true
                },
                tokens: {
                    type: Array
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    return UserDbSchema;
}());
exports.UserDbSchema = UserDbSchema;
