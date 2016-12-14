import {Injectable} from '@angular/core';
import {UserService} from './user.service';
import {
  CreateRetrospectiveJSON,
  IBasicRetrospective,
  IRetrospectiveUser,
  IBasicRetrospectiveComment,
  UpdateCommentJSON,
  CreateCommentJSON,
  ChangeStatusJSON
} from '../../shared/model';
import {ConfigurationService, AuthenticationService} from '../../shared';
import {Observable, Subscription} from 'rxjs';
import {AuthHttp} from 'angular2-jwt';
import {WebSocketService, WebSocketAction} from './web-socket.service';
import {RetrospectiveStatus} from '../../shared/model/retrospective/RetrospectiveStatus';
import {UserRole} from '../../shared/model/user/UserRole';

@Injectable()
export class RetrospectiveService {

  // Empoty Retro as long non was loaded
  private _currentRetrospective: IBasicRetrospective<IRetrospectiveUser>;
  private _failedRetrospectiveId: string;
  private _websocketSubscription: Subscription;

  private static extractIdFromLocation(location: string): string {
    if (location == null) {
      return null;
    }
    return location.substring((location.lastIndexOf('/') + 1), location.length);
  }

  constructor(private userService: UserService,
              private authService: AuthenticationService,
              private configuration: ConfigurationService,
              private webSocketService: WebSocketService,
              private authHttp: AuthHttp) {

    this._currentRetrospective = <IBasicRetrospective<IRetrospectiveUser>> {
      uuid: '',
      name: '',
      attendees: [],
      status: RetrospectiveStatus.OPEN,
      topics: []
    };
  }

  public getCurrent(): IBasicRetrospective<IRetrospectiveUser> {
    return this._currentRetrospective;
  }

  public joinRetrospective(retrospectiveId: string, shortName?: string): Observable<boolean> {
    return this.setupUserIfNeeded(shortName).flatMap(success => {
      if (success) {
        return this.authHttp.post(this.createRetrospectiveIdEndpoint(retrospectiveId) + '/attendees', '').map(response => {
          if (response.status === 204) {
            return true;
          } else {
            console.log(`Couldn't join retrospective "${retrospectiveId}"`);
            return false;
          }
        }, e => {
          console.log(e);
        });
      } else {
        console.log(`Couldn't create user "${shortName}"`);
        return <Observable<boolean>>Observable.create((observer) => {
          observer.next(false);
          observer.complete();
        });
      }
    });
  }

  public createRetrospective(sessionTitle: string, sessionDescription: string, shortName?: string): Observable<string> {
    let retrospective = <CreateRetrospectiveJSON>{};
    retrospective.description = sessionDescription;
    retrospective.name = sessionTitle;

    return this.setupUserIfNeeded(shortName).flatMap(success => {
      if (success) {
        return this.authHttp.post(this.configuration.retrospectiveEndpoint, retrospective).map(response => {
          return RetrospectiveService.extractIdFromLocation(response.headers.get('Location'));
        }, e => {
          console.log(e);
        });
      } else {
        throw new Error('No user setup possible');
      }
    });
  }

  private setupUserIfNeeded(shortName?: string): Observable<boolean> {
    if (!this.authService.isUserLoggedIn()) {
      if (shortName == null) {
        throw new Error('No User Logged in an there is no shortName for create new User');
      }
      console.log('no User logged in register new user with shportname: ' + shortName);
      return this.userService.createUser(shortName);
    }
    return Observable.create((observer) => {
      observer.next(true);
      observer.complete();
    });
  }

  public getRetrospective(retrospectiveId: string, forceReload?: boolean): Observable<IBasicRetrospective<IRetrospectiveUser>> {
    if (!forceReload || forceReload == null) {
      if (this._currentRetrospective != null && this._currentRetrospective.uuid === retrospectiveId) {
        return Observable.create((observer) => {
          observer.next(this._currentRetrospective);
          observer.complete();
        });
      }
    } else {
      console.log('Force Reload of Retrospective');
    }
    console.log('reload retrospective');
    return this.authHttp.get(this.createRetrospectiveIdEndpoint(retrospectiveId)).map(response => {
      this._currentRetrospective = response.json();
      this._failedRetrospectiveId = null;
      if (!forceReload || forceReload == null) {
        this.setupWebSocket(retrospectiveId);
      }
      return this._currentRetrospective;
    });
  }

