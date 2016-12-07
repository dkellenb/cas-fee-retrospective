import { injectable } from 'inversify';
import { AbstractRepository } from './AbstractRepository';
import { IPersistedRetrospectiveDbModel } from './model';
import { RetrospectiveDbSchema } from './schema';
import {IPopulatedRetrospective} from './model/RetrospectiveDbModel';
import * as mongoose from 'mongoose';
import {IPersistedUser} from './model/UserDbModel';

export const RetrospectiveDbModel = mongoose.model<IPersistedRetrospectiveDbModel>
  ('retrospectives', RetrospectiveDbSchema.schema);

@injectable()
export class RetrospectiveRepository extends AbstractRepository<IPersistedRetrospectiveDbModel> {

  private static removeToken(user: IPersistedUser): void {
    user.tokens = null;
    user.email = null;
  }

  private static clearPopulatedRetrospective(retrospective: IPopulatedRetrospective): IPopulatedRetrospective {
    retrospective.attendees.forEach((u) => RetrospectiveRepository.removeToken(u));
    RetrospectiveRepository.removeToken(retrospective.manager);
    return retrospective;
  }

  constructor() {
    super();
    super.setModel(RetrospectiveDbModel);
  }

  findByUuid(_uuid: string, callback: (error: any, result: IPersistedRetrospectiveDbModel) => void) {
    this.getModel()
      .where('uuid').equals(_uuid)
      .exec((error, result) => {
        callback(error, !result || result.length === 0 ? null : result[0]);
      });
  }

  findByUuidPopulated(_uuid: string, callback: (error: any, result: IPopulatedRetrospective) => void) {
    this.getModel()
      .where('uuid').equals(_uuid)
      .populate('attendees')
      .populate('manager')
      .populate('topics.comments.author')
      .exec((error, result) => {
        callback(error, !result || result.length === 0
          ? null
          : RetrospectiveRepository.clearPopulatedRetrospective(result[0]));
      });
  }

  findByUuids(_uuids: string[], callback: (error: any, result: IPersistedRetrospectiveDbModel[]) => void) {
    this.getModel()
      .where('uuid').in(_uuids)
      .exec(callback);
  }

}
