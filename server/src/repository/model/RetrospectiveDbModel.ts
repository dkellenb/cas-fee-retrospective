import * as mongoose from 'mongoose';
import {IBasicRetrospective} from '../../../../shared/src/model';
import {IPersistedUser} from './UserDbModel';


export interface IBasicRetrospectiveComment {
  uuid: string;
  title: string;
  description: string;
  anonymous: boolean;
}

export interface IPersistedRetrospectiveComment extends IBasicRetrospectiveComment {
  author: mongoose.Schema.Types.ObjectId;
}

export interface IPopulatedRetrospectiveComment extends IBasicRetrospectiveComment {
  author: IPersistedUser;
}

export interface IPersistedRetrospective extends IBasicRetrospective {
  attendees: mongoose.Schema.Types.ObjectId[];
  manager: mongoose.Schema.Types.ObjectId;
  comments: IPersistedRetrospectiveComment[];
}

export interface IPopulatedRetrospective extends IBasicRetrospective {
  attendees: IPersistedUser[];
  manager: IPersistedUser;
  comments: IPopulatedRetrospectiveComment[];
}


export interface IPersistedRetrospectiveDbModel extends mongoose.Document, IPersistedRetrospective {

}

