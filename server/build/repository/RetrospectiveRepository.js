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
exports.RetrospectiveDbModel = mongoose.model('retrospectives', schema_1.RetrospectiveDbSchema.schema);
var RetrospectiveRepository = (function (_super) {
    __extends(RetrospectiveRepository, _super);
    function RetrospectiveRepository() {
        _super.call(this);
        _super.prototype.setModel.call(this, exports.RetrospectiveDbModel);
    }
    RetrospectiveRepository.removeToken = function (user) {
        user.tokens = null;
        user.email = null;
    };
    RetrospectiveRepository.clearPopulatedRetrospective = function (retrospective) {
        retrospective.attendees.forEach(function (u) { return RetrospectiveRepository.removeToken(u); });
        RetrospectiveRepository.removeToken(retrospective.manager);
        return retrospective;
    };
    RetrospectiveRepository.prototype.findByUuid = function (_uuid, callback) {
        this.getModel()
            .where('uuid').equals(_uuid)
            .exec(function (error, result) {
            callback(error, !result || result.length === 0 ? null : result[0]);
        });
    };
    RetrospectiveRepository.prototype.findByUuidPopulated = function (_uuid, callback) {
        this.getModel()
            .where('uuid').equals(_uuid)
            .populate('attendees')
            .populate('manager')
            .populate('topics.comments.author')
            .exec(function (error, result) {
            callback(error, !result || result.length === 0
                ? null
                : RetrospectiveRepository.clearPopulatedRetrospective(result[0]));
        });
    };
    RetrospectiveRepository.prototype.findByUuids = function (_uuids, callback) {
        this.getModel()
            .where('uuid').in(_uuids)
            .exec(callback);
    };
    RetrospectiveRepository = __decorate([
        inversify_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], RetrospectiveRepository);
    return RetrospectiveRepository;
}(AbstractRepository_1.AbstractRepository));
exports.RetrospectiveRepository = RetrospectiveRepository;
