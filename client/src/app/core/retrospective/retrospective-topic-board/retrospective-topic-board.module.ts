import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RetrospectiveTopicBoardComponent} from './retrospective-topic-board.component';
import {TopicService} from './services/topic.service';
import {CommentSegmentComponent} from './comment-segment/comment-segment.component';
import {CommentStickyNoteStackComponent} from './comment-sticky-note-stack/comment-sticky-note-stack.component';
import {StickyNoteComponent} from './sticky-note/sticky-note.component';
import {SharedModule} from '../../../shared';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [RetrospectiveTopicBoardComponent,
    CommentSegmentComponent,
    CommentStickyNoteStackComponent,
    StickyNoteComponent],
  exports: [RetrospectiveTopicBoardComponent]
})
export class RetrospectiveTopicBoardModule {
}
