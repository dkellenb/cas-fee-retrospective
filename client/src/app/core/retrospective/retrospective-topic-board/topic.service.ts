import {Injectable} from '@angular/core';
import {IBasicRetrospectiveTopic, IRetrospectiveUser, IUser, IBasicRetrospectiveComment} from '../../../shared/model';
import {AuthenticationService} from '../../../shared/services/authentication.service';
import {IStickyNote, StickyNoteMode} from '../sticky-note';

@Injectable()
export class TopicService {

  private _topic: IBasicRetrospectiveTopic<IRetrospectiveUser>;

  constructor(private authService: AuthenticationService) {
  }

  public set topic(value: IBasicRetrospectiveTopic<IRetrospectiveUser>) {
    this._topic = value;
  }

  public get topicName(): string {
    return this._topic.name;
  }

  public createNewComment() {
    let comment: IStickyNote = <IStickyNote>{};
    comment.author = this.getLoggedInRetrospectiveUser();
    comment.anonymous = false;
    comment.topicUuid = this._topic.uuid;
    comment.mode = StickyNoteMode.New;
    console.log('create new comment');
    this._topic.comments.push(comment);
  }

  private getLoggedInRetrospectiveUser(): IRetrospectiveUser {
    let retroUser: IRetrospectiveUser = <IRetrospectiveUser>{};
    let user: IUser = this.authService.getLoggedInUser();

    retroUser.uuid = user.uuid;
    retroUser.shortName = user.shortName;
    retroUser.name = user.name;
    retroUser.role = user.systemRole;

    return retroUser;
  }


  public get comments(): IStickyNote[] {
    return this._topic.comments.map(this.mapIBasicRetrospectiveCommentToIStickyNote);
  }

  public get ownComments(): IStickyNote[] {
    return this._topic.comments.filter((comment: IBasicRetrospectiveComment<IRetrospectiveUser>) => {
      return comment.author.uuid === this.authService.getLoggedInUser().uuid;
    }).map(this.mapIBasicRetrospectiveCommentToIStickyNote);
  }

  private mapIBasicRetrospectiveCommentToIStickyNote(comment: IBasicRetrospectiveComment<IRetrospectiveUser>): IStickyNote {
    let sticky: IStickyNote = <IStickyNote>comment;
    if (sticky.mode === null) {
      sticky.mode = StickyNoteMode.Display;
    }
    return sticky;
  }


}
