"use strict";
var _1 = require('../../shared/util/');
var PersistedRetrospectiveTopic = (function () {
    function PersistedRetrospectiveTopic(name) {
        this.uuid = new _1.UUID().toString();
        this.name = name || 'undefined';
    }
    return PersistedRetrospectiveTopic;
}());
exports.PersistedRetrospectiveTopic = PersistedRetrospectiveTopic;
var PersistedRetrospectiveComment = (function () {
    function PersistedRetrospectiveComment(description, title, anonymous) {
        this.uuid = new _1.UUID().toString();
        this.title = title || '';
        this.description = description;
        this.anonymous = anonymous === true;
    }
    return PersistedRetrospectiveComment;
}());
exports.PersistedRetrospectiveComment = PersistedRetrospectiveComment;
var PersistedRetrospectiveVote = (function () {
    function PersistedRetrospectiveVote(author) {
        this.author = author;
        this.uuid = new _1.UUID().toString();
        this.value = 1;
    }
    return PersistedRetrospectiveVote;
}());
exports.PersistedRetrospectiveVote = PersistedRetrospectiveVote;
