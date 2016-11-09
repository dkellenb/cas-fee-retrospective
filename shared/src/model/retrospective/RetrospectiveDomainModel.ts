import {IUser} from '../user/User';

export class RetrospectiveStatus {
  static OPEN: string = 'OPEN';
  static REVIEW: string = 'REVIEW';
  static GROUP: string = 'GROUP';
  static VOTE: string = 'VOTE';
  static CLOSED: string = 'CLOSED';
}

export interface IRetrospectiveVote {
  uuid: string;
  author: string; // UUID of the user
  value: number;
}

export interface IRetrospectiveComment {
  uuid: string;
  title: string;
  description: string;
  author: string; // UUID of the user
  anonymous: boolean;
  votes: IRetrospectiveVote[];
}

export interface IBasicRetrospective {
  uuid: string;
  name: string;
  description?: string;
  status: RetrospectiveStatus;
}

export interface IRetrospective extends IBasicRetrospective {
  comments: IRetrospectiveComment[];
  attendees: IUser[];
  manager: IUser;
}

export interface CreateRetrospectiveJSON {
  name: string;
  description?: string;
}

export interface UpdateRetrospectiveJSON {
  name: string;
  description?: string;
}