import * as mongoose from 'mongoose';
import * as mongodb from 'mongodb';
import {IPersistedUser} from './UserDbModel';
import {IBasicRetrospective} from '../../../../shared/src/model';
import {IBasicRetrospectiveTopic} from '../../../../shared/src/model';
import {IBasicRetrospectiveComment} from '../../../../shared/src/model';


export interface IPersistedRetrospective extends IBasicRetrospective<mongodb.ObjectID> {
  manager: mongodb.ObjectID;
}

export interface IPopulatedRetrospective extends IBasicRetrospective<IPersistedUser> {
  manager: IPersistedUser;
}

export interface IPersistedRetrospectiveDbModel extends mongoose.Document, IPersistedRetrospective {

}

export class PersistedRetrospectiveTopic implements IBasicRetrospectiveTopic<mongodb.ObjectID> {
  name: String;
  comments: IBasicRetrospectiveComment<mongodb.ObjectID>[];

  constructor(name?: String) {
    if (name) {
      this.name = name;
    }
  }
}
