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
var WebSocketService = (function () {
    function WebSocketService() {
    }
    WebSocketService.prototype.registerSocketIO = function (socketIOinstance) {
        var _this = this;
        this.socketIO = socketIOinstance;
        this.socketIO.on('connection', function (client) {
            _this.registerClient(client);
        });
    };
    WebSocketService.prototype.registerClient = function (socket) {
        console.log('Client connected on ' + socket.nsp.name);
        // Client: socket.emit("subscribe", { 'retrospectiveId': '123123123123123-2344' });
        socket.on('subscribe', function (data) { return socket.join(data.retrospectiveId); });
        socket.on('unsubscribe', function (data) { return socket.leave(data.retrospectiveId); });
        socket.on('disconnect', function (event) { return console.log('Client disconnected'); });
    };
    WebSocketService.prototype.userAddedToRetrospective = function (retrospectiveId, userId) {
        console.log("[WS] retrospective '" + retrospectiveId + "': add user '" + userId + "'");
        this.socketIO.sockets.in(retrospectiveId).emit('newUser', userId);
    };
    WebSocketService.prototype.commentAddedToRetrospective = function (retrospectiveId, commentId) {
        console.log("[WS] retrospective '" + retrospectiveId + "': add comment '" + commentId + "'");
        this.socketIO.sockets.in(retrospectiveId).emit('newComment', commentId);
    };
    WebSocketService.prototype.commentUpdatedOnRetrospective = function (retrospectiveId, commentId) {
        console.log("[WS] retrospective '" + retrospectiveId + "': update comment '" + commentId + "'");
        this.socketIO.sockets.in(retrospectiveId).emit('updatedComment', commentId);
    };
    WebSocketService.prototype.commentRemovedFromRetrospective = function (retrospectiveId, commentId) {
        console.log("[WS] retrospective '" + retrospectiveId + "': delete comment '" + commentId + "'");
        this.socketIO.sockets.in(retrospectiveId).emit('deletedComment', commentId);
    };
    WebSocketService.prototype.retrospectiveStatusChanged = function (retrospectiveId, newStatus) {
        console.log("[WS] retrospective '" + retrospectiveId + "': change status '" + newStatus + "'");
        this.socketIO.sockets.in(retrospectiveId).emit('statusChanged', newStatus);
    };
    WebSocketService = __decorate([
        inversify_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], WebSocketService);
    return WebSocketService;
}());
exports.WebSocketService = WebSocketService;
