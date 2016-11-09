import { injectable } from 'inversify';
import { AbstractRepository } from './AbstractRepository';
import { UserDbSchema } from './schema';
import { IUserDbModel } from './model/';
import * as mongoose from 'mongoose';

export const UserDbModel = mongoose.model<IUserDbModel>('users', UserDbSchema.schema);

@injectable()
export class UserRepository extends AbstractRepository<IUserDbModel> {
  constructor() {
    super();
    super.setModel(UserDbModel);
  }

  findByUuid(_uuid: string, callback: (error: any, result: IUserDbModel) => void) {
    this.getModel()
      .where('uuid').equals(_uuid)
      .exec((error, result) => {
        callback(error, !result || result.length === 0 ? result : result[0]);
      });
  }

  findByUuids(_uuids: string[], callback: (error: any, result: IUserDbModel[]) => void) {
    this.getModel()
      .where('uuid').in(_uuids)
      .exec(callback);
  }

}