  public getAttendee(attendeeId: string): Observable<IRetrospectiveUser> {
    return this.authHttp.get(this.createAttendeeIdEndpoint(this._currentRetrospective.uuid, attendeeId))
      .map(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(`Could not load attendee "${attendeeId}" on retro "${this._currentRetrospective.uuid}`);
        }
      });
  }

  public getComment(commentId: string): Observable<IBasicRetrospectiveComment<IRetrospectiveUser>> {
    return this.authHttp.get(this.createSimpleCommentIdEndpoint(this._currentRetrospective.uuid, commentId)).map(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(`Could not load comment "${commentId}" on retro "${this._currentRetrospective.uuid}"`);
      }
    });
  }

  public createComment(topicId: string,
                       create: CreateCommentJSON): Observable<IBasicRetrospectiveComment<IRetrospectiveUser>> {
    return this.authHttp.post(this.createCommentEndpoint(this._currentRetrospective.uuid, topicId), create)
      .first()
      .flatMap(response => {
        if (response.status === 201) {
          return this.getComment(RetrospectiveService.extractIdFromLocation(response.headers.get('Location')));
        } else {
          throw new Error(`Could not create comment on retro "${this._currentRetrospective.uuid}"`);
        }
      });
  }

  public updateComment(topicId: string,
                       commentId: string,
                       update: UpdateCommentJSON): Observable<IBasicRetrospectiveComment<IRetrospectiveUser>> {
    return this.authHttp.put(this.createCommentIdEndpoint(this._currentRetrospective.uuid, topicId, commentId), update).map(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(`Could not update comment "${commentId}" on retro "${this._currentRetrospective.uuid}"`);
      }
    });
  }

  public deleteComment(topicId: string, commentId: string): Observable<boolean> {
    console.log(`Delete on server comment '${commentId}'`);
    return this.authHttp.delete(this.createCommentIdEndpoint(this._currentRetrospective.uuid, topicId, commentId)).map(response => {
      if (response.status === 204) {
        return true;
      } else {
        throw new Error(`Could not delete comment '${commentId}' on retro '${this._currentRetrospective.uuid}'`);
      }
    });
  }

  public updateRetrospectiveStatus(status: RetrospectiveStatus): Observable<boolean> {
    let updateStatus: ChangeStatusJSON = <ChangeStatusJSON>{};
    updateStatus.status = status;
    return this.authHttp.put(this.createRetrospectiveIdStatusEndpoint(this._currentRetrospective.uuid), updateStatus).map(response => {
      return response.status === 204;
    });
  }

  public voteForComment(topicId: string, commentId: string): Observable<boolean> {
    return this.authHttp.put(this.createVotesEndpoint(this._currentRetrospective.uuid, topicId, commentId), '').map(response => {
      if (response.status === 201) {
        return true;
      } else {
        throw new Error(`Could not vote for comment '${commentId}' on retro '${this._currentRetrospective.uuid}'`);
      }
    });
  }

  public removeVoteForComment(topicId: string, commentId: string): Observable<boolean> {
    return this.authHttp.delete(this.createVotesEndpoint(this._currentRetrospective.uuid, topicId, commentId)).map(response => {
      if (response.status === 204) {
        return true;
      } else {
        throw new Error(`Could not delete own vote on comment '${commentId}' on retro '${this._currentRetrospective.uuid}'`);
      }
    });
  }

  public  get failedRetrospectiveId(): string {
    return this._failedRetrospectiveId;
  }

  public set failedRetrospectiveId(value: string) {
    this._failedRetrospectiveId = value;
  }

  public hasManagerRole(): boolean {
    if (this._currentRetrospective == null || !this.authService.isUserLoggedIn()) {
      return false;
    }
    let loggedInUserUUID: string = this.authService.getLoggedInUser().uuid;
    let currendUser: IRetrospectiveUser = this._currentRetrospective.attendees.find((user: IRetrospectiveUser) => {
      return user.uuid === loggedInUserUUID;
    });
    return currendUser != null && (currendUser.role === UserRole.MANAGER || currendUser.role === UserRole.ADMIN);
  }

  private setupWebSocket(retrospectiveId: string) {
    if (this._websocketSubscription != null) {
      this._websocketSubscription.unsubscribe();
    }
    this._websocketSubscription = this.webSocketService.get(retrospectiveId)
      .subscribe((websocketAction: WebSocketAction) => {
        console.log('Receieved web socket action: ' + JSON.stringify(websocketAction));
        switch (websocketAction.action) {
          case 'newUser':
            this.retrieveAndUpdateAttendee(websocketAction.id);
            break;
          case 'newComment':
            this.retrieveAndUpdateComment(websocketAction.id);
            break;
          case 'updatedComment':
            this.retrieveAndUpdateComment(websocketAction.id);
            break;
          case 'deletedComment':
            this.updatedDeletedComment(websocketAction.id);
            break;
          case 'newStatus':
            // reload everything to remove all comments in edit mode or other deltas
            this.reloadRetrospective();
            break;
          default:
            console.log('Unknown Websocket Action ' + websocketAction.action);
        }
      });
  }

  private retrieveAndUpdateAttendee(userId: string) {
    this.getAttendee(userId).first().subscribe(
      (attendee: IRetrospectiveUser) => {
        let attendeeIndex = this._currentRetrospective.attendees.findIndex((a) => a.uuid === userId);
        if (attendeeIndex >= 0) {
          console.log('found attende: ' + attendee.shortName + ' index:' + attendeeIndex);
          this._currentRetrospective.attendees[attendeeIndex] = attendee;
        } else {
          console.log('new attende: ' + attendee.shortName);
          console.log(attendee);
          this._currentRetrospective.attendees.push(attendee);
        }
      }
    );
  }

  private retrieveAndUpdateComment(commentId: string) {
    this.getComment(commentId).first().subscribe(
      (comment: IBasicRetrospectiveComment<IRetrospectiveUser>) => {
        let topics = this._currentRetrospective.topics
          .filter((t) => t.uuid === comment.topicUuid);
        if (topics && topics.length === 1) {
          let commentIndex = topics[0].comments.findIndex((c => c.uuid === commentId));
          if (commentIndex >= 0) {
            topics[0].comments[commentIndex] = comment;
          } else {
            if (comment.author.uuid !== this.authService.getLoggedInUser().uuid) {
              topics[0].comments.push(comment);
            }
          }
        }
      }
    );
  }

  private updatedDeletedComment(commentId: string) {
    this._currentRetrospective.topics.forEach((topic) => {
      let commentIndex = topic.comments.findIndex((c) => c.uuid === commentId);
      if (commentIndex >= 0) {
        topic.comments.splice(commentIndex, 1);
      }
    });
  }

  private reloadRetrospective() {
    this.getRetrospective(this._currentRetrospective.uuid, true)
      .first()
      .subscribe((retrospective: IBasicRetrospective<IRetrospectiveUser>) => {
        console.log('reload Retrospective');
        this._currentRetrospective = retrospective;
      });
  }

  private createRetrospectiveIdEndpoint(id: string) {
    return this.configuration.retrospectiveEndpoint + '/' + id;
  }

  private createRetrospectiveIdStatusEndpoint(id: string) {
    return this.createRetrospectiveIdEndpoint(id) + '/status';
  }

  private createAttendeeIdEndpoint(retroId: string, attendeeId: string) {
    return this.createRetrospectiveIdEndpoint(retroId) + '/attendees/' + attendeeId;
  }

  private createSimpleCommentIdEndpoint(retroId: string, commentId: string) {
    return this.createRetrospectiveIdEndpoint(retroId) + '/comments/' + commentId;
  }

  private createTopicIdEndpoint(retroId: string, topicId: string) {
    return this.createRetrospectiveIdEndpoint(retroId) + '/topics/' + topicId;
  }

  private createCommentEndpoint(retroId: string, topicId: string) {
    return this.createTopicIdEndpoint(retroId, topicId) + '/comments';
  }

  private createCommentIdEndpoint(retroId: string, topicId: string, commentId: string) {
    return this.createCommentEndpoint(retroId, topicId) + '/' + commentId;
  }

  private createVotesEndpoint(retroId: string, topicId: string, commentId: string) {
    return this.createCommentIdEndpoint(retroId, topicId, commentId) + '/votes';
  }
}
