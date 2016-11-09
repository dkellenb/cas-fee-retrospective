import {UUID} from '../../util/UUID';

export class UserRole {
  static USER: string = 'USER';
  static MANAGER: string = 'MANAGER';
  static ADMIN: string = 'ADMIN';
}

export class PublicUser {
  public uuid: string;
  public shortName: string;
  public name?: string;
}

export interface IUser {
  uuid: string;
  shortName: string;
  name?: string;
  email?: string;
  systemRole: UserRole;
}

export class User implements IUser {

  public uuid: string;
  public shortName: string;
  public name?: string;
  public email?: string;
  public systemRole: UserRole;

  /**
   * Creates a UserJwt based on objects delivering the specified fields.
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
    // Object.assign(user, iUser) does not work, as then we would have no type for token
    this.uuid = source.uuid;
    this.shortName = source.shortName;
    this.name = source.name || null;
    this.email = source.email || null;
    this.systemRole = source.systemRole || UserRole.USER;
  }

}
