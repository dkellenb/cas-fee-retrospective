import {Injectable, OnDestroy, Optional} from '@angular/core';
import {
  IBasicRetrospectiveTopic,
  IRetrospectiveUser,
  IUser,
  IBasicRetrospectiveComment
} from '../../../../shared/model';
import {AuthenticationService} from '../../../../shared/services/authentication.service';
import {StickyNoteMode} from './sticky-note-mode.enum';
import {IStickyNote} from './sticky-note.interface';
import {RetrospectiveService} from '../../../services/retrospective.service';
import {CreateCommentJSON, UpdateCommentJSON} from '../../../../shared/model/RetrospectiveDomainModel';
import {Subject, Observable, Observer} from 'rxjs';
import {NotifierService} from "../../../../shared/notifier/notifier.service";
import {NotificationMessage} from "../../../../shared/notification-message/notification-message";
import {NotificationMessageType} from "../../../../shared/notification-message/notification-message-type";

@Injectable()
export class TopicService implements OnDestroy {


  private _topic: IBasicRetrospectiveTopic<IRetrospectiveUser>;

  public newComment$: Subject<number> = new Subject<number>();

  private static mapIBasicRetrospectiveCommentToIStickyNote(comment: IBasicRetrospectiveComment < IRetrospectiveUser >): IStickyNote {
    let sticky: IStickyNote = <IStickyNote>comment;
    if (sticky.mode == null) {
      sticky.mode = StickyNoteMode.Display;
    }
    return sticky;
  }

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
      console.log(indexOfEdit);
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
      .map(TopicService.mapIBasicRetrospectiveCommentToIStickyNote)
      .map((resetNote: IStickyNote) => {
        resetNote.mode = StickyNoteMode.Display;
        this._topic.comments[this.findIndexOfCommentByUuid(stickyNote.uuid)] = resetNote;
        return new NotificationMessage(NotificationMessageType.INFO, 'No Changes were made to the comment', 5);
      });
  }

  private createNewComment(stickyNote: IStickyNote): Observable<NotificationMessage> {
    let comment: CreateCommentJSON = <CreateCommentJSON>{};
    comment.title = stickyNote.title;
    comment.description = stickyNote.description;
    comment.anonymous = stickyNote.author !== null;
    return this.retrospectiveService.createComment(this._topic.uuid, comment).first()
      .map(TopicService.mapIBasicRetrospectiveCommentToIStickyNote)
      .map((returnStickyNote: IStickyNote) => {
          stickyNote.uuid = returnStickyNote.uuid;
          stickyNote.topicUuid = returnStickyNote.topicUuid;
          stickyNote.title = returnStickyNote.title;
          stickyNote.description = returnStickyNote.description;
          stickyNote.author = returnStickyNote.author;
          stickyNote.votes = returnStickyNote.votes;
          stickyNote.mode = StickyNoteMode.Display;
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
        stickyNote.mode = StickyNoteMode.Display;
        return new NotificationMessage(NotificationMessageType.SUCCESS, 'Comment has been changed', 5);
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
    return this._topic.comments.map(TopicService.mapIBasicRetrospectiveCommentToIStickyNote);
  }

  public get ownComments(): IStickyNote[] {
    return this._topic.comments.filter((comment: IBasicRetrospectiveComment<IRetrospectiveUser>) => {
      return comment.author.uuid === this.authService.getLoggedInUser().uuid;
    }).map(TopicService.mapIBasicRetrospectiveCommentToIStickyNote);
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


  private findIndexOfCommentByUuid(uuid: string): number {
    return this._topic.comments.map(comment => {
      return comment.uuid;
    }).indexOf(uuid);
  }
}
