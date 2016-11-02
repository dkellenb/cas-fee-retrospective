import * as mongoose from 'mongoose';
import { IUser, IUserToken, User } from '../../../../shared/src/model';
import { UUID } from '../../../../shared/src/util';
import * as moment from 'moment';

export interface IPersistedUser extends IUser {
  tokens: IUserToken[];
}

export interface IUserDbModel extends mongoose.Document, IPersistedUser {

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

  tokens: UserToken[];

  /**
   * Creates a User based on objects delivering the specified fields.
   *
   * @param iUser any object matching the interface
   * @returns {User} a user implementation
   */
  public static from(iUser: IUserDbModel): PersistedUser {
    let user = new PersistedUser();
    user.copyValues(iUser);
    return user;
  }

  copyValues(source: IUserDbModel) {
    super.copyUserValues(source);
    this.tokens = [];
    for (let token of source.tokens) {
      this.tokens.push(UserToken.from(token));
    }
  }

}
