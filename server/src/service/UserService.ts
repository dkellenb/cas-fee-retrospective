
import { injectable, inject } from 'inversify';

import TYPES from '../constant/types';
import { CreateUserJSON, IUser, User, UserRole } from '../../../shared/src/model/UserDomainModel';
import { UUID } from '../../../shared/src/util/UUID';

@injectable()
export class UserService {

  constructor(@inject(TYPES.UserRepository) private userRepository) {

  }

  public createUser(createUser: CreateUserJSON): IUser {
    // create user
    let user = new User();
    user.uuid = new UUID();
    user.shortName = createUser.shortName;
    user.name = createUser.name || '';
    user.email = createUser.email || '';
    user.systemRole = UserRole.USER;

    // create token for the user
    // TODO

    // save the user
    this.userRepository.create(user);

    // return the newly created user
    return user;
  }
}
