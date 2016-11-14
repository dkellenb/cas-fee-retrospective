import * as mongoose from 'mongoose';
import * as mongodb from 'mongodb';
import {IPersistedUser} from './UserDbModel';
import {IBasicRetrospective} from '../../../../shared/src/model';
import {IBasicRetrospectiveTopic} from '../../../../shared/src/model';
import {IBasicRetrospectiveComment} from '../../../../shared/src/model';
import {UUID} from '../../../../shared/src/util/UUID';
import {IRetrospectiveVote} from '../../../../shared/src/model/RetrospectiveDomainModel';


export interface IPersistedRetrospective extends IBasicRetrospective<mongodb.ObjectID> {
  manager: mongodb.ObjectID;
}

export interface IPopulatedRetrospective extends IBasicRetrospective<IPersistedUser> {
  manager: IPersistedUser;
}

export interface IPersistedRetrospectiveDbModel extends mongoose.Document, IPersistedRetrospective {

}

export interface IPersistedRetrospectiveTopic extends IBasicRetrospectiveTopic<mongodb.ObjectID> {

}

export interface IPersistedRetrospectiveComment extends IBasicRetrospectiveComment<mongodb.ObjectID> {

}

export class PersistedRetrospectiveTopic implements IPersistedRetrospectiveTopic {
  uuid: string;
  name: string;
  comments: IBasicRetrospectiveComment<mongodb.ObjectID>[];

  constructor(name?: string) {
    this.uuid = new UUID().toString();
    this.name = name || 'undefined';
  }
}

export class PersistedRetrospectiveComment implements IPersistedRetrospectiveComment {
  uuid: string;
  title: string;
  description: string;
  anonymous: boolean;
  author: mongodb.ObjectID;
  votes: IRetrospectiveVote<mongodb.ObjectID>[];

  constructor(description, title?, anonymous?) {
    this.uuid = new UUID().toString();
    this.title = title || '';
    this.description = description;
    this.anonymous = anonymous === true;
  }
}
