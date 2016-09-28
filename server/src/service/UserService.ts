import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import { UUID } from '../../../shared/src/util/UUID';
import {UserRepository} from '../repository/UserRepository';
import {CreateUserJSON} from '../../../shared/src/model/user/CreateUserJSON';
import {UserRole} from '../../../shared/src/model/user/User';
import {IPersistedUser, PersistedUser, UserToken} from '../../../shared/src/model/user/PersistedUser';
import {UserJwt} from '../../../shared/src/model/user/UserJwt';
import {UserJwtService} from './UserJwtService';

@injectable()
export class UserService {

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

}
