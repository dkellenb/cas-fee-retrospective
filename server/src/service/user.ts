import { injectable } from 'inversify';
import { IUser } from "../../../shared/src/model/user";

@injectable()
export class UserRepository {

  private userStorage: IUser[] = [];

  public getUsers(): IUser[] {
    return this.userStorage;
  }

  public getUser(id: string): IUser {
    let result: IUser;
    this.userStorage.map(user => {
      if (user.uuid.getId() === id) {
        result = user;
      }
    });

    return result;
  }

  public createUser(user: IUser): IUser {
    this.userStorage.push(user);
    return user;
  }

  public updateUser(id: string, user: IUser): IUser {
    this.userStorage.map((entry, index) => {
      if (entry.uuid.getId() === id) {
        this.userStorage[index] = user;
      }
    });

    return user;
  }

  public deleteUser(id: string): string {
    let updatedUser: IUser[] = [];
    this.userStorage.map(user => {
      if (user.uuid.getId() !== id) {
        updatedUser.push(user);
      }
    });

    this.userStorage = updatedUser;
    return id;
  }

}