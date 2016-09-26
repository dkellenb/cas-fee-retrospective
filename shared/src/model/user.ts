import {UUID} from '../util/uuid';

export enum UserRole {
  USER,
  MANAGER,
  ADMIN
}

export interface IUserToken {
  uuid: UUID;
  valid: Date;
}

export interface IUser extends IUserJwt {
  token: IUserToken[];
}

export interface IUserJwt {
  uuid: UUID;
  shortName: string;
  name?: string;
  email?: string;
  systemRole: UserRole;
}