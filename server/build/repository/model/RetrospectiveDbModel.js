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
