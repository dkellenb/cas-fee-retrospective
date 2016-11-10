import * as mongoose from 'mongoose';
import { IUser } from '../../../../shared/src/model';
import { UUID } from '../../../../shared/src/util';
import * as moment from 'moment';
import {UserRole} from '../../../../shared/src/model/UserDomainModel';

/**
 * Interface for a user token.
 */
export interface IUserToken {
  /** Unique identifier of this token. */
  uuid: string;

  /** Validity of token until (unix time). */
  validUntil: number;
}

/**
 * Interface representing a persisted user.
 */
export interface IPersistedUser extends IUser {
  tokens: IUserToken[];
}

/**
 * Interface representing a persisted user from db point of view.
 */
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
 * Implementation of a user.
 */
export class User implements IUser {

  public uuid: string;
  public shortName: string;
  public name?: string;
  public email?: string;
  public systemRole: UserRole;

  /**
   * Creates a User based on objects delivering the specified fields.
   *
   * @param iUser any object matching the interface
   * @returns {User} a user implementation
   */
  public static from(iUser: IUser): User {
    let user = new User();
    user.copyUserValues(iUser);
    return user;
  }

  constructor() {
    this.uuid = new UUID().toString();
  }

  public copyUserValues(source: IUser) {
    this.uuid = source.uuid;
    this.shortName = source.shortName;
    this.name = source.name || null;
    this.email = source.email || null;
    this.systemRole = source.systemRole || UserRole.USER;
  }

}

/**
 * Concrete implementation of a persisted user (cleaning up the full mongoose context).
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
