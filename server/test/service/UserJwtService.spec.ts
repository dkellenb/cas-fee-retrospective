import { UserJwtService } from '../../src/service/UserJwtService';
import { UserJwtKeyProvider, UserStaticJwtKeyProvider } from '../../src/service/UserJwtKeyProvider';
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
      let staticJwtKeyProvider = TypeMoq.Mock.ofType<UserJwtKeyProvider>(UserStaticJwtKeyProvider);
      staticJwtKeyProvider.setup(x => x.getKey()).returns(() => 'testKey');
      let jwt = sign('{ "name": "demo-user" }', 'testKey');

      // setup instance to be tested
      let userJwtService = new UserJwtService(staticJwtKeyProvider.object);

      let mockRequest: TypeMoq.Mock<Request> = <any>TypeMoq.Mock.ofInstance({ header : (x: string) => ''});
      mockRequest.setup(x => x.header('Authorization')).returns((x: string) => 'Bearer ' + jwt);

      // when
      let jwtUser = userJwtService.getJwtUser(mockRequest.object);

      // then
      expect(jwtUser.name).eq('demo-user');
    });

  });

});
