import { injectable } from 'inversify';
import { IPersistedUser } from '../../../shared/src/model';

@injectable()
export class UserRepository {

  private userStorage: IPersistedUser[] = [];

  public getUsers(): IPersistedUser[] {
    return this.userStorage;
  }

  public getUser(id: string): IPersistedUser {
    let result: IPersistedUser = null;
    this.userStorage.map(user => {
      if (user.uuid === id) {
        result = user;
      }
    });

    return result;
  }

  public createUser(user: IPersistedUser): IPersistedUser {
    this.userStorage.push(user);
    console.log('Data now: ' + JSON.stringify(this.userStorage));
    return user;
  }

  public updateUser(id: string, user: IPersistedUser): IPersistedUser {
    this.userStorage.map((entry, index) => {
      if (entry.uuid === id) {
        this.userStorage[index] = user;
      }
    });

    return user;
  }

  public deleteUser(id: string): string {
    let updatedUser: IPersistedUser[] = [];
    this.userStorage.map(user => {
      if (user.uuid !== id) {
        updatedUser.push(user);
      }
    });

    this.userStorage = updatedUser;
    return id;
  }

}
