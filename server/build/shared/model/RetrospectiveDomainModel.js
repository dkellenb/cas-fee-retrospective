"use strict";
var RetrospectiveStatus = (function () {
    function RetrospectiveStatus() {
    }
    RetrospectiveStatus.OPEN = 'OPEN';
    RetrospectiveStatus.REVIEW = 'REVIEW';
    RetrospectiveStatus.GROUP = 'GROUP';
    RetrospectiveStatus.VOTE = 'VOTE';
    RetrospectiveStatus.CLOSED = 'CLOSED';
    return RetrospectiveStatus;
}());
exports.RetrospectiveStatus = RetrospectiveStatus;
