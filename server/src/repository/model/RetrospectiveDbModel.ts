import * as mongoose from 'mongoose';
import * as mongodb from 'mongodb';
import {IPersistedUser} from './UserDbModel';
import {IBasicRetrospectiveVote, IBasicRetrospective, IBasicRetrospectiveTopic, IBasicRetrospectiveComment}
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

export interface IPersistedRetrospectiveVote extends IBasicRetrospectiveVote<mongodb.ObjectID> {

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
  votes: IBasicRetrospectiveVote<mongodb.ObjectID>[];

  constructor(description, title?, anonymous?) {
    this.uuid = new UUID().toString();
    this.title = title || '';
    this.description = description;
    this.anonymous = anonymous === true;
  }
}

export class PersistedRetrospectiveVote implements IPersistedRetrospectiveVote {
  uuid: string;
  author: mongodb.ObjectID;
  value: number;

  constructor(author: mongodb.ObjectID) {
    this.author = author;
    this.uuid = new UUID().toString();
    this.value = 1;
  }
}