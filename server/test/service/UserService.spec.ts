import {UserService} from '../../src/service/UserService';
import {UserRepository} from '../../src/repository/UserRepository';
import {UserJwtService} from '../../src/service/UserJwtService';
import * as TypeMoq from 'typemoq';
import {CreateUserJSON, UserRole} from '../../../client/src/app/shared/model/UserDomainModel';
import { expect } from 'chai';

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

});
