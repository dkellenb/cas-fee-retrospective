import {UserRole} from './UserRole';

export interface IRetrospectiveUser {
  uuid: string;
  shortName: string;
  name?: string;
  role: UserRole;
}
