export class RetrospectiveStatus {
  static OPEN: string = 'OPEN';
  static REVIEW: string = 'REVIEW';
  static GROUP: string = 'GROUP';
  static VOTE: string = 'VOTE';
  static CLOSED: string = 'CLOSED';
}

export interface IRetrospectiveVote<T> {
  uuid: string;
  author: T;
  value: number;
}

export interface IBasicRetrospectiveComment<T> {
  uuid: string;
  title: string;
  description: string;
  anonymous: boolean;
  author: T;
  votes: IRetrospectiveVote<T>[];
}

export interface IBasicRetrospectiveTopic<T> {
  uuid: string;
  name: string;
  comments: IBasicRetrospectiveComment<T>[];
}

export interface IBasicRetrospective<T> {
  uuid: string;
  name: string;
  description?: string;
  status: RetrospectiveStatus;
  attendees: T[];
  topics: IBasicRetrospectiveTopic<T>[];
}

export interface CreateRetrospectiveJSON {
  name: string;
  description?: string;
}

export interface UpdateRetrospectiveJSON {
  name: string;
  description?: string;
}

export interface CreateCommentJSON {
  title?: string;
  description: string;
  anonymous?: boolean;
}

export interface UpdateCommentJSON {
  title?: string;
  description: string;
  anonymous?: boolean;
}
