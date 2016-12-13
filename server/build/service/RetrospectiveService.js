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
var inversify_1 = require('inversify');
var types_1 = require('../constant/types');
var _1 = require('../repository/');
var _2 = require('../shared/model/');
var RetrospectiveDbModel_1 = require('../repository/model/RetrospectiveDbModel');
var UUID_1 = require('../shared/util/UUID');
var Restrospective_1 = require('./model/Restrospective');
var WebSocketService_1 = require('./WebSocketService');
var RetrospectiveService = (function () {
    function RetrospectiveService(userRepository, retrospectiveRepository, webSocketService) {
        this.userRepository = userRepository;
        this.retrospectiveRepository = retrospectiveRepository;
        this.webSocketService = webSocketService;
    }
    RetrospectiveService.prototype.canModifyRetrospective = function (persistedRetrospective, persistedUser) {
        return persistedRetrospective.manager.equals(persistedUser._id) || persistedUser.systemRole === _2.UserRole.ADMIN;
    };
    RetrospectiveService.prototype.canCreateComment = function (persistedRetrospective, persistedUser) {
        return persistedRetrospective.status === _2.RetrospectiveStatus.OPEN
            || this.canModifyRetrospective(persistedRetrospective, persistedUser);
    };
    RetrospectiveService.prototype.canUpdateComment = function (persistedRetrospective, persistedUser, persistedComment) {
        return (persistedRetrospective.status === _2.RetrospectiveStatus.OPEN && persistedComment.author.equals(persistedUser._id))
            || this.canModifyRetrospective(persistedRetrospective, persistedUser);
    };
    RetrospectiveService.prototype.canVote = function (persistedRetrospective, persistedUser) {
        return persistedRetrospective.status === _2.RetrospectiveStatus.VOTE
            || this.canModifyRetrospective(persistedRetrospective, persistedUser);
    };
    RetrospectiveService.prototype.getRetrospectives = function (currentUser) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (currentUser.systemRole !== _2.UserRole.ADMIN) {
                reject('Only system admin can see all persisted retrospectives');
            }
            else {
                _this.retrospectiveRepository.findAll(function (error, result) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(result);
                    }
                });
            }
        });
    };
    RetrospectiveService.prototype.getRetrospective = function (uuid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.retrospectiveRepository.findByUuidPopulated(uuid, function (error, retrospective) {
                if (error) {
                    reject(error);
                }
                else if (!retrospective) {
                    reject('Could not find retrospective ' + uuid);
                }
                else {
                    resolve(Restrospective_1.PublicRetrospective.fromRetrospective(retrospective));
                }
            });
        });
    };
    RetrospectiveService.prototype.getPublicRetrospectiveSecured = function (currentUser, uuid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getRetrospective(uuid)
                .then(function (retrospective) {
                if (retrospective.attendees.find(function (attendee) { return attendee.uuid === currentUser.uuid; }) || currentUser.systemRole === _2.UserRole.ADMIN) {
                    resolve(retrospective);
                }
                else {
                    reject('Illegal access to retrospective ' + uuid);
                }
            }).catch(function (err) { return reject(err); });
        });
    };
    RetrospectiveService.prototype.createRetrospective = function (currentUser, createRetrospectiveJSON) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var retrospective = new _1.RetrospectiveDbModel();
            retrospective.uuid = new UUID_1.UUID().toString();
            retrospective.status = _2.RetrospectiveStatus.OPEN;
            retrospective.name = createRetrospectiveJSON.name;
            retrospective.description = createRetrospectiveJSON.description;
            retrospective.topics = [new RetrospectiveDbModel_1.PersistedRetrospectiveTopic('Stop doing'),
                new RetrospectiveDbModel_1.PersistedRetrospectiveTopic('Continue doing'),
                new RetrospectiveDbModel_1.PersistedRetrospectiveTopic('Start doing')
            ];
            _this.userRepository.findByUuid(currentUser.uuid, function (error, user) {
                if (error) {
                    reject(error);
                }
                else {
                    retrospective.attendees.push(user._id);
                    retrospective.manager = user._id;
                    retrospective.save(function (err, createdRetrospective) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(createdRetrospective);
                        }
                    });
                }
            });
        });
    };
    RetrospectiveService.prototype.updateRetrospective = function (currentUser, retrospectiveId, updateRetrospective) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.doRetrospectiveAction(currentUser, retrospectiveId, function (error, persistedRetrospective, persistedUser) {
                if (error) {
                    reject(error);
                }
                else {
                    if (!_this.canModifyRetrospective(persistedRetrospective, persistedUser)) {
                        reject('User "' + currentUser.uuid + '" is not allowed to edit retrospective "' + retrospectiveId + '"');
                    }
                    else {
                        persistedRetrospective.name = updateRetrospective.name;
                        persistedRetrospective.description = updateRetrospective.description;
                        persistedRetrospective.save();
                        resolve(persistedRetrospective);
                    }
                }
            });
        });
    };
    RetrospectiveService.prototype.deleteRetrospective = function (currentUser, retrospectiveId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.doRetrospectiveAction(currentUser, retrospectiveId, function (error, persistedRetrospective, persistedUser) {
                if (error) {
                    reject(error);
                }
                else {
                    if (!_this.canModifyRetrospective(persistedRetrospective, persistedUser)) {
                        reject('User "' + currentUser.uuid + '" is not allowed to edit retrospective "' + retrospectiveId + '"');
                    }
                    else {
                        _this.retrospectiveRepository.delete(persistedRetrospective._id, function (deleteError, result) {
                            if (deleteError) {
                                reject(deleteError);
                            }
                            else {
                                resolve();
                            }
                        });
                    }
                }
            });
        });
    };
    RetrospectiveService.prototype.changeStatus = function (currentUser, retrospectiveId, action) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.doRetrospectiveAction(currentUser, retrospectiveId, function (error, persistedRetrospective, persistedUser) {
                if (error) {
                    reject(error);
                }
                else {
                    if (!_this.canModifyRetrospective(persistedRetrospective, persistedUser)) {
                        reject('User "' + currentUser.uuid + '" is not allowed to edit retrospective "' + retrospectiveId + '"');
                    }
                    else {
                        persistedRetrospective.status = action.status;
                        persistedRetrospective.save();
                        _this.webSocketService.retrospectiveStatusChanged(retrospectiveId, action.status);
                        resolve(persistedRetrospective);
                    }
                }
            });
        });
    };
    RetrospectiveService.prototype.getRetrospectiveUsers = function (currentUser, id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getPublicRetrospectiveSecured(currentUser, id).then(function (retrospective) {
                // as get retrospective secured return all references loaded, we can safely cast here and two lines bellow
                resolve(retrospective.attendees);
            }).catch(function (err) { return reject(err); });
        });
    };
    RetrospectiveService.prototype.getRetrospectiveUser = function (currentUser, id, uuid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getPublicRetrospectiveSecured(currentUser, id).then(function (retrospective) {
                // as get retrospective secured return all references loaded, we can safely cast here and two lines bellow
                resolve(retrospective.attendees.find(function (attendee) { return attendee.uuid === uuid; }));
            }).catch(function (err) { return reject(err); });
        });
    };
    RetrospectiveService.prototype.joinRetrospective = function (currentUser, retrospectiveId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.doRetrospectiveAction(currentUser, retrospectiveId, function (error, persistedRetrospective, persistedUser) {
                if (error) {
                    reject(error);
                }
                else {
                    var userPartOfAttendees = persistedRetrospective.attendees.find(function (attendeeId) {
                        console.log(attendeeId + ' vs ' + persistedUser._id + ' : ' + attendeeId.equals(persistedUser._id));
                        return attendeeId.equals(persistedUser._id);
                    });
                    if (!userPartOfAttendees) {
                        console.log('Register user ' + currentUser.uuid + ' to ' + retrospectiveId);
                        persistedRetrospective.attendees.push(persistedUser._id);
                        persistedRetrospective.save();
                    }
                    else {
                        console.log(persistedUser._id + ' already found in ' + persistedRetrospective.attendees);
                    }
                    _this.webSocketService.userAddedToRetrospective(retrospectiveId, currentUser.uuid);
                    resolve(persistedRetrospective);
                }
            });
        });
    };
    RetrospectiveService.prototype.addComment = function (currentUser, retrospectiveId, topicId, comment) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.doTopicAction(currentUser, retrospectiveId, topicId, function (error, persistedRetrospective, persistedTopic, persistedUser) {
                if (error) {
                    reject(error);
                }
                else {
                    if (!_this.canCreateComment(persistedRetrospective, persistedUser)) {
                        reject('Not allowed to create comment. Most probably retro has changed its status.');
                    }
                    else {
                        var persistedComment_1 = new RetrospectiveDbModel_1.PersistedRetrospectiveComment(comment.description, comment.title, comment.anonymous);
                        persistedComment_1.author = persistedUser._id;
                        persistedTopic.comments.push(persistedComment_1);
                        persistedRetrospective.save(function (err) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                _this.webSocketService.commentAddedToRetrospective(retrospectiveId, persistedComment_1.uuid);
                                resolve(persistedComment_1);
                            }
                        });
                    }
                }
            });
        });
    };
    RetrospectiveService.prototype.updateComment = function (currentUser, retroId, topicId, commentId, updateComment) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.doCommentAction(currentUser, retroId, topicId, commentId, function (error, pRetrospective, pTopic, pComment, pUser) {
                if (error) {
                    reject(error);
                }
                else {
                    if (!_this.canUpdateComment(pRetrospective, pUser, pComment)) {
                        reject('Not allowed to update comment. Most probably retro has changed its status.');
                    }
                    else {
                        pComment.title = updateComment.title || pComment.title;
                        pComment.description = updateComment.description || pComment.description;
                        pComment.anonymous = updateComment.anonymous || pComment.anonymous;
                        pRetrospective.save();
                        _this.webSocketService.commentUpdatedOnRetrospective(retroId, pComment.uuid);
                        resolve(pComment);
                    }
                }
            });
        });
    };
    RetrospectiveService.prototype.deleteComment = function (currentUser, retroId, topicId, commentId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.doCommentAction(currentUser, retroId, topicId, commentId, function (error, pRetrospective, pTopic, pComment, pUser) {
                if (error) {
                    reject(error);
                }
                else {
                    if (!_this.canUpdateComment(pRetrospective, pUser, pComment)) {
                        reject('Not allowed to delete comment. Most probably retro has changed its status.');
                    }
                    else {
                        pTopic.comments = pTopic.comments.filter(function (comment) { return comment.uuid !== commentId; });
                        pRetrospective.save();
                        _this.webSocketService.commentRemovedFromRetrospective(retroId, pComment.uuid);
                        resolve();
                    }
                }
            });
        });
    };
    RetrospectiveService.prototype.createVote = function (currentUser, retroId, topicId, commentId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.doCommentAction(currentUser, retroId, topicId, commentId, function (error, pRetrospective, pTopic, pComment, pUser) {
                if (error) {
                    reject(error);
                }
                else {
                    if (!pComment.votes || pComment.votes.findIndex(function (v) { return v.author.equals(pUser._id); }) >= 0) {
                        reject('User has already voted');
                    }
                    else {
                        if (!_this.canVote(pRetrospective, pUser)) {
                            reject('User not allowed to vote. Most probably retro has changed its status.');
                        }
                        else {
                            var newVote = new RetrospectiveDbModel_1.PersistedRetrospectiveVote(pUser._id);
                            pComment.votes.push(newVote);
                            pRetrospective.save();
                            resolve(newVote);
                        }
                    }
                }
            });
        });
    };
    RetrospectiveService.prototype.deleteVote = function (currentUser, retroId, topicId, commentId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.doCommentAction(currentUser, retroId, topicId, commentId, function (error, pRetrospective, pTopic, pComment, pUser) {
                if (error) {
                    reject(error);
                }
                else {
                    if (!pComment.votes) {
                        reject('No votes found');
                    }
                    else {
                        var lengthBefore = pComment.votes.length;
                        pComment.votes = pComment.votes.filter(function (v) { return !v.author.equals(pUser._id); });
                        if (pComment.votes.length === lengthBefore) {
                            reject('No vote from user ' + pUser.uuid + ' found');
                        }
                        else {
                            if (!_this.canVote(pRetrospective, pUser)) {
                                reject('User not allowed to delete vote. Most probably retro has changed its status.');
                            }
                            else {
                                pRetrospective.save();
                                resolve();
                            }
                        }
                    }
                }
            });
        });
    };
    RetrospectiveService.prototype.doRetrospectiveAction = function (currentUser, retroId, action) {
        var _this = this;
        this.retrospectiveRepository.findByUuid(retroId, function (retrospectiveLoadError, persistedRetrospective) {
            if (retrospectiveLoadError) {
                action(retrospectiveLoadError);
            }
            else if (!persistedRetrospective) {
                action('Persisted retrospective not found');
            }
            else {
                _this.userRepository.findByUuid(currentUser.uuid, function (userLoadError, persistedUser) {
                    if (userLoadError) {
                        action(userLoadError);
                    }
                    else if (!persistedUser) {
                        action('Persisted user not found');
                    }
                    else {
                        action(null, persistedRetrospective, persistedUser);
                    }
                });
            }
        });
    };
    RetrospectiveService.prototype.doTopicAction = function (currentUser, retroId, topicId, action) {
        this.doRetrospectiveAction(currentUser, retroId, function (error, persistedRetrospective, persistedUser) {
            if (error) {
                action(error);
            }
            else {
                if (persistedRetrospective.attendees.find(function (attendeeId) {
                    return attendeeId.equals(persistedUser._id);
                }) === null) {
                    action('User is not part of this retrospective');
                }
                var topic = persistedRetrospective.topics.find(function (topicEntry) { return topicEntry.uuid === topicId; });
                if (topic == null) {
                    action('Topic could not be found');
                }
                action(null, persistedRetrospective, topic, persistedUser);
            }
        });
    };
    RetrospectiveService.prototype.doCommentAction = function (currentUser, retroId, topicId, commentId, action) {
        this.doTopicAction(currentUser, retroId, topicId, function (error, persistedRetrospective, persistedTopic, persistedUser) {
            if (error) {
                action(error);
            }
            else {
                var comment = persistedTopic.comments.find(function (comment) { return commentId === comment.uuid; });
                if (comment == null) {
                    action('Comment could not be found');
                }
                else {
                    action(null, persistedRetrospective, persistedTopic, comment, persistedUser);
                }
            }
        });
    };
    RetrospectiveService = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.default.UserRepository)),
        __param(1, inversify_1.inject(types_1.default.RetrospectiveRepository)),
        __param(2, inversify_1.inject(types_1.default.WebSocketService)), 
        __metadata('design:paramtypes', [_1.UserRepository, _1.RetrospectiveRepository, WebSocketService_1.WebSocketService])
    ], RetrospectiveService);
    return RetrospectiveService;
}());
exports.RetrospectiveService = RetrospectiveService;
