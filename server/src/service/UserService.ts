import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import { Request } from 'express';
import { IUser, UserRole, CreateUserJSON, UpdateUserJSON } from '../../../client/src/app/shared/model/';
import { UUID, ErrorWithMessage } from '../../../client/src/app/shared/util/';
import { UserRepository } from '../repository/UserRepository';
import { UserJwtService } from './UserJwtService';
import { IPersistedUser, PersistedUser, UserToken, User } from '../repository/model/UserDbModel';
import { PublicUser, UserJwt } from './model/User';

/**
 * Business logic for user related actions.
 */
@injectable()
export class UserService {

  /**
   * Converts a user object to contain only public available fields.
   *
   * @param persistedUser the persisted user
   * @returns {PublicUser} the public user
   */
  static convertUserToPublicUser(persistedUser: IPersistedUser): PublicUser {
    let publicUser = new PublicUser();
    publicUser.uuid = persistedUser.uuid;
    publicUser.name = persistedUser.name;
    publicUser.shortName = persistedUser.shortName;
    return publicUser;
  }

  /**
   * Converts a persisted user to a business object user.
   *
   * @param persistedUser persisted user
   * @returns {User} the business object user
   */
  static convertUserToIUser(persistedUser: IPersistedUser): IUser {
    let user = new User();
    user.uuid = persistedUser.uuid;
    user.name = persistedUser.name;
    user.shortName = persistedUser.shortName;
    user.systemRole = persistedUser.systemRole;
    return user;
  }

  /**
   * C'tor with dependencies injected.
   *
   * @param userRepository user repository.
   * @param userJwtService jwt service.
   */
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.UserJwtService) private userJwtService: UserJwtService
  ) {

  }

  /**
   * Based on a create request from the client create a new user.
   *
   * @param createUser the new user to be created
   * @returns {Promise<IPersistedUser>} the persisted user
   */
  public createUser(createUser: CreateUserJSON): Promise<IPersistedUser> {
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
          resolve(data);
        }
      });
    });
  }

  /**
   * Based on a request, get the user encoded with JWT.
   *
   * @param request the HTTP request
   * @returns {Promise<IUser>} decoded user
   */
  public getJwtUser(request: Request): Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
      let jwtUser = this.userJwtService.getJwtUser(request);
      if (!jwtUser) {
        reject(new UserUnknown('JWT could not be decoded'));
      }
      this.userRepository.findByUuid(jwtUser.uuid, (error, data) => {
        if (error) {
          reject(error);
        } else if (!data) {
          reject(new UserUnknown('This user ("' + jwtUser.uuid + '" with name "' + jwtUser.shortName + '") is unknown to the system.'));
        } else {
          resolve(jwtUser);
        }
      });
    });
  }

  /**
   * For a given user and token id, create a JWT.
   *
   * @param userUuid id of the user
   * @param jwtUuid id of the token to generate a JWT.
   * @returns {Promise<string>} the JWT
   */
  public getJwt(userUuid: string, jwtUuid: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.userRepository.findByUuid(userUuid, (error, user) => {
        if (error) {
          reject(error);
        } else if (!user) {
          reject(new UserUnknown('This user is unknown to the system.'));
        } else {
          let singleToken = (user.tokens || []).find(t => t.uuid === jwtUuid);
          if (singleToken !== null) {
            let jwtUser = UserJwt.create(user, singleToken);
            resolve(this.userJwtService.createJwt(jwtUser));
          } else {
            reject(new Error('No valid JWT found'));
          }
        }
      });
    });
  }

  /**
   * Returns all users of the system. Note that this method can only be executed
   * by administrators.
   *
   * @param currentUser the current user (needed for authentication)
   * @returns {Promise<IUser[]>} all users
   */
  public getAllUsers(currentUser: User): Promise<IUser[]> {
    return new Promise<IUser[]>((resolve, reject) => {
      if (currentUser.systemRole !== UserRole.ADMIN) {
        throw new InvalidAccess(`You "${currentUser.shortName}" are not allowed to fetch all users from the system`);
      } else {
        this.userRepository.retrieve((error, users) => {
          if (error) {
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

  /**
   * For the given user id, return the details.
   *
   * @param currentUser for authentication if needed
   * @param userUuid user id
   * @returns {Promise<PublicUser>} user details
   */
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

  /**
   * Updates a user.
   *
   * @param currentUser current user (for authentication)
   * @param userUuid the user to be updated
   * @param updateUser update fields
   * @returns {Promise<PublicUser>} the updated user
   */
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

  /**
   * Deletion of a user. Note that this action can only be performed by an Administrator.
   *
   * @param currentUser the current user (needed for authorization)
   * @param userUuid the user to be deleted
   * @returns {Promise<void>}
   */
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

export class UserUnknown extends ErrorWithMessage {
  constructor(msg) {
    super(msg);
  }
}

export class InvalidAccess extends ErrorWithMessage {
  constructor(msg) {
    super(msg);
  }
}
