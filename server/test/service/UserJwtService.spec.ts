import { UserJwtService } from '../../src/service/UserJwtService';
import { expect } from 'chai';
import { Request } from 'express';
import { sign }  from 'jsonwebtoken';
import * as TypeMoq from 'typemoq';



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
      let jwt = sign('Hello', 'V6LjnzR0mhQm2Ad81k8j');

      let mockRequest: TypeMoq.Mock<Request> = TypeMoq.Mock.ofType<Request>(Request);
      mockRequest.setup(x => x.header('Authorization')).returns(() => jwt);

      // when
      let jwtUser = UserJwtService.getJwtUser(mockRequest.object);

      // then
      expect(jwtUser.name).eq('demo-user');
    });

  });

});
