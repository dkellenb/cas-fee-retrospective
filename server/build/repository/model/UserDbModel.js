"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var moment = require('moment');
var _1 = require('../../shared/util/');
var _2 = require('../../shared/model/');
/**
 * Implementation of a UserToken. Contains a unique identification and defines how long it's valid.
 */
var UserToken = (function () {
    /**
     * C'tor with default validity.
     *
     * @param validUntilDate validity
     */
    function UserToken(validUntilDate) {
        if (validUntilDate === void 0) { validUntilDate = null; }
        this.uuid = new _1.UUID().toString();
        this.validUntil = validUntilDate ? validUntilDate.getTime() : moment().add(3, 'years').unix();
    }
    /**
     * Creates a UserToken based on objects delivering the specified fields.
     *
     * @param iToken any object matching the interface
     * @returns {UserToken} a token implementation
     */
    UserToken.from = function (iToken) {
        var userToken = new UserToken();
        userToken.uuid = iToken.uuid;
        userToken.validUntil = iToken.validUntil;
        return userToken;
    };
    /**
     * Checks if the token is still valid (from the date).
     * @returns {boolean} false if it's not valid anymore
     */
    UserToken.prototype.isValid = function () {
        return moment().unix() < this.validUntil;
    };
    return UserToken;
}());
exports.UserToken = UserToken;
/**
 * Implementation of a user.
 */
var User = (function () {
    function User() {
        this.uuid = new _1.UUID().toString();
    }
    /**
     * Creates a User based on objects delivering the specified fields.
     *
     * @param iUser any object matching the interface
     * @returns {User} a user implementation
     */
    User.from = function (iUser) {
        var user = new User();
        user.copyUserValues(iUser);
        return user;
    };
    User.prototype.copyUserValues = function (source) {
        this.uuid = source.uuid;
        this.shortName = source.shortName;
        this.name = source.name || null;
        this.email = source.email || null;
        this.systemRole = source.systemRole || _2.UserRole.USER;
    };
    return User;
}());
exports.User = User;
/**
 * Concrete implementation of a persisted user (cleaning up the full mongoose context).
 */
var PersistedUser = (function (_super) {
    __extends(PersistedUser, _super);
    function PersistedUser() {
        _super.apply(this, arguments);
    }
    /**
     * Creates a User based on objects delivering the specified fields.
     *
     * @param iUser any object matching the interface
     * @returns {User} a user implementation
     */
    PersistedUser.from = function (iUser) {
        var user = new PersistedUser();
        user.copyValues(iUser);
        return user;
    };
    PersistedUser.prototype.copyValues = function (source) {
        _super.prototype.copyUserValues.call(this, source);
        this.tokens = [];
        for (var _i = 0, _a = source.tokens; _i < _a.length; _i++) {
            var token = _a[_i];
            this.tokens.push(UserToken.from(token));
        }
    };
    return PersistedUser;
}(User));
exports.PersistedUser = PersistedUser;
