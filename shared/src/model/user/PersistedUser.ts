import {UUID} from '../../util/UUID';
import {IUser, User} from './User';
import * as moment from 'moment';

export interface IUserToken {
  /** Unique identifier of this token. */
  uuid: string;

  /** Validity of token until (unix time). */
  validUntil: number;
}

