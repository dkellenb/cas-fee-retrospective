import {IBasicRetrospectiveVote} from './IBasicRetrospectiveVote';

export interface IBasicRetrospectiveComment<T> {
  uuid: string;
  title: string;
  description: string;
  anonymous: boolean;
  author: T;
  topicUuid?: string;
  votes: IBasicRetrospectiveVote<T>[];
}
