import { injectable } from 'inversify';
import { AbstractRepository } from './AbstractRepository';
import { DataAccess } from './dataaccess';
import { IPersistedRetrospectiveDbModel } from './model';
import { RetrospectiveDbSchema } from './schema';
import {IPopulatedRetrospective} from './model/RetrospectiveDbModel';

export const RetrospectiveDbModel = DataAccess.mongooseConnection.model<IPersistedRetrospectiveDbModel>
  ('retrospectives', RetrospectiveDbSchema.schema);

@injectable()
export class RetrospectiveRepository extends AbstractRepository<IPersistedRetrospectiveDbModel> {
  constructor() {
    super();
    super.setModel(RetrospectiveDbModel);
  }

  findByUuid(_uuid: string, callback: (error: any, result: IPersistedRetrospectiveDbModel) => void) {
    this.getModel()
      .where('uuid').equals(_uuid)
      .exec((error, result) => {
        callback(error, !result || result.length === 0 ? result : result[0]);
      });
  }

  findByUuidPopulated(_uuid: string, callback: (error: any, result: IPopulatedRetrospective) => void) {
    this.getModel()
      .where('uuid').equals(_uuid)
      .populate('attendees')
      .populate('manager')
      .populate('comments.author')
      .exec((error, result) => {
        callback(error, !result || result.length === 0 ? result : result[0]);
      });
  }

  findByUuids(_uuids: string[], callback: (error: any, result: IPersistedRetrospectiveDbModel[]) => void) {
    this.getModel()
      .where('uuid').in(_uuids)
      .exec(callback);
  }

}
