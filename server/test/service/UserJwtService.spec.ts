import { UserJwtService } from '../../src/service/UserJwtService';
import { expect } from 'chai';

describe('UserJwtService', function() {

  beforeEach(() => {
    // setup
  });

  afterEach(function() {
    // teardown
  });

  describe('#getJwtUser()', function() {

    it('Should decode sample JWT string', function() {
      // given
      // let jwt = '';

      // when
      let jwtUser = UserJwtService.getJwtUser(null);

      // then
      expect(jwtUser.name).eq('demo-user');
    });

  });

});
