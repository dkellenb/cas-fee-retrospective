import {Injectable, OnDestroy} from '@angular/core';
import {
  IBasicRetrospectiveTopic,
  IRetrospectiveUser,
  IUser,
  IBasicRetrospectiveComment,
  CreateCommentJSON,
  UpdateCommentJSON
} from '../../../../shared/model';
import {AuthenticationService, NotificationMessage, NotificationMessageType} from '../../../../shared';
import {StickyNoteMode} from './sticky-note-mode.enum';
import {IStickyNote} from './sticky-note.interface';
import {RetrospectiveService} from '../../../services/retrospective.service';
import {Subject, Observable, Observer} from 'rxjs';
import {RetrospectiveStatus} from '../../../../shared/model/retrospective/RetrospectiveStatus';

@Injectable()
export class TopicService implements OnDestroy {


  private _topic: IBasicRetrospectiveTopic<IRetrospectiveUser>;

  public newComment$: Subject<number> = new Subject<number>();

  constructor(private authService: AuthenticationService,
              private retrospectiveService: RetrospectiveService) {
  }

  public ngOnDestroy(): void {
    this.newComment$.complete();
  }

  public set topic(value: IBasicRetrospectiveTopic<IRetrospectiveUser>) {
    this._topic = value;
  }

  public get topicName(): string {
    return this._topic.name;
  }

  public addNewEmptyComment(): void {
    let indexOfEdit: number = this.findIndexOfCommentInEditMode();
    if (indexOfEdit > -1) {
      this.newComment$.next(indexOfEdit);
      return; // there is already on note in Edit Mode move to this;
    }

    let comment: IStickyNote = <IStickyNote>{};
    comment.author = this.getLoggedInRetrospectiveUser();
    comment.anonymous = false;
    comment.topicUuid = this._topic.uuid;
    comment.mode = StickyNoteMode.New;
    this.newComment$.next((this._topic.comments.push(comment) - 1));
  }

  public saveComment(stickyNote: IStickyNote): Observable<NotificationMessage> {
    if (stickyNote.mode === StickyNoteMode.New) {
      return this.createNewComment(stickyNote);
    } else {
      return this.updateComment(stickyNote);
    }
  }

  public deleteComment(stickyNote: IStickyNote): Observable<NotificationMessage> {
    if (stickyNote.uuid == null) {
      let index = this._topic.comments.indexOf(stickyNote);
      if (index > -1) {
        this._topic.comments.splice(index, 1);
      }
      return Observable.create((observer: Observer<NotificationMessage>) => {
        observer.next(new NotificationMessage(NotificationMessageType.INFO, 'Comment was removed', 5));
        observer.complete();
      });
    } else {
      return this.retrospectiveService.deleteComment(this._topic.uuid, stickyNote.uuid)
        .map(success => {
            if (success) {
              console.log('Comment deleted on Server with id ' + stickyNote.uuid);
              return new NotificationMessage(NotificationMessageType.SUCCESS, 'Comment was deleted in retrospective', 5);
            }
            return new NotificationMessage(NotificationMessageType.WARNING, 'Was not able to delete comment in retrospective', 10);
          }
        );
    }
  }

  public reloadStickyNote(stickyNote: IStickyNote): Observable<NotificationMessage> {
    return this.retrospectiveService.getComment(stickyNote.uuid)
      .map(this.mapIBasicRetrospectiveCommentToIStickyNote)
      .map((resetNote: IStickyNote) => {
        resetNote.mode = null;
        this._topic.comments[this.findIndexOfCommentByUuid(stickyNote.uuid)] = resetNote;
        return new NotificationMessage(NotificationMessageType.INFO, 'No Changes were made to the comment', 5);
      });
  }

  public voteForComment(commentId: string): Observable<NotificationMessage> {
    return this.retrospectiveService.voteForComment(this._topic.uuid, commentId)
      .map((success: boolean) => {
        if (success) {
          return new NotificationMessage(NotificationMessageType.SUCCESS, 'Vote has been registered', 5);
        }
        return new NotificationMessage(NotificationMessageType.WARNING, 'Vote was not registered', 10);
      });
  }

  public removeVoteForComment(commentId: string): Observable<NotificationMessage> {
    return this.retrospectiveService.removeVoteForComment(this._topic.uuid, commentId)
      .map((success: boolean) => {
        if (success) {
          return new NotificationMessage(NotificationMessageType.SUCCESS, 'Vote was successfully removed', 5);
        }
        return new NotificationMessage(NotificationMessageType.WARNING, 'Vote was not removed', 10);
      });
  }

