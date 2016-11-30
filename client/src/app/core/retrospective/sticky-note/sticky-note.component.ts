import {Component, OnInit, Input} from '@angular/core';
import {IconButtonType} from '../../../shared';
import {IStickyNote} from './sticky-note.interface';
import {StickyNoteMode} from './sticky-note-mode.enum';

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

  @Input()
  private mode: StickyNoteMode = StickyNoteMode.Display;

  constructor() {
    this.stickyNote = <IStickyNote>{};
  }

  ngOnInit() {
  }

  public get isEditMode(): boolean {
    return this.mode === StickyNoteMode.Edit;
  }

  public get isVoteMode(): boolean {
    return this.mode === StickyNoteMode.Vote;
  }

  public get isNewMode(): boolean {
    return this.mode === StickyNoteMode.New;
  }

  public get isDisplayMode(): boolean {
    return this.mode === StickyNoteMode.Display;
  }
}
