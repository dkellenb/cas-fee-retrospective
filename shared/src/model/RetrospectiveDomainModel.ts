import { IUser } from './user/User';

export enum RetrospectiveStatus {
  OPEN,
  REVIEW,
  GROUP,
  VOTE,
  CLOSED
}

export interface IRetrospectiveVote {
  uuid: string;
  author: IUser;
  value: number;
}

export interface IRetrospectiveComment {
  uuid: string;
  title: string;
  description: string;
  author: IUser;
  anonymous: boolean;
  votes: IRetrospectiveVote[];
}

export interface IRetrospective {
  uuid: string;
  name: string;
  description: string;
  status: RetrospectiveStatus;
  comments: IRetrospectiveComment[];
  attendees: IUser[];
  managers: IUser[];
}
