import {Component, OnInit, Input, trigger, state, transition, style, animate} from '@angular/core';
import {IconButtonType} from '../../../../shared';
import {TopicService, IStickyNote, StickyNoteMode} from '../services/';

@Component({
  selector: 'rsb-sticky-note',
  templateUrl: './sticky-note.component.html',
  styleUrls: ['./sticky-note.component.scss'],
})
export class StickyNoteComponent implements OnInit {

  // noinspection TsLint
  private iconButtonType = IconButtonType;

  @Input()
  private stickyNote: IStickyNote;

  constructor(private topicService: TopicService) {

  }

  ngOnInit() {
  }

  public saveStickyNote(): void {
    this.topicService.saveComment(this.stickyNote);
  }

  public aboardEdit(): void {
    console.log('aboard edit: ' + this.stickyNote);
    if (this.stickyNote.uuid == null) {
      this.topicService.deleteComment(this.stickyNote);
    } else {
      this.topicService.reloadStickyNote(this.stickyNote);
    }
  }

  public enterEditMode(): void {
    this.stickyNote.mode = StickyNoteMode.Edit;
  }

  public deleteComment() {
    this.topicService.deleteComment(this.stickyNote);
  }

  public vote(): void {

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
    return !this.stickyNote.anonymous && this.stickyNote.author !== null;
  }
}
