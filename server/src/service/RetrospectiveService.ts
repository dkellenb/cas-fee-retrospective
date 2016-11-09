import { injectable, inject } from 'inversify';
import { IRetrospective, CreateRetrospectiveJSON, IUser, RetrospectiveUser } from '../../../shared/src/model';
import { UserService } from './UserService';
import TYPES from '../constant/types';
import {UserRole} from '../../../shared/src/model';
import {UserRepository, RetrospectiveRepository, RetrospectiveDbModel} from '../repository/';
import {
  RetrospectiveStatus,
  UpdateRetrospectiveJSON
} from '../../../shared/src/model/retrospective/RetrospectiveDomainModel';
import {IPersistedRetrospectiveDbModel, IPopulatedRetrospective} from '../repository/model/RetrospectiveDbModel';
import {UUID} from '../../../shared/src/util/UUID';
import {IPersistedUser} from '../repository/model/UserDbModel';


@injectable()
export class RetrospectiveService {

  private static convertToRetrospectiveUser(persistedUser: IPersistedUser, manager: IPersistedUser): RetrospectiveUser {
    let retrospectiveUser = new RetrospectiveUser();
    retrospectiveUser.uuid = persistedUser.uuid;
    retrospectiveUser.name = persistedUser.name;
    retrospectiveUser.shortName = persistedUser.shortName;
    retrospectiveUser.role = manager.uuid === persistedUser.uuid ? UserRole.MANAGER : UserRole.USER;
    return retrospectiveUser;
  }

  constructor(
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.RetrospectiveRepository) private retrospectiveRepository: RetrospectiveRepository,
  ) {

  }

  public getRetrospectives(currentUser: IUser): Promise<IRetrospective[]> {
    return new Promise<IPersistedRetrospectiveDbModel>((resolve, reject) => {
      // TODO IMPLEMENT
    });
  }

  public getRetrospective(uuid: string): Promise<IPopulatedRetrospective> {
    return new Promise<IPopulatedRetrospective>((resolve, reject) => {
      this.retrospectiveRepository.findByUuidPopulated(uuid, (error, retrospective) => {
        if (error) {
          reject(error);
        } else {
          resolve(retrospective);
        }
      });
    });
  }

  public getRetrospectiveSecured(currentUser: IUser, uuid: string): Promise<IPopulatedRetrospective> {
    return new Promise<IPopulatedRetrospective>((resolve, reject) => {
      this.getRetrospective(uuid)
        .then((retrospective) => {
          if (retrospective.attendees.find((attendee) => attendee.uuid === currentUser.uuid)) {
            resolve(retrospective);
          } else {
            reject('Illegal access to retrospective ' + uuid);
          }
        });
    });
  }

  public createRetrospective(currentUser: IUser, createRetrospectiveJSON: CreateRetrospectiveJSON):
      Promise<IPersistedRetrospectiveDbModel> {
    return new Promise<IPersistedRetrospectiveDbModel>((resolve, reject) => {
      let retrospective = <IPersistedRetrospectiveDbModel>new RetrospectiveDbModel(createRetrospectiveJSON);
      retrospective.uuid = new UUID().toString();
      retrospective.status = RetrospectiveStatus.OPEN;
      this.userRepository.findByUuid(currentUser.uuid, (error, user) => {
        if (error) {
          reject(error);
        } else {
          retrospective.attendees.push(user._id);
          retrospective.manager = user._id;
          retrospective.save();
          resolve(retrospective);
        }
      });
    });
  }

  public updateRetrospective(currentUser: IUser, id: string, retrospective: UpdateRetrospectiveJSON): IRetrospective {
    // TODO IMPLEMENT
    return null;
  }

  public deleteRetrospective(currentUser: IUser, id: string): string {
    // TODO IMPLEMENT
    return null;
  }

  public getRetrospectiveUsers(currentUser: IUser, id: string): Promise<RetrospectiveUser[]> {
    return new Promise<RetrospectiveUser[]>((resolve, reject) => {
      this.getRetrospectiveSecured(currentUser, id).then((retrospective) => {
        // as get retrospective secured return all references loaded, we can safely cast here and two lines bellow
        let manager = retrospective.manager as IPersistedUser;
        let retrospectiveUsers = retrospective.attendees.map((u) => {
          return RetrospectiveService.convertToRetrospectiveUser(u as IPersistedUser, manager);
        });
        resolve(retrospectiveUsers);
      });
    });
  }

  public getRetrospectiveUser(currentUser: IUser, id: string, uuid: string): Promise<RetrospectiveUser> {
    return new Promise<RetrospectiveUser>((resolve, reject) => {
      this.getRetrospectiveSecured(currentUser, id).then((retrospective) => {
        // as get retrospective secured return all references loaded, we can safely cast here and two lines bellow
        let manager = retrospective.manager as IPersistedUser;
        let attendees = retrospective.attendees as IPersistedUser[];
        let attendee = RetrospectiveService.convertToRetrospectiveUser(attendees.find((u) => u.uuid === uuid), manager);
        resolve(attendee);
      });
    });
  }

  public joinRetrospective(currentUser: IUser, id: string): Promise<IPersistedRetrospectiveDbModel> {
    return new Promise<IPersistedRetrospectiveDbModel>((resolve, reject) => {
      this.retrospectiveRepository.findByUuid(id, (retrospectiveLoadError, persistedRetrospective) => {
        if (retrospectiveLoadError) {
          reject(retrospectiveLoadError);
        } else {
          this.userRepository.findByUuid(currentUser.uuid, (userLoadError, persistedUser) => {
            if (userLoadError) {
              reject(userLoadError);
            } else {
              persistedRetrospective.attendees.push(persistedUser._id);
              persistedRetrospective.save();
              resolve(persistedRetrospective);
            }
          });
        }
      });
    });
  }
}
