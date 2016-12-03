import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RetrospectiveTopicBoardComponent} from './retrospective-topic-board.component';
import {StickyNoteComponent} from './sticky-note/sticky-note.component';
import {CommentSegmentComponent} from './comment-segment/comment-segment.component';
import {CommentStickyNoteStackComponent} from './comment-sticky-note-stack/comment-sticky-note-stack.component';
import {SharedModule} from '../../../shared';
import { CommentSurfaceComponent } from './comment-surface/comment-surface.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [RetrospectiveTopicBoardComponent,
    CommentSegmentComponent,
    StickyNoteComponent,
    CommentSurfaceComponent],
  exports: [RetrospectiveTopicBoardComponent]
})
export class RetrospectiveTopicBoardModule {
}
