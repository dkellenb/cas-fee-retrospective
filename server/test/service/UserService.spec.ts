import * as TypeMoq from 'typemoq';
import { expect } from 'chai';

import {UserService, UserUnknown} from '../../src/service/UserService';
import {UserRepository} from '../../src/repository/UserRepository';
import {UserJwtService} from '../../src/service/UserJwtService';
import {CreateUserJSON, UserRole} from '../../../client/src/app/shared/model';
import {IUserJwt} from '../../src/service/model';
import {IPersistedUser, IUserToken, IUserDbModel} from '../../src/repository/model/UserDbModel';
import { Request } from 'express';

describe('UserService', function() {

  let userService: UserService;
  let userRepository: TypeMoq.Mock<UserRepository>;
  let userJwtService: TypeMoq.Mock<UserJwtService>;

  beforeEach(() => {
    // setup
    userRepository = TypeMoq.Mock.ofType<UserRepository>(UserRepository);
    userJwtService = TypeMoq.Mock.ofType<UserJwtService>(UserJwtService);
    userService = new UserService(userRepository.object, userJwtService.object);
  });

  afterEach(function() {
    userRepository = null;
    userJwtService = null;
    userService = null;
  });

  describe('#createUser()', function() {

    it('Should create a user successfully', function(done) {
      // given
      let createUserJSON = <CreateUserJSON>{
        name: 'Mr. Bean',
        shortName: 'MB'
      };

      userRepository.setup(r => r.create(TypeMoq.It.isAny(), TypeMoq.It.isAny())).callback((userData, fncCallback) => {
        fncCallback(null, userData);
      });

      // when
      let promise = userService.createUser(createUserJSON);

      // then
      promise.then((user) => {
        expect(user.uuid).to.not.be.null;
        expect(user.name).to.be.equal(createUserJSON.name);
        expect(user.shortName).to.be.equal(createUserJSON.shortName);
        expect(user.systemRole).to.be.equal(UserRole.USER);
        expect(user.tokens).to.have.lengthOf(1);
        done();
      }).catch((err) => {
        done(err);
      });
    });

  });

  describe('#getJwtUser()', function () {

    let iUserJwt: IUserJwt;
    let iPersistedUser: IPersistedUser;

    beforeEach(function() {
      iUserJwt = <IUserJwt>{
        uuid: '123-123-123',
        name: 'Mr. Bean',
        shortName: 'MB',
        validUntil: 123,
        systemRole: UserRole.USER
      };

      iPersistedUser = <IPersistedUser>{};
      iPersistedUser.uuid = iUserJwt.uuid;
      iPersistedUser.name = iUserJwt.name;
    });

    let request = <Request>{};

    it('Should return JWT-based user from request', function(done) {
      // given
      userJwtService.setup(s => s.getJwtUser(TypeMoq.It.isAny())).returns(() => iUserJwt);
      userRepository.setup(r => r.findByUuid(TypeMoq.It.isAnyString(), TypeMoq.It.isAny())).callback((uuid, fncCallback) => {
        fncCallback(null, iPersistedUser);
      });

      // when
      let getJwtPromise = userService.getJwtUser(request);

      // then
      getJwtPromise.then((user) => {
        expect(user.uuid).to.be.equal(iUserJwt.uuid);
        done();
      }).catch((err) => {
        done(err);
      });
    });

    it('Should return user unknown if db returns no data', function (done) {
      // given
      userJwtService.setup(s => s.getJwtUser(TypeMoq.It.isAny())).returns(() => iUserJwt);
      userRepository.setup(r => r.findByUuid(TypeMoq.It.isAnyString(), TypeMoq.It.isAny())).callback((uuid, fncCallback) => {
        fncCallback(null, null); // no data
      });

      // when
      let getJwtPromise = userService.getJwtUser(request);

      // then
      getJwtPromise.then((user) => {
        done('Should not return an user');
      }).catch((err) => {
        expect(err).to.be.instanceof(UserUnknown);
      }).then(done, done);
    });

    it('Should return the error if a db error occurs', function(done) {
      // given
      userJwtService.setup(s => s.getJwtUser(TypeMoq.It.isAny())).returns(() => iUserJwt);
      userRepository.setup(r => r.findByUuid(TypeMoq.It.isAnyString(), TypeMoq.It.isAny())).callback((uuid, fncCallback) => {
        fncCallback('err', null); // no data
      });

      // when
      let getJwtPromise = userService.getJwtUser(request);

      // then
      getJwtPromise.then((user) => {
        done('Should not return an user');
      }).catch((err) => {
        expect(err).to.be.equals('err');
      }).then(done, done);
    });

  });

  describe('#getJwt()', function() {
    let userUuid = '123-456-user-uuid';
    let tokenUuid = '123-456-jwt-uuid';

    let token: IUserToken = <IUserToken>{};
    token.uuid = tokenUuid;
    token.validUntil = 1;

    let persistedUser: IUserDbModel = <IUserDbModel>{};
    persistedUser.uuid = userUuid;
    persistedUser.tokens = [];
    persistedUser.tokens.push(token);

    it('Should return the JWT for a specific user', function(done) {
      // given
      userJwtService.setup(s => s.createJwt(TypeMoq.It.isAny())).returns(() => 'encoded-jwt');
      userRepository.setup(s => s.findByUuid(TypeMoq.It.isAnyString(), TypeMoq.It.isAny())).callback((_userUuid, fncCallback) => {
        fncCallback(null, persistedUser);
      });

      // when
      let getJwtPromise = userService.getJwt(userUuid, tokenUuid);

      // then
      getJwtPromise.then((result) => {
        expect(result).to.be.equals('encoded-jwt');
        done();
      }).catch(() => {
        done('No exception expected');
      });
    });

    it('Should fail if user could not be found in the repository', function(done) {
      // given
      userRepository.setup(s => s.findByUuid(TypeMoq.It.isAnyString(), TypeMoq.It.isAny())).callback((_userUuid, fncCallback) => {
        fncCallback(null, null);
      });

      // when
      let getJwtPromise = userService.getJwt(userUuid, tokenUuid);

      // then
      getJwtPromise.then(() => {
        done('No success case expected');
      }).catch((err) => {
        expect(err.message).to.be.equals('This user is unknown to the system.');
        done();
      });
    });

  });

});
