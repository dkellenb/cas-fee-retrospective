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
var types_1 = require('../constant/types');
var _1 = require('../shared/model/');
var _2 = require('../shared/util/');
var UserRepository_1 = require('../repository/UserRepository');
var UserJwtService_1 = require('./UserJwtService');
var UserDbModel_1 = require('../repository/model/UserDbModel');
var User_1 = require('./model/User');
var UserService = (function () {
    function UserService(userRepository, userJwtService) {
        this.userRepository = userRepository;
        this.userJwtService = userJwtService;
    }
    UserService.convertUserToPublicUser = function (persistedUser) {
        var publicUser = new User_1.PublicUser();
        publicUser.uuid = persistedUser.uuid;
        publicUser.name = persistedUser.name;
        publicUser.shortName = persistedUser.shortName;
        return publicUser;
    };
    UserService.convertUserToIUser = function (persistedUser) {
        var user = new UserDbModel_1.User();
        user.uuid = persistedUser.uuid;
        user.name = persistedUser.name;
        user.shortName = persistedUser.shortName;
        user.systemRole = persistedUser.systemRole;
        return user;
    };
    UserService.prototype.createUser = function (createUser) {
        var _this = this;
        console.log('UserService#createUser');
        // create user
        var user = new UserDbModel_1.PersistedUser();
        user.uuid = new _2.UUID().toString();
        user.shortName = createUser.shortName;
        user.name = createUser.name || '';
        user.email = createUser.email || '';
        user.systemRole = _1.UserRole.USER;
        // create token for the user
        var userToken = new UserDbModel_1.UserToken();
        user.tokens = user.tokens || [];
        user.tokens.push(userToken);
        // save the user
        return new Promise(function (resolve, reject) {
            _this.userRepository.create(user, function (error, data) {
                if (error) {
                    reject(error);
                }
                else if (!data) {
                    reject('User could not be created');
                }
                else {
                    console.log('UserService#createUser@promise');
                    resolve(data);
                }
            });
        });
    };
    UserService.prototype.getJwtUser = function (request) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var jwtUser = _this.userJwtService.getJwtUser(request);
            if (!jwtUser) {
                reject(new UserUnknown('JWT could not be decoded'));
            }
            _this.userRepository.findByUuid(jwtUser.uuid, function (error, data) {
                if (error) {
                    reject(error);
                }
                else if (!data) {
                    reject(new UserUnknown('This user ("' + jwtUser.uuid + '" with name "' + jwtUser.shortName + '") is unknown to the system.'));
                }
                else {
                    resolve(jwtUser);
                }
            });
        });
    };
    UserService.prototype.getJwt = function (userUuid, jwtUuid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.userRepository.findByUuid(userUuid, function (error, user) {
                if (error) {
                    reject(error);
                }
                else if (!user) {
                    reject(new UserUnknown('This user is unknown to the system.'));
                }
                else {
                    var singleToken = (user.tokens || []).find(function (t) { return t.uuid === jwtUuid; });
                    if (singleToken !== null) {
                        console.log('Token found: ' + JSON.stringify(singleToken));
                        var jwtUser = User_1.UserJwt.create(user, singleToken);
                        resolve(_this.userJwtService.createJwt(jwtUser));
                    }
                    else {
                        reject(new Error('No valid JWT found'));
                    }
                }
            });
        });
    };
    UserService.prototype.getAllUsers = function (currentUser) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (currentUser.systemRole !== _1.UserRole.ADMIN) {
                console.log('User ' + currentUser.shortName + ' is not allowed to fetch all users from the system');
                throw new InvalidAccess('You are not allowed to fetch all users from the system');
            }
            else {
                _this.userRepository.retrieve(function (error, users) {
                    if (error) {
                        console.log(error);
                        reject(error);
                    }
                    else if (!users) {
                        reject('No users found');
                    }
                    else {
                        resolve(users.map(function (u) { return UserService.convertUserToIUser(u); }));
                    }
                });
            }
        });
    };
    UserService.prototype.getPublicUsers = function (userUuids) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.userRepository.findByUuids(userUuids, function (error, users) {
                if (error) {
                    reject(error);
                }
                else if (!users) {
                    reject('No users found');
                }
                else {
                    resolve(users.map(function (u) { return UserService.convertUserToPublicUser(u); }));
                }
            });
        });
    };
    UserService.prototype.getPublicUser = function (currentUser, userUuid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.userRepository.findByUuid(userUuid, function (error, user) {
                if (error) {
                    reject(error);
                }
                else if (!user) {
                    reject('User with uuid ' + userUuid + ' not found.');
                }
                else {
                    resolve(UserService.convertUserToPublicUser(user));
                }
            });
        });
    };
    UserService.prototype.updateUser = function (currentUser, userUuid, updateUser) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.userRepository.findByUuid(userUuid, function (error, user) {
                if (error) {
                    reject(error);
                }
                else if (!user) {
                    reject('User with uuid ' + userUuid + ' not found.');
                }
                else if (currentUser.uuid !== user.uuid && currentUser.systemRole !== _1.UserRole.ADMIN) {
                    reject('You are not allowed to update user with uuid ' + userUuid);
                }
                else {
                    user.shortName = updateUser.shortName || user.shortName;
                    user.email = updateUser.email || user.email;
                    user.name = updateUser.name || user.name;
                    user.save();
                    resolve(UserService.convertUserToPublicUser(user));
                }
            });
        });
    };
    UserService.prototype.deleteUser = function (currentUser, userUuid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (currentUser.uuid === userUuid || currentUser.systemRole === _1.UserRole.ADMIN) {
                _this.userRepository.deleteByUuid(currentUser.uuid, function (error) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve();
                    }
                });
            }
            else {
                reject('User with uuid ' + currentUser.uuid + ' cannot be deleted. Insufficient privileges');
            }
        });
    };
    UserService = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.default.UserRepository)),
        __param(1, inversify_1.inject(types_1.default.UserJwtService)), 
        __metadata('design:paramtypes', [UserRepository_1.UserRepository, UserJwtService_1.UserJwtService])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
var UserUnknown = (function (_super) {
    __extends(UserUnknown, _super);
    function UserUnknown(msg) {
        _super.call(this, msg);
    }
    return UserUnknown;
}(_2.ErrorWithMessage));
exports.UserUnknown = UserUnknown;
var InvalidAccess = (function (_super) {
    __extends(InvalidAccess, _super);
    function InvalidAccess(msg) {
        _super.call(this, msg);
    }
    return InvalidAccess;
}(_2.ErrorWithMessage));
exports.InvalidAccess = InvalidAccess;
