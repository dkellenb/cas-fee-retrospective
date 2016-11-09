import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment.component';
import { CommentStickyNoteStackComponent } from './comment-sticky-note-stack';
import { CommentSegmentComponent } from './comment-segment';
import {SharedModule} from '../../shared';

@NgModule({
  imports: [
    CommonModule,SharedModule
  ],
  declarations: [CommentComponent, CommentStickyNoteStackComponent, CommentSegmentComponent]
})
export class CommentModule { }
