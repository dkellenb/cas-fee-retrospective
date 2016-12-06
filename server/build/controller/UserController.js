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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var inversify_express_utils_1 = require('inversify-express-utils');
var inversify_1 = require('inversify');
var types_1 = require('../constant/types');
var UserController = (function () {
    function UserController(userService) {
        this.userService = userService;
    }
    UserController.prototype.getCurrentUser = function (request, response) {
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return response.send(currentUser); })
            .catch(function (err) {
            console.log(err);
            response.send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    UserController.prototype.getUsers = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.userService.getAllUsers(currentUser); })
            .then(function (users) { return response.send(users); })
            .catch(function (err) {
            console.log(err);
            response.send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    UserController.prototype.createUser = function (request, response) {
        try {
            console.log('POST: /users/ | ' + JSON.stringify(request.body));
            var jsonData = request.body;
            this.userService.createUser(jsonData).then(function (createdUser) {
                console.log('UserController#createUser@promise');
                response.location('/rest/users/' + createdUser.uuid + '/tokens/' + createdUser.tokens[0].uuid);
                response.sendStatus(201);
            }).catch(function (err) {
                console.log(err);
                response.send({ 'error': 'error in your request. see server logs for details', 'details': err });
            });
        }
        catch (err) {
            console.log(err);
            response.send({ 'error': 'error in your request. see server logs for details', 'details': err });
        }
    };
    UserController.prototype.getUser = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.userService.getPublicUser(currentUser, request.params.id); })
            .then(function (user) { return response.send(user); })
            .catch(function (err) {
            console.log(err);
            response.send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    UserController.prototype.updateUser = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.userService.updateUser(currentUser, request.params.id, request.body); })
            .then(function (user) { return response.send(user); })
            .catch(function (err) {
            console.log(err);
            response.send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    UserController.prototype.deleteUser = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.userService.deleteUser(currentUser, request.params.id); })
            .then(function (user) { return response.sendStatus(204); })
            .catch(function (err) {
            console.log(err);
            response.send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    UserController.prototype.getJwtForUser = function (request, response) {
        try {
            return this.userService.getJwt(request.params.id, request.params.tokenId);
        }
        catch (err) {
            console.log(err);
            response.send({ 'error': 'error in your request. see server logs for details', 'details': err });
        }
    };
    __decorate([
        inversify_express_utils_1.Get('/current'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], UserController.prototype, "getCurrentUser", null);
    __decorate([
        inversify_express_utils_1.Get('/'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], UserController.prototype, "getUsers", null);
    __decorate([
        inversify_express_utils_1.Post('/'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], UserController.prototype, "createUser", null);
    __decorate([
        inversify_express_utils_1.Get('/:id/'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], UserController.prototype, "getUser", null);
    __decorate([
        inversify_express_utils_1.Put('/:id'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], UserController.prototype, "updateUser", null);
    __decorate([
        inversify_express_utils_1.Delete('/:id'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], UserController.prototype, "deleteUser", null);
    __decorate([
        inversify_express_utils_1.Get('/:id/tokens/:tokenId/'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', Promise)
    ], UserController.prototype, "getJwtForUser", null);
    UserController = __decorate([
        inversify_1.injectable(),
        inversify_express_utils_1.Controller('/rest/users'),
        __param(0, inversify_1.inject(types_1.default.UserService)), 
        __metadata('design:paramtypes', [Object])
    ], UserController);
    return UserController;
}());
exports.UserController = UserController;
