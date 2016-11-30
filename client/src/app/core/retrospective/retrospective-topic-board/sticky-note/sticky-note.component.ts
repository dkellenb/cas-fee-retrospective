import {Component, OnInit, Input} from '@angular/core';
import {IconButtonType} from '../../../../shared';
import {TopicService, IStickyNote, StickyNoteMode} from '../services/';

@Component({
  selector: 'rsb-sticky-note',
  templateUrl: './sticky-note.component.html',
  styleUrls: ['./sticky-note.component.css']
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

  public get isDisplayMode(): boolean {
    return this.stickyNote.mode === StickyNoteMode.Display;
  }

  public get showForm(): boolean {
    return this.isEditMode || this.isNewMode;
  }

  public get showAuthor() {
    return !this.stickyNote.anonymous && this.stickyNote.author !== null;
  }
}
