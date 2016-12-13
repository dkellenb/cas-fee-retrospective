import {Component, OnInit, Input} from '@angular/core';
import {IStickyNote, TopicService} from '../services/';
import {RetrospectiveStatus} from '../../../../shared/model/retrospective/RetrospectiveStatus';
import {StickyNoteMode} from '../services/sticky-note-mode.enum';

@Component({
  selector: 'rsb-comment-surface',
  templateUrl: './comment-surface.component.html',
  styleUrls: ['./comment-surface.component.scss']
})
export class CommentSurfaceComponent implements OnInit {

  @Input()
  private mode: RetrospectiveStatus;

  constructor(private topicService: TopicService) {
  }

  ngOnInit() {
  }

  public get comments(): IStickyNote[] {
    return this.topicService.comments.map((stickyNote: IStickyNote) => {
      if (this.mode === RetrospectiveStatus.VOTE) {
        stickyNote.mode = StickyNoteMode.Vote;
      }
      if (this.mode === RetrospectiveStatus.REVIEW || this.mode === RetrospectiveStatus.GROUP) {
        stickyNote.mode = StickyNoteMode.Editable;
      }
      return stickyNote;
    });
  }

  private get isCommentStack(): boolean {
    return this.mode === RetrospectiveStatus.OPEN;
  }
}
