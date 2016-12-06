"use strict";
var UUID = (function () {
    function UUID(uuid) {
        this.uuid = uuid || UUID.createUUID();
    }
    UUID.createUUID = function () {
        /* tslint:disable */
        // your favourite uuid generation function could go here
        // ex: http://stackoverflow.com/a/8809472/188246
        var date = new Date();
        var d = date.getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        /* tslint:enable */
    };
    UUID.prototype.toString = function () {
        return this.uuid;
    };
    return UUID;
}());
exports.UUID = UUID;
