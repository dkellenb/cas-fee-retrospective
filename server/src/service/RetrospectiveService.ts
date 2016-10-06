import { injectable, inject } from 'inversify';
import { IRetrospective, CreateRetrospectiveJSON, IUser, Retrospective, RetrospectiveUser, PublicUser } from '../../../shared/src/model';
import { UserService } from './UserService';
import TYPES from '../constant/types';
import {UserRole} from '../../../shared/src/model/user/User';

@injectable()
export class RetrospectiveService {

  private static convertPublicUserToRetrospectiveUser(publicUser: PublicUser, retrospective: IRetrospective): RetrospectiveUser {
    let retrospectiveUser = <RetrospectiveUser>publicUser;
    retrospectiveUser.role = retrospective.managers.indexOf(publicUser.uuid) !== -1 ? UserRole.MANAGER : UserRole.USER;
    return retrospectiveUser;
  }

  private retrospectiveStorage: IRetrospective[] = [];

  constructor(
    @inject(TYPES.UserService) private userService: UserService
  ) {

  }

  public getRetrospectives(): IRetrospective[] {
    return this.retrospectiveStorage;
  }

  public getRetrospective(id: string): IRetrospective {
    let result: IRetrospective = null;
    this.retrospectiveStorage.map(retrospective => {
      if (retrospective.uuid === id) {
        result = retrospective;
      }
    });

    return result;
  }

  public getRetrospectiveSecured(currentUser: IUser, id: string): IRetrospective {
    let retrospective = this.getRetrospective(id);
    if (retrospective.attendees.indexOf(currentUser.uuid) === -1) {
      throw new IllegalAccess('Illegal access to retrospective ' + id);
    }
    return retrospective;
  }

  public createRetrospective(currentUser: IUser, createRetrospectiveJSON: CreateRetrospectiveJSON): IRetrospective {
    let retrospective = Retrospective.create(createRetrospectiveJSON);
    retrospective.attendees.push(currentUser.uuid);
    retrospective.managers.push(currentUser.uuid);
    this.retrospectiveStorage.push(retrospective);
    return retrospective;
  }

  public updateRetrospective(id: string, retrospective: IRetrospective): IRetrospective {
    this.retrospectiveStorage.map((entry, index) => {
      if (entry.uuid === id) {
        this.retrospectiveStorage[index] = retrospective;
      }
    });

    return retrospective;
  }

  public deleteRetrospective(id: string): string {
    let updatedRetrospective: IRetrospective[] = [];
    this.retrospectiveStorage.map(retrospective => {
      if (retrospective.uuid !== id) {
        updatedRetrospective.push(retrospective);
      }
    });

    this.retrospectiveStorage = updatedRetrospective;
    return id;
  }

  public getRetrospectiveUsers(currentUser: IUser, id: string): RetrospectiveUser[] {
    let retrospective = this.getRetrospectiveSecured(currentUser, id);
    return this.userService.getPublicUsers(retrospective.attendees).map(u => {
      return RetrospectiveService.convertPublicUserToRetrospectiveUser(u, retrospective);
    });
  }

  public getRetrospectiveUser(currentUser: IUser, id: string, uuid: string): RetrospectiveUser {
    let retrospective = this.getRetrospectiveSecured(currentUser, id);
    if (retrospective.attendees.indexOf(uuid) === -1) {
      throw new IllegalAccess('Not allowed to access user ' + uuid);
    }
    let publicUser = this.userService.getPublicUser(uuid);
    return RetrospectiveService.convertPublicUserToRetrospectiveUser(publicUser, retrospective);
  }

  public joinRetrospective(jwtUser: IUser, id: string) {
    let retrospective = this.getRetrospective(id);
    retrospective.attendees.push(jwtUser.uuid);
    this.updateRetrospective(id, retrospective);
  }
}

class IllegalAccess extends Error {

}
