"use strict";
var TYPES = {
    /** Services. */
    RetrospectiveService: Symbol('RetrospectiveService'),
    RetrospectiveRepository: Symbol('RetrospectiveRepository'),
    UserRepository: Symbol('UserRepository'),
    UserService: Symbol('UserService'),
    UserJwtService: Symbol('UserJwtService'),
    UserJwtKeyProvider: Symbol('UserJwtKeyProvider'),
    WebSocketService: Symbol('WebSocketService')
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TYPES;
