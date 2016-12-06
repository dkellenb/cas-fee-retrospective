"use strict";
var User_1 = require('./User');
var PublicRetrospective = (function () {
    function PublicRetrospective() {
    }
    PublicRetrospective.fromRetrospective = function (populatedRetrospective) {
        var retrospective = new PublicRetrospective();
        retrospective.uuid = populatedRetrospective.uuid;
        retrospective.name = populatedRetrospective.name;
        retrospective.description = populatedRetrospective.description;
        retrospective.status = populatedRetrospective.status;
        retrospective.attendees = populatedRetrospective.attendees.map(function (attendee) { return User_1.RetrospectiveUser.fromRetrospective(attendee, populatedRetrospective.manager); });
        retrospective.topics = populatedRetrospective.topics.map(function (topics) { return PublicRetrospectiveTopic.fromRetrospective(topics); });
        return retrospective;
    };
    return PublicRetrospective;
}());
exports.PublicRetrospective = PublicRetrospective;
var PublicRetrospectiveTopic = (function () {
    function PublicRetrospectiveTopic() {
    }
    PublicRetrospectiveTopic.fromRetrospective = function (populatedTopic) {
        var topic = new PublicRetrospectiveTopic();
        topic.uuid = populatedTopic.uuid;
        topic.name = populatedTopic.name;
        topic.comments = populatedTopic.comments.map(function (comment) { return PublicRetrospectiveComment.fromRetrospective(comment, populatedTopic); });
        return topic;
    };
    return PublicRetrospectiveTopic;
}());
exports.PublicRetrospectiveTopic = PublicRetrospectiveTopic;
var PublicRetrospectiveComment = (function () {
    function PublicRetrospectiveComment() {
    }
    PublicRetrospectiveComment.fromRetrospective = function (populatedRetrospectiveComment, populatedTopic) {
        var comment = new PublicRetrospectiveComment();
        comment.uuid = populatedRetrospectiveComment.uuid;
        comment.title = populatedRetrospectiveComment.title;
        comment.description = populatedRetrospectiveComment.description;
        comment.anonymous = populatedRetrospectiveComment.anonymous;
        comment.author = User_1.RetrospectiveUser.fromRetrospective(populatedRetrospectiveComment.author);
        comment.votes = populatedRetrospectiveComment.votes.map(function (vote) { return PublicRetrospectiveVote.fromRetrospective(vote); });
        comment.topicUuid = populatedTopic.uuid;
        return comment;
    };
    return PublicRetrospectiveComment;
}());
exports.PublicRetrospectiveComment = PublicRetrospectiveComment;
var PublicRetrospectiveVote = (function () {
    function PublicRetrospectiveVote() {
    }
    PublicRetrospectiveVote.fromRetrospective = function (populatedVote) {
        var vote = new PublicRetrospectiveVote();
        vote.uuid = populatedVote.uuid;
        vote.author = User_1.RetrospectiveUser.fromRetrospective(populatedVote.author);
        vote.value = populatedVote.value;
        return vote;
    };
    return PublicRetrospectiveVote;
}());
exports.PublicRetrospectiveVote = PublicRetrospectiveVote;
