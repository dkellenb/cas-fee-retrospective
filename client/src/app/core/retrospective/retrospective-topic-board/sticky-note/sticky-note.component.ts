import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IconButtonType, NotifierService} from '../../../../shared';
import {TopicService, IStickyNote, StickyNoteMode} from '../services/';
import {NotificationMessage} from '../../../../shared/notifier/services/notification-message';
import {NotificationMessageType} from '../../../../shared/notifier/services/notification-message-type';

@Component({
  selector: 'rsb-sticky-note',
  templateUrl: './sticky-note.component.html',
  styleUrls: ['./sticky-note.component.scss'],
})
export class StickyNoteComponent implements OnInit {

  // noinspection TsLint used in template
  private iconButtonType = IconButtonType;

  @Input()
  private stickyNote: IStickyNote;

  // noinspection TsLint used in template
  @Input()
  private covered: boolean = false;

  private _isWaitingForCommit = false;
  private _isWaitingForDelete = false;
  private _isWaitingForReload = false;
  private hasActiveVote = false;

  private validationErrorMessage: NotificationMessage;
  private titleError: boolean = false;
  private descError: boolean = false;

  constructor(private topicService: TopicService,
              private notificationService: NotifierService) {
    this.stickyNote = <IStickyNote>{mode: StickyNoteMode.Display};
  }

  ngOnInit() {
  }


  public saveStickyNote(): void {
    if (!this._isWaitingForCommit && this.inputValidation()) {
      this._isWaitingForCommit = true;
      this.topicService.saveComment(this.stickyNote).first().subscribe((notificationMessage) => {
        this._isWaitingForCommit = false;
        this.notificationService.pushNextMessage(notificationMessage);
      }, e => {
        this._isWaitingForCommit = false;
        console.log(e);
        this.notificationService.pushNextMessage(new NotificationMessage(NotificationMessageType.ERROR,
          'There was a error while trying to save comment', 10));
      });
    }
  }

  public aboardEdit(): void {
    if (this.validationErrorMessage != null) {
      this.validationErrorMessage.setMessageExpired();
    }
    if (this.stickyNote.uuid == null) {
      this.deleteComment();
    } else if (!this._isWaitingForReload) {
      this._isWaitingForReload = true;
      this.topicService.reloadStickyNote(this.stickyNote)
        .first()
        .subscribe((notificationMessage: NotificationMessage) => {
          this._isWaitingForReload = false;
          this.notificationService.pushNextMessage(notificationMessage);
        }, e => {
          this._isWaitingForReload = false;
          console.log(e);
          this.notificationService.pushNextMessage(new NotificationMessage(NotificationMessageType.ERROR,
            'There was a error while trying to reload comment', 10));
        });
    }
  }

  public enterEditMode(): void {
    this.stickyNote.mode = StickyNoteMode.Edit;
  }

  public deleteComment() {
    if (!this._isWaitingForDelete) {
      this._isWaitingForDelete = true;
      this.topicService.deleteComment(this.stickyNote)
        .first()
        .subscribe((notificationMessage: NotificationMessage) => {
          this.notificationService.pushNextMessage(notificationMessage);
          this._isWaitingForDelete = false;
        }, e => {
          this.notificationService.pushNextMessage(new NotificationMessage(NotificationMessageType.ERROR,
            'There was a error while trying to delete comment', 10));
          this._isWaitingForDelete = false;
        });
    }
  }

  public vote(): void {
    if (this.hasActiveVote) {
      this.topicService.removeVoteForComment(this.stickyNote.uuid)
        .first()
        .subscribe((notificationMessage: NotificationMessage) => {
          this.notificationService.pushNextMessage(notificationMessage);
          this.hasActiveVote = false;
        }, e => {
          console.log(e);
          this.notificationService.pushNextMessage(new NotificationMessage(NotificationMessageType.ERROR,
            'There was a error while trying to remove vote for comment', 10));
        });
    } else {
      this.topicService.voteForComment(this.stickyNote.uuid)
        .first()
        .subscribe((notificationMessage: NotificationMessage) => {
          this.notificationService.pushNextMessage(notificationMessage);
          this.hasActiveVote = true;
        }, e => {
          console.log(e);
          this.notificationService.pushNextMessage(new NotificationMessage(NotificationMessageType.ERROR,
            'There was a error while trying to vote for comment', 10));
        });
    }
  }

  public inputValidation(): boolean {
    if (this.validationErrorMessage != null) {
      this.validationErrorMessage.setMessageExpired();
    }
    this.titleError = this.stickyNote.title == null || this.stickyNote.title.trim() === '';
    this.descError = this.stickyNote.description == null || this.stickyNote.description.trim() === '';

    if (this.titleError || this.descError) {
      this.validationErrorMessage = new NotificationMessage(NotificationMessageType.WARNING,
        'There are missing information for this sticky-note');
      this.notificationService.pushNextMessage(this.validationErrorMessage);
      return false;
    }
    return true;
  }

  public get isEditMode(): boolean {
    return this.stickyNote.mode === StickyNoteMode.Edit;
  }

  public get isVoteMode(): boolean {
    return this.stickyNote.mode === StickyNoteMode.Vote;
  }

  public get isNewMode(): boolean {
    return this.stickyNote.mode === StickyNoteMode.New;
  }

  public get isEditableMode(): boolean {
    return this.stickyNote.mode === StickyNoteMode.Editable;
  }

  public get isDisplayMode(): boolean {
    return this.stickyNote.mode === StickyNoteMode.Display || this.isEditableMode;
  }

  public get isClosedMode(): boolean {
    return this.stickyNote.mode === StickyNoteMode.Closed;
  }

  public get showEditButton(): boolean {
    return this.isEditableMode && !this.topicService.hasCommentInEditMode;
  }

  public get showDeleteButton(): boolean {
    return this.isEditableMode;
  }

  public get showForm(): boolean {
    return this.isEditMode || this.isNewMode;
  }

  public get showAuthor() {
    return this.stickyNote.author !== null;
  }
}
