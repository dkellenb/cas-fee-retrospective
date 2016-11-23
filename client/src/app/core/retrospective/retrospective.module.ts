import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RetrospectiveComponent} from './retrospective.component';
import {SharedModule} from '../../shared/shared.module';
import {CommentSegmentComponent} from './comment-segment';
import {CommentStickyNoteStackComponent} from './comment-sticky-note-stack';
import { RetrospectiveTopicBoardComponent } from './retrospective-topic-board/retrospective-topic-board.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [RetrospectiveComponent],
  declarations: [RetrospectiveComponent,
    CommentStickyNoteStackComponent,
    CommentSegmentComponent,
    RetrospectiveTopicBoardComponent]
})
export class RetrospectiveModule {
}