  private createNewComment(stickyNote: IStickyNote): Observable<NotificationMessage> {
    let comment: CreateCommentJSON = <CreateCommentJSON>{};
    comment.title = stickyNote.title;
    comment.description = stickyNote.description;
    comment.anonymous = stickyNote.author !== null;
    return this.retrospectiveService.createComment(this._topic.uuid, comment).first()
      .map(this.mapIBasicRetrospectiveCommentToIStickyNote)
      .map((returnStickyNote: IStickyNote) => {
          stickyNote.uuid = returnStickyNote.uuid;
          stickyNote.topicUuid = returnStickyNote.topicUuid;
          stickyNote.title = returnStickyNote.title;
          stickyNote.description = returnStickyNote.description;
          stickyNote.author = returnStickyNote.author;
          stickyNote.votes = returnStickyNote.votes;
          stickyNote.mode = null;
          return new NotificationMessage(NotificationMessageType.SUCCESS, 'New Comment has been commited to the Retrospective', 10);
        },
        e => {
          console.log(e);
          return new NotificationMessage(NotificationMessageType.ERROR, 'Commit was not sucessfull', 5);
        });
  }

  private updateComment(stickyNote: IStickyNote): Observable<NotificationMessage> {
    let comment: UpdateCommentJSON = <UpdateCommentJSON>{};
    comment.title = stickyNote.title;
    comment.description = stickyNote.description;
    comment.anonymous = stickyNote.author !== null;
    return this.retrospectiveService.updateComment(this._topic.uuid, stickyNote.uuid, comment)
      .map(() => {
        stickyNote.mode = null;
        return new NotificationMessage(NotificationMessageType.SUCCESS, 'Comment has been changed', 5);
      });
  }

  private mapIBasicRetrospectiveCommentToIStickyNote(comment: IBasicRetrospectiveComment < IRetrospectiveUser >): IStickyNote {
    let stickyNote: IStickyNote = <IStickyNote>comment;
    if (stickyNote.mode == null) {
      switch (this.retroStatus) {
        case RetrospectiveStatus.OPEN:
          stickyNote.mode = StickyNoteMode.Editable;
          break;

        case RetrospectiveStatus.REVIEW:
        case RetrospectiveStatus.GROUP:
          if (this.hasManagerRole) {
            if (stickyNote.mode === StickyNoteMode.New || stickyNote.mode === StickyNoteMode.Edit) {
              break;
            }
            stickyNote.mode = StickyNoteMode.Editable;
          } else {
            stickyNote.mode = StickyNoteMode.Display;
          }
          break;

        case RetrospectiveStatus.VOTE:
          stickyNote.mode = StickyNoteMode.Vote;
          break;

        case RetrospectiveStatus.CLOSED:
          stickyNote.mode = StickyNoteMode.Closed;
          break;

        default:
          stickyNote.mode = StickyNoteMode.Display;
      }
    }

    if (comment.votes != null) {
      stickyNote.voteCount = comment.votes.length;
    } else {
      stickyNote.voteCount = 0;
      stickyNote.activeVote = false;
    }

    return stickyNote;
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
    return this._topic.comments.map((comment: IBasicRetrospectiveComment<IRetrospectiveUser>) => {
      return this.mapIBasicRetrospectiveCommentToIStickyNote(comment);
    });
  }

  public get ownComments(): IStickyNote[] {
    return this._topic.comments.filter((comment: IBasicRetrospectiveComment<IRetrospectiveUser>) => {
      return comment.author.uuid === this.authService.getLoggedInUser().uuid;
    }).map((comment: IBasicRetrospectiveComment<IRetrospectiveUser>) => {
      return this.mapIBasicRetrospectiveCommentToIStickyNote(comment);
    });
  }

  public get hasCommentInEditMode(): boolean {
    return this.comments.find((stickyNote: IStickyNote) => {
        return (stickyNote.mode === StickyNoteMode.Edit || stickyNote.mode === StickyNoteMode.New);
      }) != null;
  }

  public findIndexOfCommentInEditMode(): number {
    return this.comments.map((stickyNote: IStickyNote) => {
      return stickyNote.mode === StickyNoteMode.Edit || stickyNote.mode === StickyNoteMode.New;
    }).indexOf(true);
  }

  public get hasManagerRole(): boolean {
    return this.retrospectiveService.hasManagerRole();
  }

  public get retroStatus(): RetrospectiveStatus {
    return this.retrospectiveService.getCurrent().status;
  }


  private findIndexOfCommentByUuid(uuid: string): number {
    return this._topic.comments.map(comment => {
      return comment.uuid;
    }).indexOf(uuid);
  }
}
