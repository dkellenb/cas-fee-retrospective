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
var inversify_1 = require('inversify');
var AbstractRepository_1 = require('./AbstractRepository');
var schema_1 = require('./schema');
var mongoose = require('mongoose');
exports.UserDbModel = mongoose.model('users', schema_1.UserDbSchema.schema);
var UserRepository = (function (_super) {
    __extends(UserRepository, _super);
    function UserRepository() {
        _super.call(this);
        _super.prototype.setModel.call(this, exports.UserDbModel);
    }
    UserRepository.prototype.findByUuid = function (_uuid, callback) {
        this.getModel()
            .where('uuid').equals(_uuid)
            .exec(function (error, result) {
            callback(error, !result || result.length === 0 ? null : result[0]);
        });
    };
    UserRepository.prototype.findByUuids = function (_uuids, callback) {
        this.getModel()
            .where('uuid').in(_uuids)
            .exec(callback);
    };
    UserRepository = __decorate([
        inversify_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], UserRepository);
    return UserRepository;
}(AbstractRepository_1.AbstractRepository));
exports.UserRepository = UserRepository;
