import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import { Request } from 'express';
import { UUID } from '../../../shared/src/util/UUID';
import { UserRepository } from '../repository/UserRepository';
import { IUser, UserRole, CreateUserJSON } from '../../../shared/src/model';
import { UserJwtService } from './UserJwtService';
import { IPersistedUser, PersistedUser, UserToken, User } from '../repository/model/UserDbModel';
import { PublicUser, UserJwt } from './model/User';
import {UpdateUserJSON} from '../../../shared/src/model/UserDomainModel';
import {ErrorWithMessage} from '../../../shared/src/util/ErrorWithMessage';

@injectable()
export class UserService {

  static convertUserToPublicUser(persistedUser: IPersistedUser):PublicUser {
    let publicUser = new PublicUser();
    publicUser.uuid = persistedUser.uuid;
    publicUser.name = persistedUser.name;
    publicUser.shortName = persistedUser.shortName;
    return publicUser;
  }

  static convertUserToIUser(persistedUser: IPersistedUser):IUser {
    let user = new User();
    user.uuid = persistedUser.uuid;
    user.name = persistedUser.name;
    user.shortName = persistedUser.shortName;
    user.systemRole = persistedUser.systemRole;
    return user;
  }

  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.UserJwtService) private userJwtService: UserJwtService
  ) {

  }

  public createUser(createUser: CreateUserJSON): Promise<IPersistedUser> {
    console.log('UserService#createUser');

    // create user
    let user = new PersistedUser();
    user.uuid = new UUID().toString();
    user.shortName = createUser.shortName;
    user.name = createUser.name || '';
    user.email = createUser.email || '';
    user.systemRole = UserRole.USER;

    // create token for the user
    let userToken = new UserToken();
    user.tokens = user.tokens || [];
    user.tokens.push(userToken);

    // save the user
    return new Promise<IPersistedUser>((resolve, reject) => {
      this.userRepository.create(<any>user, (error, data) => {
        if (error) {
          reject(error);
        } else if (!data) {
          reject('User could not be created');
        } else {
          console.log('UserService#createUser@promise');
          resolve(data);
        }
      });
    });
  }

  public getJwtUser(request: Request): Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
      let jwtUser = this.userJwtService.getJwtUser(request);
      this.userRepository.findByUuid(jwtUser.uuid, (error, data) => {
        if (error) {
          reject(error);
        } else if (!data) {
          reject(new UserUnknown('This user is unknown to the system.'));
        } else {
          console.log(data);
          resolve(jwtUser);
        }
      });
    });
  }

  public getJwt(userUuid: string, jwtUuid: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.userRepository.findByUuid(userUuid, (error, user) => {
        if (error) {
          reject(error);
        } else if (!user) {
          reject(new UserUnknown('This user is unknown to the system.'));
        } else {
          console.log('Try fetch ' + jwtUuid + ' from ' + JSON.stringify(user));
          let singleToken = (user.tokens || []).find(t => t.uuid === jwtUuid);
          if (singleToken !== null) {
            console.log('Token found: ' + JSON.stringify(singleToken));
            let jwtUser = UserJwt.create(user, singleToken);
            resolve(this.userJwtService.createJwt(jwtUser));
          } else {
            reject(new Error('No valid JWT found'));
          }
        }
      });
    });
  }

  public getAllUsers(currentUser: User): Promise<IUser[]> {
    return new Promise<IUser[]>((resolve, reject) => {
      if (currentUser.systemRole !== UserRole.ADMIN) {
        console.log('User ' + currentUser.name + ' is not allowed to fetch all users from the system');
        throw new InvalidAccess('You are not allowed to fetch all users from the system');
      } else {
        this.userRepository.retrieve((error, users) => {
          if (error) {
            console.log(error);
            reject(error);
          } else if (!users) {
            reject('No users found');
          } else {
            resolve(users.map(u => UserService.convertUserToIUser(u)));
          }
        });
      }
    });
  }

  public getPublicUsers(userUuids: string[]): Promise<PublicUser[]> {
    return new Promise<PublicUser[]>((resolve, reject) => {
      this.userRepository.findByUuids(userUuids, (error, users) => {
        if (error) {
          reject(error);
        } else if (!users) {
          reject('No users found');
        } else {
          resolve(users.map(u => UserService.convertUserToPublicUser(u)));
        }
      });
    });
  }

  public getPublicUser(currentUser: User, userUuid: string): Promise<PublicUser> {
    return new Promise<PublicUser>((resolve, reject) => {
      this.userRepository.findByUuid(userUuid, (error, user) => {
        if (error) {
          reject(error);
        } else if (!user) {
          reject('User with uuid ' + userUuid + ' not found.');
        } else {
          resolve(UserService.convertUserToPublicUser(user));
        }
      });
    });
  }

  public updateUser(currentUser: User, userUuid: string, updateUser: UpdateUserJSON): Promise<PublicUser> {
    return new Promise<PublicUser>((resolve, reject) => {
      this.userRepository.findByUuid(userUuid, (error, user) => {
        if (error) {
          reject(error);
        } else if (!user) {
          reject('User with uuid ' + userUuid + ' not found.');
        } else if (currentUser.uuid !== user.uuid && currentUser.systemRole !== UserRole.ADMIN) {
          reject('You are not allowed to update user with uuid ' + userUuid);
        } else {
          user.shortName = updateUser.shortName || user.shortName;
          user.email = updateUser.email || user.email;
          user.name = updateUser.name || user.name;
          user.save();
          resolve(UserService.convertUserToPublicUser(user));
        }
      });
    });
  }

  public deleteUser(currentUser: User, userUuid: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (currentUser.uuid === userUuid || currentUser.systemRole === UserRole.ADMIN) {
        this.userRepository.deleteByUuid(currentUser.uuid, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      } else {
        reject('User with uuid ' + currentUser.uuid + ' cannot be deleted. Insufficient privileges');
      }
    });
  }
}

class UserUnknown extends ErrorWithMessage {
  constructor(msg) {
    super(msg);
  }
}

class InvalidAccess extends ErrorWithMessage {
  constructor(msg) {
    super(msg);
  }
}
