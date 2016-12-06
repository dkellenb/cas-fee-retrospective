"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var inversify_1 = require('inversify');
var nconf = require('nconf');
var UserStaticJwtKeyProvider = (function () {
    function UserStaticJwtKeyProvider() {
    }
    UserStaticJwtKeyProvider.prototype.getKey = function () {
        if (!UserStaticJwtKeyProvider.key) {
            UserStaticJwtKeyProvider.key = process.env.JWT_KEY || nconf.get('jwt-key');
        }
        return UserStaticJwtKeyProvider.key;
    };
    UserStaticJwtKeyProvider = __decorate([
        inversify_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], UserStaticJwtKeyProvider);
    return UserStaticJwtKeyProvider;
}());
exports.UserStaticJwtKeyProvider = UserStaticJwtKeyProvider;
