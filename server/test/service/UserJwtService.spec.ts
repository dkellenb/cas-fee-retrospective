import { UserJwtService } from '../../src/service/UserJwtService';
import { expect } from 'chai';
import { Request } from 'express';
import { sign }  from 'jsonwebtoken';
import * as TypeMoq from 'typemoq';
import {UserJwtKeyProvider, UserStaticJwtKeyProvider} from "../../src/service/UserJwtKeyProvider";


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

      let mockRequest: TypeMoq.Mock<Request> = TypeMoq.Mock.ofType<Request>(Request);
      mockRequest.setup(x => x.header('Authorization')).returns(() => jwt);

      // when
      let jwtUser = userJwtService.getJwtUser(mockRequest.object);

      // then
      expect(jwtUser.name).eq('demo-user');
    });

  });

});
