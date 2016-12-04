import * as mongoose from 'mongoose';
import * as mongodb from 'mongodb';
import {IPersistedUser} from './UserDbModel';
import {IRetrospectiveVote, IBasicRetrospective, IBasicRetrospectiveTopic, IBasicRetrospectiveComment}
  from '../../../../client/src/app/shared/model/';
import {UUID}
  from '../../../../client/src/app/shared/util/';


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
  topicUuid: string;
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
