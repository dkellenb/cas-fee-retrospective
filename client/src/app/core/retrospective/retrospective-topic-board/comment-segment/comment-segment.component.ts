import {Component, OnInit, DoCheck} from '@angular/core';
import {IconButtonType} from '../../../../shared/';
import {TopicService, IStickyNote, StickyNoteMode} from '../services';

@Component({
  selector: 'rsb-comment-segment',
  templateUrl: './comment-segment.component.html',
  styleUrls: ['./comment-segment.component.css']
})
export class CommentSegmentComponent implements OnInit, DoCheck {
  public iconButtonType = IconButtonType;

  private numberOfComments: number = 0;

  constructor(private topicService: TopicService) {
  }

  ngDoCheck(): void {
    if (this.numberOfComments < this.comments.length) {
      this.numberOfComments = this.comments.length;
      console.log('new Comment has been added');
    }
  }

  ngOnInit() {
  }

  public createComment(): void {
    this.topicService.addNewEmptyComment();
  }


  public get hasComments(): boolean {
    return this.comments != null && this.comments.length > 0;
  }

  public get topicName(): string {
    return this.topicService.topicName;
  }


  public get comments(): IStickyNote[] {
    return this.topicService.ownComments.map((stickyNote: IStickyNote) => {
      if (stickyNote.mode === StickyNoteMode.Display) {
        stickyNote.mode = StickyNoteMode.Editable;
      }
      return stickyNote;
    });
  }

}
