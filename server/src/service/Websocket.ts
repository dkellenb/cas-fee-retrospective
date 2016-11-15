import { injectable } from 'inversify';
import * as nconf from 'nconf';
import * as socketIo from 'socket.io';
import {PublicUser} from './model/User';
import {PublicRetrospectiveComment} from './model/Restrospective';
import {RetrospectiveStatus} from '../../../shared/src/model/RetrospectiveDomainModel';

@injectable()
export class WebSocketService {

  constructor() {
    let port = parseInt(nconf.get('port'), 10);
  }

  public userAddedToRetrospective(retrospectiveId: string, user: PublicUser) {

  }

  public commentAddedToRetrospective(retrospectiveId: string, comment: PublicRetrospectiveComment) {

  }

  public commentUpdatedOnRetrospective(retrospectiveId: string, comment: PublicRetrospectiveComment) {

  }

  public commentRemovedFromRetrospective(retrospectiveId: string, commentId: string) {

  }

  public retrospectiveStatusChanged(retrospectiveId: string, newStatus: RetrospectiveStatus) {

  }

}
