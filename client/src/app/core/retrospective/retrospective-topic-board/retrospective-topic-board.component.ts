import {Component, OnInit, Input} from '@angular/core';
import {IBasicRetrospectiveTopic, IRetrospectiveUser} from '../../../shared/model';
import {IconButtonType} from '../../../shared';
import {TopicService} from './services/topic.service';
import {RetrospectiveStatus} from '../../../shared/model/retrospective/RetrospectiveStatus';

@Component({
  selector: 'rsb-retrospective-topic-board',
  templateUrl: './retrospective-topic-board.component.html',
  styleUrls: ['./retrospective-topic-board.component.css'],
  providers: [TopicService]
})
export class RetrospectiveTopicBoardComponent implements OnInit {

  @Input()
  public topic: IBasicRetrospectiveTopic<IRetrospectiveUser>;

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
    let retroStatus: RetrospectiveStatus = this.topicService.retroStatus;
    return retroStatus === RetrospectiveStatus.OPEN
      || (retroStatus === RetrospectiveStatus.REVIEW && this.topicService.hasManagerRole)
      || (retroStatus === RetrospectiveStatus.GROUP && this.topicService.hasManagerRole);
  }

  private get showCommentSegment() {
    return this.topicService.retroStatus === RetrospectiveStatus.OPEN;
  }
}
