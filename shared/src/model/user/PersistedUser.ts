import {UUID} from '../../util/UUID';
import {IUser, User} from './User';
import * as moment from 'moment';

export interface IUserToken {
  /** Unique identifier of this token. */
  uuid: string;

  /** Validity of token until (unix time). */
  validUntil: number;
}

export interface IPersistedUser extends IUser {
  token: IUserToken[];
}

/**
 * Implementation of a UserToken. Contains a unique identification and defines how long it's valid.
 */
export class UserToken implements IUserToken {

  uuid: string;
  validUntil: number;

  /**
   * Creates a UserToken based on objects delivering the specified fields.
   *
   * @param iToken any object matching the interface
   * @returns {UserToken} a token implementation
   */
  public static from(iToken: IUserToken): UserToken {
    let userToken = new UserToken();
    userToken.uuid = iToken.uuid;
    userToken.validUntil = iToken.validUntil;
    return userToken;
  }

  /**
   * C'tor with default validity.
   *
   * @param validUntilDate validity
   */
  constructor(validUntilDate: Date = null) {
    this.uuid = new UUID().toString();
    this.validUntil = validUntilDate ? validUntilDate.getTime() : moment().add(3, 'years').unix();
  }

  /**
   * Checks if the token is still valid (from the date).
   * @returns {boolean} false if it's not valid anymore
   */
  public isValid(): boolean {
    return moment().unix() < this.validUntil;
  }

}

/**
 * Concrete implementation of a user.
 */
export class PersistedUser extends User implements IPersistedUser {

  token: UserToken[];

  /**
   * Creates a User based on objects delivering the specified fields.
   *
   * @param iUser any object matching the interface
   * @returns {User} a user implementation
   */
  public static from(iUser: IPersistedUser): PersistedUser {
    let user = new PersistedUser();
    user.copyValues(iUser);
    return user;
  }

  copyValues(source: IPersistedUser) {
    super.copyUserValues(source);
    this.token = [];
    for (let token of source.token) {
      this.token.push(UserToken.from(token));
    }
  }

}

