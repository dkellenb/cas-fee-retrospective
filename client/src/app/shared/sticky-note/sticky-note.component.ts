import {Component, OnInit, Input} from '@angular/core';
import {IBasicRetrospectiveComment, IUser} from '../model';
import {IconButtonType} from '../icon-button';

@Component({
  selector: 'rsb-sticky-note',
  templateUrl: './sticky-note.component.html',
  styleUrls: ['./sticky-note.component.scss']
})
export class StickyNoteComponent implements OnInit {

  // noinspection TsLint
  private iconButtonType = IconButtonType;

  // @Input()
  private stickyNote: IBasicRetrospectiveComment<IUser>;

  @Input()
  private mode: StickyNoteMode = StickyNoteMode.Display;

  constructor() {
    this.stickyNote = <IBasicRetrospectiveComment<IUser>>{};
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

export enum StickyNoteMode {
  Edit, Vote, New, Display
}
