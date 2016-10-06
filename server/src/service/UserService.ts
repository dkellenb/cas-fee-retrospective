import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import { UUID } from '../../../shared/src/util/UUID';
import { UserRepository } from '../repository/UserRepository';
import { UserRole, UserJwt, CreateUserJSON, IPersistedUser, PersistedUser, UserToken, PublicUser } from '../../../shared/src/model';
import { UserJwtService } from './UserJwtService';

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

  public createUser(createUser: CreateUserJSON): IPersistedUser {
    // create user
    let user = new PersistedUser();
    user.uuid = new UUID().toString();
    user.shortName = createUser.shortName;
    user.name = createUser.name || '';
    user.email = createUser.email || '';
    user.systemRole = UserRole.USER;

    // create token for the user
    let userToken = new UserToken();
    user.token = user.token || [];
    user.token.push(userToken);

    // save the user
    this.userRepository.createUser(user);

    // return the newly created user
    return user;
  }

  public getJwt(userUuid: string, jwtUuid: string): string {
    let user = this.userRepository.getUser(userUuid);
    if (user !== null) {
      let singleToken = (user.token || []).find(t => t.uuid === jwtUuid);
      if (singleToken !== null) {
        let jwtUser = UserJwt.create(user, singleToken);
        return this.userJwtService.createJwt(jwtUser);
      }
    }
    throw new Error( 'No valid JWT found');
  }

  public getPublicUsers(userUuids: string[]): PublicUser[] {
    return this.userRepository.getUsers()
      .filter(u => userUuids.indexOf(u.uuid) !== 0)
      .map(u => UserService.convertUserToPublicUser(u));
  }

  public getPublicUser(userUuid: string): PublicUser {
    let user = this.userRepository.getUser(userUuid);
    return UserService.convertUserToPublicUser(user);
  }

}
