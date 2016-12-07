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
var service_1 = require('../service');
var RetrospectiveController = (function () {
    function RetrospectiveController(retrospectiveService, userService) {
        this.retrospectiveService = retrospectiveService;
        this.userService = userService;
    }
    RetrospectiveController.prototype.getRetrospectives = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.retrospectiveService.getRetrospectives(currentUser); })
            .then(function (retrospectives) { return response.send(retrospectives); })
            .catch(function (err) {
            console.log(err);
            response.status(400).send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    RetrospectiveController.prototype.createRetrospective = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.retrospectiveService.createRetrospective(currentUser, request.body); })
            .then(function (createdRetrospective) { return response.location('/rest/retrospectives/' + createdRetrospective.uuid).sendStatus(201); })
            .catch(function (err) {
            console.log(err);
            response.status(400).send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    RetrospectiveController.prototype.getRetrospective = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.retrospectiveService.getPublicRetrospectiveSecured(currentUser, request.params.id); })
            .then(function (retrospective) { return response.send(retrospective); })
            .catch(function (err) {
            console.log(err);
            response.status(400).send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    RetrospectiveController.prototype.updateRetrospective = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.retrospectiveService.updateRetrospective(currentUser, request.params.id, request.body); })
            .then(function () { return response.sendStatus(204); })
            .catch(function (err) {
            console.log(err);
            response.status(400).send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    RetrospectiveController.prototype.deleteRetrospective = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.retrospectiveService.deleteRetrospective(currentUser, request.params.id); })
            .then(function () { return response.sendStatus(204); })
            .catch(function (err) {
            console.log(err);
            response.status(400).send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    RetrospectiveController.prototype.getRetrospectiveStatus = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.retrospectiveService.getPublicRetrospectiveSecured(currentUser, request.params.id); })
            .then(function (retrospective) { return response.send({ status: retrospective.status }); })
            .catch(function (err) {
            console.log(err);
            response.status(400).send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    RetrospectiveController.prototype.updateRetrospectiveStatus = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.retrospectiveService.changeStatus(currentUser, request.params.id, request.body); })
            .then(function (retrospective) { return response.sendStatus(204); })
            .catch(function (err) {
            console.log(err);
            response.status(400).send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    RetrospectiveController.prototype.getRetrospectiveAttendees = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.retrospectiveService.getPublicRetrospectiveSecured(currentUser, request.params.id); })
            .then(function (retrospective) { return response.send(retrospective.attendees); })
            .catch(function (err) {
            console.log(err);
            response.status(400).send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    RetrospectiveController.prototype.getRetrospectiveUser = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.retrospectiveService.getPublicRetrospectiveSecured(currentUser, request.params.id); })
            .then(function (retrospective) {
            var filteredAttendee = retrospective.attendees.filter(function (attendee) { return attendee.uuid === request.params.userid; });
            if (filteredAttendee.length === 0) {
                response.sendStatus(404);
            }
            else {
                response.send(filteredAttendee[0]);
            }
        }).catch(function (err) {
            console.log(err);
            response.status(400).send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    RetrospectiveController.prototype.joinRetrospective = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.retrospectiveService.joinRetrospective(currentUser, request.params.id); })
            .then(function () { return response.sendStatus(204); })
            .catch(function (err) {
            console.log(err);
            response.status(400).send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    RetrospectiveController.prototype.findComment = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.retrospectiveService.getPublicRetrospectiveSecured(currentUser, request.params.id); })
            .then(function (retrospective) { return [].concat.apply([], retrospective.topics.map(function (topic) { return topic.comments; }))
            .find(function (comment) { return comment.uuid === request.params.cid; }); })
            .then(function (comment) { return response.send(comment); })
            .catch(function (err) {
            console.log(err);
            response.status(400).send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    RetrospectiveController.prototype.getTopics = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.retrospectiveService.getPublicRetrospectiveSecured(currentUser, request.params.id); })
            .then(function (retrospective) { return response.send(retrospective.topics); })
            .catch(function (err) {
            console.log(err);
            response.send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    RetrospectiveController.prototype.getTopic = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.retrospectiveService.getPublicRetrospectiveSecured(currentUser, request.params.id); })
            .then(function (retrospective) { return response.send(retrospective.topics.find(function (topic) { return topic.uuid === request.params.topicid; })); })
            .catch(function (err) {
            console.log(err);
            response.send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    RetrospectiveController.prototype.getComments = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.retrospectiveService.getPublicRetrospectiveSecured(currentUser, request.params.id); })
            .then(function (retrospective) { return retrospective.topics.find(function (topic) { return topic.uuid === request.params.topicid; }); })
            .then(function (topic) {
            if (topic) {
                response.send(topic.comments);
            }
            else {
                response.sendStatus(404);
            }
        })
            .catch(function (err) {
            console.log(err);
            response.send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    RetrospectiveController.prototype.addComment = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.retrospectiveService.addComment(currentUser, request.params.id, request.params.topicid, request.body); })
            .then(function (createdComment) { return response.location('/rest/retrospectives/' + request.params.id + '/topics/' + request.params.topicid + '/comments/' + createdComment.uuid).sendStatus(201); })
            .catch(function (err) {
            console.log(err);
            response.send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    RetrospectiveController.prototype.getComment = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.retrospectiveService.getPublicRetrospectiveSecured(currentUser, request.params.id); })
            .then(function (retrospective) { return retrospective.topics.find(function (topic) { return topic.uuid === request.params.topicid; }); })
            .then(function (topic) {
            if (topic) {
                response.send(topic.comments.find(function (comment) { return comment.uuid === request.params.cid; }));
            }
            else {
                response.sendStatus(404);
            }
        })
            .catch(function (err) {
            console.log(err);
            response.send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    RetrospectiveController.prototype.updateComment = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.retrospectiveService.updateComment(currentUser, request.params.id, request.params.topicid, request.params.cid, request.body); })
            .then(function (comment) { return response.send(comment); })
            .catch(function (err) {
            console.log(err);
            response.send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    RetrospectiveController.prototype.deleteComment = function (request, response) {
        var _this = this;
        this.userService.getJwtUser(request)
            .then(function (currentUser) { return _this.retrospectiveService.deleteComment(currentUser, request.params.id, request.params.topicid, request.params.cid); })
            .then(function (comment) { return response.sendStatus(204); })
            .catch(function (err) {
            console.log(err);
            response.send({ 'error': 'error in your request. see server logs for details', 'details': err });
        });
    };
    __decorate([
        inversify_express_utils_1.Get('/'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], RetrospectiveController.prototype, "getRetrospectives", null);
    __decorate([
        inversify_express_utils_1.Post('/'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], RetrospectiveController.prototype, "createRetrospective", null);
    __decorate([
        inversify_express_utils_1.Get('/:id'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], RetrospectiveController.prototype, "getRetrospective", null);
    __decorate([
        inversify_express_utils_1.Put('/:id'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], RetrospectiveController.prototype, "updateRetrospective", null);
    __decorate([
        inversify_express_utils_1.Delete('/:id'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], RetrospectiveController.prototype, "deleteRetrospective", null);
    __decorate([
        inversify_express_utils_1.Get('/:id/status'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], RetrospectiveController.prototype, "getRetrospectiveStatus", null);
    __decorate([
        inversify_express_utils_1.Put('/:id/status'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], RetrospectiveController.prototype, "updateRetrospectiveStatus", null);
    __decorate([
        inversify_express_utils_1.Get('/:id/attendees'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], RetrospectiveController.prototype, "getRetrospectiveAttendees", null);
    __decorate([
        inversify_express_utils_1.Get('/:id/attendees/:userid'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], RetrospectiveController.prototype, "getRetrospectiveUser", null);
    __decorate([
        inversify_express_utils_1.Post('/:id/attendees'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], RetrospectiveController.prototype, "joinRetrospective", null);
    __decorate([
        inversify_express_utils_1.Get('/:id/comments/:cid'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], RetrospectiveController.prototype, "findComment", null);
    __decorate([
        inversify_express_utils_1.Get('/:id/topics'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], RetrospectiveController.prototype, "getTopics", null);
    __decorate([
        inversify_express_utils_1.Get('/:id/topics/:topicid'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], RetrospectiveController.prototype, "getTopic", null);
    __decorate([
        inversify_express_utils_1.Get('/:id/topics/:topicid/comments'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], RetrospectiveController.prototype, "getComments", null);
    __decorate([
        inversify_express_utils_1.Post('/:id/topics/:topicid/comments'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], RetrospectiveController.prototype, "addComment", null);
    __decorate([
        inversify_express_utils_1.Get('/:id/topics/:topicid/comments/:cid'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], RetrospectiveController.prototype, "getComment", null);
    __decorate([
        inversify_express_utils_1.Put('/:id/topics/:topicid/comments/:cid'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], RetrospectiveController.prototype, "updateComment", null);
    __decorate([
        inversify_express_utils_1.Delete('/:id/topics/:topicid/comments/:cid'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], RetrospectiveController.prototype, "deleteComment", null);
    RetrospectiveController = __decorate([
        inversify_1.injectable(),
        inversify_express_utils_1.Controller('/rest/retrospectives'),
        __param(0, inversify_1.inject(types_1.default.RetrospectiveService)),
        __param(1, inversify_1.inject(types_1.default.UserService)), 
        __metadata('design:paramtypes', [service_1.RetrospectiveService, service_1.UserService])
    ], RetrospectiveController);
    return RetrospectiveController;
}());
exports.RetrospectiveController = RetrospectiveController;
