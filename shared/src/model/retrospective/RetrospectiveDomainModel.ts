import { IUser } from '../user/User';
import {UUID} from "../../util/UUID";

export enum RetrospectiveStatus {
  OPEN,
  REVIEW,
  GROUP,
  VOTE,
  CLOSED
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

export interface IRetrospective {
  uuid: string;
  name: string;
  description?: string;
  status: RetrospectiveStatus;
  comments: IRetrospectiveComment[];
  attendees: string[]; // UUIDs of the users
  managers: string[]; // UUIDs of the users
}

export class Retrospective implements IRetrospective {
  uuid: string;
  name: string;
  description?: string;
  status: RetrospectiveStatus;
  comments: IRetrospectiveComment[];
  attendees: string[]; // UUIDs of the users
  managers: string[]; // UUIDs of the users

  static create(createParams: CreateRetrospectiveJSON): Retrospective {
    let retrospective = new Retrospective();
    retrospective.uuid = new UUID().toString();
    retrospective.name = createParams.name;
    retrospective.description = createParams.description;
    retrospective.comments = [];
    retrospective.attendees = [];
    retrospective.managers = [];
    retrospective.status = RetrospectiveStatus.OPEN;
    return retrospective;
  }
}

export interface CreateRetrospectiveJSON {
  name: string;
  description?: string;
}
