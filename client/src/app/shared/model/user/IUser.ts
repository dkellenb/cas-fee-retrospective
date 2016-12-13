import {UserRole} from './UserRole';

export interface IUser {
  uuid: string;
  shortName: string;
  name?: string;
  email?: string;
  systemRole: UserRole;
}
