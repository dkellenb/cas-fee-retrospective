import { injectable } from 'inversify';
import { AbstractRepository } from './AbstractRepository';
import { UserDbSchema } from './schema';
import { IUserDbModel } from './model/';
import { DataAccess } from './dataaccess';


@injectable()
export class UserRepository extends AbstractRepository<IUserDbModel> {
  constructor() {
    super();
    super.setModel(DataAccess.mongooseConnection.model<IUserDbModel>('Users', UserDbSchema.schema));
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