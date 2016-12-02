import {Component, OnInit, ContentChild, forwardRef, AfterContentInit, ViewChild, AfterViewInit} from '@angular/core';
import {IconButtonType, CarouselComponent} from '../../../../shared/';
import {TopicService, IStickyNote, StickyNoteMode} from '../services';

@Component({
  selector: 'rsb-comment-segment',
  templateUrl: './comment-segment.component.html',
  styleUrls: ['./comment-segment.component.css']
})
export class CommentSegmentComponent implements OnInit, AfterViewInit {
  public iconButtonType = IconButtonType;

  @ViewChild(CarouselComponent) public commentCarousel: CarouselComponent;

  constructor(private topicService: TopicService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    console.log(this.commentCarousel);
    this.topicService.registerForNewCommentEvent().subscribe((position: number) => {
      //at First comment no Carousel exists
      if (this.commentCarousel != null) {
        this.commentCarousel.moveCarouselToPosition(position);
      }
    })
  }

  public createComment(): void {
    this.topicService.addNewEmptyComment();
  }

  public get hasComments(): boolean {
    return this.comments != null && this.comments.length > 0;
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
