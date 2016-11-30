import {Injectable} from '@angular/core';
import {IBasicRetrospectiveTopic, IRetrospectiveUser, IUser, IBasicRetrospectiveComment} from '../../../../shared/model';
import {AuthenticationService} from '../../../../shared/services/authentication.service';
import {IStickyNote, StickyNoteMode} from './';
import {RetrospectiveService} from '../../../services/retrospective.service';
import {CreateCommentJSON} from '../../../../shared/model/RetrospectiveDomainModel';

@Injectable()
export class TopicService {

  private _topic: IBasicRetrospectiveTopic<IRetrospectiveUser>;

  constructor(private authService: AuthenticationService,
              private retrospectiveService: RetrospectiveService) {
  }

  public set topic(value: IBasicRetrospectiveTopic<IRetrospectiveUser>) {
    this._topic = value;
  }

  public get topicName(): string {
    return this._topic.name;
  }

  public addNewEmptyComment() {
    let comment: IStickyNote = <IStickyNote>{};
    comment.author = this.getLoggedInRetrospectiveUser();
    comment.anonymous = false;
    comment.topicUuid = this._topic.uuid;
    comment.mode = StickyNoteMode.New;
    this._topic.comments.push(comment);
  }

  public saveComment(stickyNote: IStickyNote) {
    if (stickyNote.mode === StickyNoteMode.New) {
      this.createNewComment(stickyNote);
    }
  }

  public deleteComment(stickyNote: IStickyNote) {
    console.log('delete Comment');
    if (stickyNote.uuid == null) {
      let index = this._topic.comments.indexOf(stickyNote);
      if (index > -1) {
        this._topic.comments.splice(index, 1);
      }
    } else {
      this.retrospectiveService.deleteComment(this._topic.uuid, stickyNote.uuid);
    }
  }

  public reloadStickyNote(stickyNote: IStickyNote) {
    this.retrospectiveService.getComment(stickyNote.uuid)
      .first()
      .map(this.mapIBasicRetrospectiveCommentToIStickyNote)
      .subscribe((resetNote: IStickyNote) => {
        let index = this._topic.comments.map(comment => {
          return comment.uuid;
        }).indexOf(resetNote.uuid);
        this.comments[index] = resetNote;
      });
  }

  private createNewComment(stickyNote: IStickyNote) {
    let comment: CreateCommentJSON = <CreateCommentJSON>{};
    comment.title = stickyNote.title;
    comment.description = stickyNote.description;
    comment.anonymous = stickyNote.author !== null;
    this.retrospectiveService.createComment(this._topic.uuid, comment)
      .map(this.mapIBasicRetrospectiveCommentToIStickyNote)
      .first()
      .subscribe((returnStickyNote: IStickyNote) => {
        stickyNote.uuid = returnStickyNote.uuid;
        stickyNote.mode = StickyNoteMode.Display;
      });
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

  private mapIBasicRetrospectiveCommentToIStickyNote(comment: IBasicRetrospectiveComment < IRetrospectiveUser >): IStickyNote {
    let sticky: IStickyNote = <IStickyNote>comment;
    if (sticky.mode == null) {
      sticky.mode = StickyNoteMode.Display;
    }
    return sticky;
  }


}
