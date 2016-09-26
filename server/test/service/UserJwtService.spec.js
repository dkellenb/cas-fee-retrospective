"use strict";
var UserJwtService_1 = require('../../src/service/UserJwtService');
var chai_1 = require('chai');
describe('UserJwtService', function () {
    beforeEach(function () {
        // setup
    });
    afterEach(function () {
        // teardown
    });
    it('Should decode sample JWT string', function () {
        // given
        var jwt = '';
        // when
        var jwtUser = UserJwtService_1.UserJwtService.getJwtUser(null);
        // then
        chai_1.expect(jwtUser.name).eq('demo-user');
    });
});
//# sourceMappingURL=UserJwtService.spec.js.map