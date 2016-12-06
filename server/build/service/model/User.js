"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _1 = require('../../shared/model/');
var UserDbModel_1 = require('../../repository/model/UserDbModel');
var PublicUser = (function () {
    function PublicUser() {
    }
    return PublicUser;
}());
exports.PublicUser = PublicUser;
var RetrospectiveUser = (function (_super) {
    __extends(RetrospectiveUser, _super);
    function RetrospectiveUser() {
        _super.apply(this, arguments);
    }
    RetrospectiveUser.fromRetrospective = function (persistedUser, manager) {
        var retrospectiveUser = new RetrospectiveUser();
        retrospectiveUser.uuid = persistedUser.uuid;
        retrospectiveUser.name = persistedUser.name;
        retrospectiveUser.shortName = persistedUser.shortName;
        retrospectiveUser.role = manager && manager.uuid === persistedUser.uuid ? _1.UserRole.MANAGER : _1.UserRole.USER;
        return retrospectiveUser;
    };
    return RetrospectiveUser;
}(PublicUser));
exports.RetrospectiveUser = RetrospectiveUser;
var UserJwt = (function (_super) {
    __extends(UserJwt, _super);
    function UserJwt() {
        _super.apply(this, arguments);
    }
    /**
     * Creates a User based on objects delivering the specified fields.
     *
     * @param iUser any object matching the interface
     * @returns {User} a user implementation
     */
    UserJwt.from = function (iUser) {
        var user = new UserJwt();
        user.copyValues(iUser);
        return user;
    };
    UserJwt.create = function (iUser, token) {
        var user = new UserJwt();
        user.validUntil = token.validUntil;
        user.copyUserValues(iUser);
        return user;
    };
    UserJwt.prototype.copyValues = function (source) {
        _super.prototype.copyUserValues.call(this, source);
        this.validUntil = source.validUntil;
    };
    return UserJwt;
}(UserDbModel_1.User));
exports.UserJwt = UserJwt;
