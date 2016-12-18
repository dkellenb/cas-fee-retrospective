import * as TypeMoq from 'typemoq';
import { expect } from 'chai';

import {RetrospectiveService} from '../../src/service/RetrospectiveService';
import {UserRepository, UserDbModel} from '../../src/repository/UserRepository';
import {RetrospectiveRepository, RetrospectiveDbModel} from '../../src/repository/RetrospectiveRepository';
import {WebSocketService} from '../../src/service/WebSocketService';
import {CreateRetrospectiveJSON} from '../../../client/src/app/shared/model/retrospective/CreateRetrospectiveJSON';
import {IUserDbModel, IPersistedUser} from '../../src/repository/model/UserDbModel';
import {IUser} from '../../../client/src/app/shared/model/user/IUser';
import {UserRole} from '../../../client/src/app/shared/model/user/UserRole';
import {RetrospectiveStatus} from '../../../client/src/app/shared/model/retrospective/RetrospectiveStatus';
import {ObjectID} from 'mongodb';
import {ChangeStatusJSON} from '../../../client/src/app/shared/model/retrospective/ChangeStatusJSON';
import {IPersistedRetrospectiveDbModel} from '../../src/repository/model/RetrospectiveDbModel';

describe('RetrospectiveService', function() {

  let userRepository: TypeMoq.Mock<UserRepository>;
  let retrospectiveRepository: TypeMoq.Mock<RetrospectiveRepository>;
  let webSocketService: TypeMoq.Mock<WebSocketService>;
  let retrospectiveService: RetrospectiveService;

  let managerUser: IUser = <IUser>{
    uuid: '123-456-id',
    shortName: 'M',
    name: 'Manager',
    systemRole: UserRole.USER
  };

  beforeEach(() => {
    // setup
    userRepository = TypeMoq.Mock.ofType<UserRepository>(UserRepository);
    retrospectiveRepository = TypeMoq.Mock.ofType<RetrospectiveRepository>(RetrospectiveRepository);
    webSocketService = TypeMoq.Mock.ofType<WebSocketService>(WebSocketService);
    retrospectiveService = new RetrospectiveService(
      userRepository.object,
      retrospectiveRepository.object,
      webSocketService.object);
  });

  afterEach(function() {
    userRepository = null;
    retrospectiveRepository = null;
    webSocketService = null;
    retrospectiveService = null;
  });

  describe('#createRetrospective()', function() {

    it('should create retrospective', function (done) {
      // given
      let createRetrospective: CreateRetrospectiveJSON = <CreateRetrospectiveJSON>{};
      createRetrospective.name = 'Review Sprint 55';
      createRetrospective.description = 'After 2 week sprint. What is your impression?';

      userRepository.setup(r => r.findByUuid(TypeMoq.It.isAnyString(), TypeMoq.It.isAny())).callback((uuid, fncCallback) => {
        fncCallback(null, <IUserDbModel>{
          _id: new ObjectID('123456789012')
        });
      });
      retrospectiveRepository.setup(r => r.save(TypeMoq.It.isAny(), TypeMoq.It.isAny())).callback((retrospective, fncCallback) => {
        fncCallback(null, retrospective);
      });

      // when
      let createPromise = retrospectiveService.createRetrospective(managerUser, createRetrospective);

      // then
      createPromise.then((createdRetrospective) => {
        expect(createdRetrospective.status).to.be.equals(RetrospectiveStatus.OPEN);
        expect(createdRetrospective.name).to.be.equals(createRetrospective.name);
        expect(createdRetrospective.description).to.be.equals(createRetrospective.description);
        expect(createdRetrospective.topics.length).to.be.equals(3);
        done();
      }).catch((err) => {
        done(err);
      });
    });

  });

  describe('#changeStatus()', function() {

    it('should change status of retrospective', function (done){
      // given
      let retrospectiveId = '123-retro-id';
      let changeStatus: ChangeStatusJSON = <ChangeStatusJSON>{
        status: RetrospectiveStatus.REVIEW
      };
      let userDbId = '123456123456';
      userRepository.setup(r => r.findByUuid(TypeMoq.It.isAnyString(), TypeMoq.It.isAny())).callback((userId, fncCallback) => {
        fncCallback(null, createSimplePersistedUser(userDbId));
      });
      retrospectiveRepository.setup(r => r.findByUuid(TypeMoq.It.isAnyString(), TypeMoq.It.isAny())).callback((retroId, fncCallback) => {
        let simpleRetrospective = createSimplePersistedRetrospective(userDbId);
        fncCallback(null, simpleRetrospective);
      });
      retrospectiveRepository.setup(r => r.save(TypeMoq.It.isAny(), TypeMoq.It.isAny())).callback((retrospective, fncCallback) => {
        fncCallback(null, retrospective);
      });

      // when
      let changeStatusPromise = retrospectiveService.changeStatus(managerUser, retrospectiveId, changeStatus);

      // then
      changeStatusPromise.then((persistedRetrospective) => {
        expect(persistedRetrospective.status).to.be.equals(RetrospectiveStatus.REVIEW);
        done();
      }).catch((error) => {
        done(error);
      });
    });

  });

  function createSimplePersistedRetrospective(userDbId: string): IPersistedRetrospectiveDbModel {
    let userObjectDbId = new ObjectID(userDbId);
    let model = <IPersistedRetrospectiveDbModel>new RetrospectiveDbModel();
    model.uuid = '123-retro-id';
    model.name = 'Retro 123';
    model.description = 'Description 123';
    model.status = RetrospectiveStatus.OPEN;
    model.attendees = [userObjectDbId];
    model.manager = userObjectDbId;
    return model;
  }

  function createSimplePersistedUser(userDbId: string): IPersistedUser {
    let model = new UserDbModel();
    model._id = new ObjectID(userDbId);
    model.uuid = userDbId;
    model.shortName = 'M';
    model.name = 'Manager';
    model.systemRole = UserRole.USER;
    return <IPersistedUser>model;
  }

});
