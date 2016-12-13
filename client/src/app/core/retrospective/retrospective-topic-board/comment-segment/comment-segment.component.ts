import {
  Component, OnInit, ContentChild, forwardRef, AfterContentInit, ViewChild, AfterViewInit,
  EventEmitter
} from '@angular/core';
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
    this.topicService.newComment$.subscribe((position: number) => {
      // at first comment no Carousel exists
      if (this.commentCarousel != null) {
        this.commentCarousel.moveCarouselToPosition(position);
      }
    });
  }

  public createComment(): void {
    this.topicService.addNewEmptyComment();
  }

  public get hasComments(): boolean {
    return this.comments != null && this.comments.length > 0;
  }

  public get comments(): IStickyNote[] {
    return this.topicService.ownComments;
  }

}
