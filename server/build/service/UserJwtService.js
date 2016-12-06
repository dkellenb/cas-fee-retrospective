"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var inversify_1 = require('inversify');
var moment = require('moment');
var jsonwebtoken_1 = require('jsonwebtoken');
var types_1 = require('../constant/types');
var ErrorWithMessage_1 = require('../shared/util/ErrorWithMessage');
var UserJwtService = (function () {
    function UserJwtService(jwtKeyProvider) {
        this.jwtKeyProvider = jwtKeyProvider;
    }
    UserJwtService.prototype.getJwtUser = function (request) {
        var authorization = request.header('Authorization');
        if (authorization && authorization.indexOf('Bearer') >= 0) {
            var jwt = authorization.substring(7);
            jwt = jwt.replace(/\"/g, '');
            var decoded = null;
            try {
                decoded = jsonwebtoken_1.verify(jwt, this.jwtKeyProvider.getKey());
            }
            catch (err) {
                console.log('Invalid JWT: ' + jwt + ' (Error: ' + err + ')');
                throw new InvalidJwt('Passed JWT ' + jwt + ' is invalid');
            }
            if (decoded.validUntil < moment().unix()) {
                throw new OutdatedToken('Token ' + jwt + ' is not valid anymore. Last valid date: ' + moment(decoded.validUntil));
            }
            return decoded;
        }
        console.log('No JWT given');
        throw new MissingJwt('No JWT given');
    };
    UserJwtService.prototype.createJwt = function (user) {
        var createdJwt = jsonwebtoken_1.sign(user, this.jwtKeyProvider.getKey());
        console.log(createdJwt);
        return createdJwt;
    };
    UserJwtService = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.default.UserJwtKeyProvider)), 
        __metadata('design:paramtypes', [Object])
    ], UserJwtService);
    return UserJwtService;
}());
exports.UserJwtService = UserJwtService;
var InvalidJwt = (function (_super) {
    __extends(InvalidJwt, _super);
    function InvalidJwt(msg) {
        _super.call(this, msg);
    }
    return InvalidJwt;
}(ErrorWithMessage_1.ErrorWithMessage));
var MissingJwt = (function (_super) {
    __extends(MissingJwt, _super);
    function MissingJwt(msg) {
        _super.call(this, msg);
    }
    return MissingJwt;
}(ErrorWithMessage_1.ErrorWithMessage));
var OutdatedToken = (function (_super) {
    __extends(OutdatedToken, _super);
    function OutdatedToken(msg) {
        _super.call(this, msg);
    }
    return OutdatedToken;
}(ErrorWithMessage_1.ErrorWithMessage));
