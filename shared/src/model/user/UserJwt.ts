import { IUser, User } from './User';
import { IUserToken } from './PersistedUser';

export interface IUserJwt extends IUser {
  validUntil: number;
}

export class UserJwt extends User implements IUserJwt {

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

  validUntil: number;

}
