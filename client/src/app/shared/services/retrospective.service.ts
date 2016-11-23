import {Injectable} from '@angular/core';
import {UserService} from './user.service';
import {AuthenticationService} from './authentication.service';
import {CreateRetrospectiveJSON, IBasicRetrospective, IRetrospectiveUser} from '../../../../../shared/src/model';
import {ConfigurationService} from './configuration.service';
import {Observable} from 'rxjs';
import {AuthHttp} from 'angular2-jwt';
import {IBasicRetrospectiveComment, UpdateCommentJSON} from '../../../../../shared/src/model/RetrospectiveDomainModel';
import {WebSocketService, WebSocketAction} from './web-socket.service';

@Injectable()
export class RetrospectiveService {

  private _currentRetrospective: IBasicRetrospective<IRetrospectiveUser>;

  private static extractRetrospectiveIdFromLocation(location: string): string {
    if (location == null) {
      return null;
    }
    let id: string = location.substring((location.lastIndexOf('/') + 1), location.length);
    console.log('id for retrospective is: ' + id);
    return id;
  }

  constructor(private userService: UserService,
              private authService: AuthenticationService,
              private configuration: ConfigurationService,
              private webSocketService: WebSocketService,
              private authHttp: AuthHttp
  ) {
  }

  public getCurrent(): IBasicRetrospective<IRetrospectiveUser> {
    return this._currentRetrospective;
  }

  public joinRetrospective(retrospectiveId: string, shortName?: string): Observable<boolean> {
    return this.setupUser(shortName).flatMap(success => {
      if (success) {
        return this.authHttp.post(this.createRetrospectiveIdEndpoint(retrospectiveId) + '/attendees', '').map(response => {
          if (response.status === 204) {
            return true;
          } else {
            console.log(`Couldn't joint retrospective "${retrospectiveId}"`);
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

    return this.setupUser(shortName).flatMap(success => {
      if (success) {
        return this.authHttp.post(this.configuration.retrospectiveEndpoint, retrospective).map(response => {
          return RetrospectiveService.extractRetrospectiveIdFromLocation(response.headers.get('Location'));
        }, e => {
          console.log(e);
        });
      } else {
        throw new Error('No user setup possible');
      }
    });
  }

  private setupUser(shortName?: string): Observable<boolean> {
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

  public getRetrospective(retrospectiveId: string): Observable<IBasicRetrospective<IRetrospectiveUser>> {
    if (this._currentRetrospective != null && this._currentRetrospective.uuid === retrospectiveId) {
      return Observable.create((observer) => {
        observer.next(this._currentRetrospective);
        observer.complete();
      });
    }
    return this.authHttp.get(this.createRetrospectiveIdEndpoint(retrospectiveId)).map(response => {
      this._currentRetrospective = response.json();
      this.setupWebSocket(retrospectiveId);
      return this._currentRetrospective;
    });
  }

  public getAttendee(retrospectiveId: string, attendeeId: string): Observable<IRetrospectiveUser> {
    return this.authHttp.get(this.createAttendeeIdEndpoint(retrospectiveId, attendeeId)).map(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(`Could not load attendee "${attendeeId}" on retro "${retrospectiveId}`);
      }
    });
  }

  public getComment(retrospectiveId: string, commentId: string): Observable<IBasicRetrospectiveComment<IRetrospectiveUser>> {
    return this.authHttp.get(this.createSimpleCommentIdEndpoint(retrospectiveId, commentId)).map(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(`Could not load comment "${commentId}" on retro "${retrospectiveId}"`);
      }
    });
  }

  public updateComment(retrospectiveId: string, topicId: string, commentId: string, update: UpdateCommentJSON):
     Observable<IBasicRetrospectiveComment<IRetrospectiveUser>> {
    return this.authHttp.put(this.createCommentIdEndpoint(retrospectiveId, topicId, commentId), update).map(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(`Could not update comment "${commentId}" on retro "${retrospectiveId}"`);
      }
    });
  }

  public deleteComment(retrospectiveId: string, topicId: string, commentId: string): Observable<boolean> {
    return this.authHttp.delete(this.createCommentIdEndpoint(retrospectiveId, topicId, commentId)).map(response => {
      if (response.status === 204) {
        return true;
      } else {
        throw new Error(`Could not delete comment "${commentId}" on retro "${retrospectiveId}"`);
      }
    });
  }

  private setupWebSocket(retrospectiveId: string) {
    this.webSocketService.get(retrospectiveId)
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
            console.log('Change status');
            break;
        }
      });
  }

  private retrieveAndUpdateAttendee(userId: string) {
    this.getAttendee(this._currentRetrospective.uuid, userId).first().subscribe(
      (attendee: IRetrospectiveUser) => {
        let attendeeIndex = this._currentRetrospective.attendees.findIndex((a) => a.uuid === userId);
        if (attendeeIndex >= 0) {
          this._currentRetrospective.attendees[attendeeIndex] = attendee;
        } else {
          this._currentRetrospective.attendees.push(attendee);
        }
      }
    );
  }

  private retrieveAndUpdateComment(commentId: string) {
    this.getComment(this._currentRetrospective.uuid, commentId).first().subscribe(
      (comment: IBasicRetrospectiveComment<IRetrospectiveUser>) => {
        let topics = this._currentRetrospective.topics
          .filter((t) => t.uuid === comment.topicUuid);
        if (topics && topics.length === 1) {
          let commentIndex = topics[0].comments.findIndex((c => c.uuid === commentId));
          if (commentIndex >= 0) {
            topics[0].comments[commentIndex] = comment;
          } else {
            topics[0].comments.push(comment);
          }
        }
      }
    );
  }

  private updatedDeletedComment(commentId: string) {
    this._currentRetrospective.topics.forEach((topic) => {
      let commentIndex = topic.comments.findIndex((c) => c.uuid === commentId);
      if (commentIndex >= 0) {
        topic.comments = topic.comments.splice(commentIndex);
      }
    });
  }

  private createRetrospectiveIdEndpoint(id: string) {
    return this.configuration.retrospectiveEndpoint + '/' + id;
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

  private createCommentIdEndpoint(retroId: string, topicId: string, commentId: string) {
    return this.createTopicIdEndpoint(retroId, topicId) + '/comments/' + commentId;
  }

}
