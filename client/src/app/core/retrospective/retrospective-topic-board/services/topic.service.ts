import {Injectable, OnDestroy} from '@angular/core';
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
import {Subject} from "rxjs";

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

  public ngOnDestroy(): void {
    this.newComment$.complete();
  }

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
    if (this.hasCommentInEditMode) {
      return;
    }
    let comment: IStickyNote = <IStickyNote>{};
    comment.author = this.getLoggedInRetrospectiveUser();
    comment.anonymous = false;
    comment.topicUuid = this._topic.uuid;
    comment.mode = StickyNoteMode.New;
    this.newComment$.next((this._topic.comments.push(comment) - 1));
  }

  public saveComment(stickyNote: IStickyNote) {
    if (stickyNote.mode === StickyNoteMode.New) {
      this.createNewComment(stickyNote);
    } else {
      this.updateComment(stickyNote);
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
      this.retrospectiveService.deleteComment(this._topic.uuid, stickyNote.uuid).first().subscribe(success => {
          if (success) {
            console.log('Comment deleted on Server with id ' + stickyNote.uuid);
          }
        }
      );
    }
  }

  public reloadStickyNote(stickyNote: IStickyNote) {
    this.retrospectiveService.getComment(stickyNote.uuid)
      .first()
      .map(TopicService.mapIBasicRetrospectiveCommentToIStickyNote)
      .subscribe((resetNote: IStickyNote) => {
        let index = this._topic.comments.map(comment => {
          return comment.uuid;
        }).indexOf(resetNote.uuid);
        this.comments[index] = resetNote;
      });
  }

  private createNewComment(stickyNote: IStickyNote): void {
    let comment: CreateCommentJSON = <CreateCommentJSON>{};
    comment.title = stickyNote.title;
    comment.description = stickyNote.description;
    comment.anonymous = stickyNote.author !== null;
    this.retrospectiveService.createComment(this._topic.uuid, comment).first()
      .map(TopicService.mapIBasicRetrospectiveCommentToIStickyNote)
      .first()
      .subscribe((returnStickyNote: IStickyNote) => {
        stickyNote.uuid = returnStickyNote.uuid;
        stickyNote.topicUuid = returnStickyNote.topicUuid;
        stickyNote.title = returnStickyNote.title;
        stickyNote.description = returnStickyNote.description;
        stickyNote.author = returnStickyNote.author;
        stickyNote.votes = returnStickyNote.votes;
        stickyNote.mode = StickyNoteMode.Display;
      });
  }

  private updateComment(stickyNote: IStickyNote): void {
    let comment: UpdateCommentJSON = <UpdateCommentJSON>{};
    comment.title = stickyNote.title;
    comment.description = stickyNote.description;
    comment.anonymous = stickyNote.author !== null;
    this.retrospectiveService.updateComment(this._topic.uuid, stickyNote.uuid, comment)
      .first()
      .subscribe(() => {
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
}
