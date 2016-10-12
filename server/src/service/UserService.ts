import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import { UUID } from '../../../shared/src/util/UUID';
import { UserRepository } from '../repository/UserRepository';
import { IUser, UserRole, UserJwt, CreateUserJSON, PublicUser } from '../../../shared/src/model';
import { UserJwtService } from './UserJwtService';
import { Request } from 'express';
import {IPersistedUser, PersistedUser, UserToken, IUserDbModel} from '../repository/model/UserDbModel';

@injectable()
export class UserService {

  static convertUserToPublicUser(persistedUser: IPersistedUser):PublicUser {
    let publicUser = new PublicUser();
    publicUser.uuid = persistedUser.uuid;
    publicUser.name = persistedUser.name;
    publicUser.shortName = persistedUser.shortName;
    return publicUser;
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
    let jwtUser = this.userJwtService.getJwtUser(request);
    return new Promise<IUser>((resolve, reject) => {
      this.userRepository.findByUuid(jwtUser.uuid, (error, data) => {
        if (error) {
          reject(error);
        } else if (!data) {
          reject(new UserUnknown('This user is unknown to the system.'));
        } else {
          resolve(jwtUser);
        }
      })
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

  public getPublicUser(userUuid: string): Promise<PublicUser> {
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
}

class UserUnknown extends Error {
  constructor(msg) {
    super(msg);
  }
}

