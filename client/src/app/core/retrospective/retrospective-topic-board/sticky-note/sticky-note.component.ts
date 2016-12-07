import {Component, OnInit, Input} from '@angular/core';
import {IconButtonType, NotifierService} from '../../../../shared';
import {TopicService, IStickyNote, StickyNoteMode} from '../services/';
import {NotificationMessage} from '../../../../shared/notification-message/notification-message';
import {NotificationMessageType} from '../../../../shared/notification-message/notification-message-type';

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
  private _isWaitingForDelet = false;
  private _isWatingForReload = false;

  private validationErrorMessage: NotificationMessage;
  private titleError: boolean = false;
  private descError: boolean = false;

  constructor(private topicService: TopicService,
              private notificationService: NotifierService) {

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
        this.notificationService.pushNextMessage(new NotificationMessage(NotificationMessageType.ERROR,
          'There was a error while trying to save comment', 10));
      });
    }
  }

  public aboardEdit(): void {
    if (this.stickyNote.uuid == null) {
      this.deleteComment();
    } else if (!this._isWatingForReload) {
      this._isWatingForReload = true;
      this.topicService.reloadStickyNote(this.stickyNote)
        .first()
        .subscribe((notificationMessage: NotificationMessage) => {
          this._isWatingForReload = false;
          this.notificationService.pushNextMessage(notificationMessage);
        }, e => {
          this._isWatingForReload = false;
          this.notificationService.pushNextMessage(new NotificationMessage(NotificationMessageType.ERROR,
            'There was a error while trying to reload comment', 10));
        });
    }
    if (this.validationErrorMessage != null) {
      this.validationErrorMessage.setMessageExpired();
    }
  }

  public enterEditMode(): void {
    this.stickyNote.mode = StickyNoteMode.Edit;
  }

  public deleteComment() {
    if (!this._isWaitingForDelet) {
      this._isWaitingForDelet = true;
      this.topicService.deleteComment(this.stickyNote)
        .first()
        .subscribe((notificationMessage: NotificationMessage) => {
          this.notificationService.pushNextMessage(notificationMessage);
          this._isWaitingForDelet = false;
        }, e => {
          this.notificationService.pushNextMessage(new NotificationMessage(NotificationMessageType.ERROR,
            'There was a error while trying to delete comment', 10));
          this._isWaitingForDelet = false;
        });
    }
  }

  public vote(): void {

  }

  public inputValidation(): boolean {
    this.titleError = this.stickyNote.title == null || this.stickyNote.title.trim() === '';
    this.descError = this.stickyNote.description == null || this.stickyNote.description.trim() === '';

    if (this.titleError || this.descError) {
      this.validationErrorMessage = new NotificationMessage(NotificationMessageType.WARNING,
        'There are missing infomration for this sticky-note');
      this.notificationService.pushNextMessage(this.validationErrorMessage);
      return false;
    } else if (this.validationErrorMessage != null) {
      this.validationErrorMessage.setMessageExpired();
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
