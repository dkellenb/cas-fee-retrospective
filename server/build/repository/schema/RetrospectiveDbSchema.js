"use strict";
var mongoose = require('mongoose');
var RetrospectiveDbSchema = (function () {
    function RetrospectiveDbSchema() {
    }
    Object.defineProperty(RetrospectiveDbSchema, "schema", {
        get: function () {
            return new mongoose.Schema({
                uuid: {
                    type: String,
                    required: true,
                    index: true,
                    unique: true
                },
                name: {
                    type: String,
                    required: true
                },
                description: {
                    type: String
                },
                status: {
                    type: String,
                    required: true
                },
                attendees: [{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'users'
                    }],
                manager: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'users'
                },
                topics: [{
                        uuid: {
                            type: String,
                            required: true
                        },
                        name: {
                            type: String,
                            required: true
                        },
                        comments: [{
                                uuid: {
                                    type: String,
                                    required: true
                                },
                                title: {
                                    type: String,
                                    required: true
                                },
                                description: {
                                    type: String,
                                    required: true
                                },
                                author: {
                                    type: mongoose.Schema.Types.ObjectId,
                                    ref: 'users'
                                },
                                anonymous: {
                                    type: Boolean,
                                    required: true
                                },
                                votes: [{
                                        uuid: {
                                            type: String,
                                            required: true
                                        },
                                        author: {
                                            type: mongoose.Schema.Types.ObjectId,
                                            ref: 'users'
                                        },
                                        value: {
                                            type: Number,
                                            required: true
                                        }
                                    }]
                            }]
                    }]
            });
        },
        enumerable: true,
        configurable: true
    });
    return RetrospectiveDbSchema;
}());
exports.RetrospectiveDbSchema = RetrospectiveDbSchema;
