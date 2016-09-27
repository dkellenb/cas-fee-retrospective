import { UUID } from '../util/UUID';
import { IUser } from './UserDomainModel';

export enum RetrospectiveStatus {
  OPEN,
  REVIEW,
  GROUP,
  VOTE,
  CLOSED
}

export interface IRetrospectiveVote {
  uuid: UUID;
  author: IUser;
  value: number;
}

export interface IRetrospectiveComment {
  uuid: UUID;
  title: string;
  description: string;
  author: IUser;
  anonymous: boolean;
  votes: IRetrospectiveVote[];
}

export interface IRetrospective {
  uuid: UUID;
  name: string;
  description: string;
  status: RetrospectiveStatus;
  comments: IRetrospectiveComment[];
  attendees: IUser[];
  managers: IUser[];
}
