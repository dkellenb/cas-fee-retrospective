import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment.component';
import { CommentStickyNoteStackComponent } from './comment-sticky-note-stack/comment-sticky-note-stack.component';
import { CommentBoardBodyComponent } from './comment-board-body/comment-board-body.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CommentComponent, CommentStickyNoteStackComponent, CommentBoardBodyComponent]
})
export class CommentModule { }
