import {UUID} from '../util/uuid';

export interface IUserToken {
  uuid: UUID;
  valid: Date;
}

export interface IUser {
  uuid: UUID;
  shortName: string;
  name?: string;
  email?: string;
  token: IUserToken[];
}