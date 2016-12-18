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
var mongoose = require('mongoose');
var inversify_1 = require('inversify');
/**
 * Abstract implementation for all repositories.
 */
var AbstractRepository = (function () {
    function AbstractRepository() {
    }
    AbstractRepository.toObjectId = function (_id) {
        return mongoose.Types.ObjectId.createFromHexString(_id);
    };
    AbstractRepository.prototype.setModel = function (schemaModel) {
        this._model = schemaModel;
    };
    AbstractRepository.prototype.getModel = function () {
        return this._model;
    };
    AbstractRepository.prototype.create = function (item, callback) {
        console.log('AbstractRepository#create');
        this._model.create(item, callback);
    };
    AbstractRepository.prototype.retrieve = function (callback) {
        console.log('AbstractRepository#retrieve');
        this._model.find({}, callback);
    };
    AbstractRepository.prototype.update = function (_id, item, callback) {
        console.log('AbstractRepository#update | ' + _id);
        this._model.update({ _id: _id }, item, callback);
    };
    AbstractRepository.prototype.delete = function (_id, callback) {
        console.log('AbstractRepository#delete | ' + _id);
        this._model.remove({ _id: AbstractRepository.toObjectId(_id) }, function (err) { return callback(err, null); });
    };
    AbstractRepository.prototype.deleteByUuid = function (_uuid, callback) {
        console.log('AbstractRepository#deleteByUuid | ' + _uuid);
        this._model.remove({ uuid: _uuid }, function (err) { return callback(err, null); });
    };
    AbstractRepository.prototype.findById = function (_id, callback) {
        console.log('AbstractRepository#findById | ' + _id);
        this._model.findById(_id, callback);
    };
    AbstractRepository.prototype.findAll = function (callback) {
        console.log('AbstractRepository#findAll');
        this._model.find(callback);
    };
    AbstractRepository.prototype.save = function (object, callback) {
        object.save(callback);
    };
    AbstractRepository = __decorate([
        inversify_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], AbstractRepository);
    return AbstractRepository;
}());
exports.AbstractRepository = AbstractRepository;
