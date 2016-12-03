import {Component, OnInit, Input, ContentChild, AfterViewInit} from '@angular/core';
import {IBasicRetrospectiveTopic, IRetrospectiveUser, RetrospectiveStatus} from '../../../shared/model';
import {IconButtonType, CarouselComponent} from '../../../shared';
import {TopicService} from './services/topic.service';
@Component({
  selector: 'rsb-retrospective-topic-board',
  templateUrl: './retrospective-topic-board.component.html',
  styleUrls: ['./retrospective-topic-board.component.css'],
  providers: [TopicService]
})
export class RetrospectiveTopicBoardComponent implements OnInit {

  @Input()
  public topic: IBasicRetrospectiveTopic<IRetrospectiveUser>;

  @Input()
  public retroStatus: RetrospectiveStatus;

  public iconButtonType = IconButtonType;

  constructor(private topicService: TopicService) {
  }

  ngOnInit() {
    this.topicService.topic = this.topic;
  }

  public addComment(): void {
    this.topicService.addNewEmptyComment();
  }

  private get showAddCommentButton(): boolean {
    return this.retroStatus === RetrospectiveStatus.OPEN;
  }

  private get showCommentSegment() {
    return this.retroStatus === RetrospectiveStatus.OPEN;
  }
}
