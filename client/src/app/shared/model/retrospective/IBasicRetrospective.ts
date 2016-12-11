import {RetrospectiveStatus} from './RetrospectiveStatus';
import {IBasicRetrospectiveTopic} from './IBasicRetrospectiveTopic';

export interface IBasicRetrospective<T> {
  uuid: string;
  name: string;
  description?: string;
  status: RetrospectiveStatus;
  attendees: T[];
  topics: IBasicRetrospectiveTopic<T>[];
}
