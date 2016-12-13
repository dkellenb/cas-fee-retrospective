import {IBasicRetrospectiveComment} from './IBasicRetrospectiveComment';

export interface IBasicRetrospectiveTopic<T> {
  uuid: string;
  name: string;
  comments: IBasicRetrospectiveComment<T>[];
}
