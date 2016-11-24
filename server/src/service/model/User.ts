import {UserRole} from '../../../../client/src/app/shared/model/';
import {IUser} from '../../../../client/src/app/shared/model/';
import {User, IUserToken, IPersistedUser} from '../../repository/model/UserDbModel';
import {IRetrospectiveUser} from '../../../../client/src/app/shared/model/UserDomainModel';

export class PublicUser {
  public uuid: string;
  public shortName: string;
  public name?: string;
}

export class RetrospectiveUser extends PublicUser implements IRetrospectiveUser {
  role: UserRole;

  public static fromRetrospective(persistedUser: IPersistedUser, manager?: IPersistedUser): RetrospectiveUser {
    let retrospectiveUser = new RetrospectiveUser();
    retrospectiveUser.uuid = persistedUser.uuid;
    retrospectiveUser.name = persistedUser.name;
    retrospectiveUser.shortName = persistedUser.shortName;
    retrospectiveUser.role = manager && manager.uuid === persistedUser.uuid ? UserRole.MANAGER : UserRole.USER;
    return retrospectiveUser;
  }
}

export interface IUserJwt extends IUser {
  /* until this user JWT is valid. */
  validUntil: number;
}

export class UserJwt extends User implements IUserJwt {

  /* until this user JWT is valid. */
  validUntil: number;

  /**
   * Creates a User based on objects delivering the specified fields.
   *
   * @param iUser any object matching the interface
   * @returns {User} a user implementation
   */
  public static from(iUser: IUserJwt): UserJwt {
    let user = new UserJwt();
    user.copyValues(iUser);
    return user;
  }

  public static create(iUser: IUser, token: IUserToken) {
    let user = new UserJwt();
    user.validUntil = token.validUntil;
    user.copyUserValues(iUser);
    return user;
  }

  copyValues(source: IUserJwt) {
    super.copyUserValues(source);
    this.validUntil = source.validUntil;
  }

}


