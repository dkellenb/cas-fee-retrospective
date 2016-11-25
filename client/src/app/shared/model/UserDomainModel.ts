
export class UserRole {
  static USER: string = 'USER';
  static MANAGER: string = 'MANAGER';
  static ADMIN: string = 'ADMIN';
}

export interface IUser {
  uuid: string;
  shortName: string;
  name?: string;
  email?: string;
  systemRole: UserRole;
}

export interface IRetrospectiveUser {
  uuid: string;
  shortName: string;
  name?: string;
  role: UserRole;
}

export interface CreateUserJSON {
  shortName: string;
  name?: string;
  email?: string;
}

export interface UpdateUserJSON {
  shortName: string;
  name?: string;
  email?: string;
}

