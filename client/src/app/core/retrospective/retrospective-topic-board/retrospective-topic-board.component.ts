import {Component, OnInit, Input} from '@angular/core';
import {IBasicRetrospectiveTopic, IRetrospectiveUser} from '../../../shared/model';
import {IconButtonType} from '../../../shared';
import {TopicService} from './services/topic.service';
import {RetrospectiveStatus} from '../../../shared/model/retrospective/RetrospectiveStatus';
import {RetrospectiveService} from '../../services/retrospective.service';
import {SharedHeightService} from '../../../shared/sharedHeight/shared-height.service';

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

  constructor(private topicService: TopicService,
              private retrospectiveService: RetrospectiveService) {
  }

  ngOnInit() {
    this.topicService.topic = this.topic;
  }

  public addComment(): void {
    this.topicService.addNewEmptyComment();
  }

  private get showAddCommentButton(): boolean {
    return this.retroStatus === RetrospectiveStatus.OPEN
      || (this.retroStatus === RetrospectiveStatus.REVIEW && this.retrospectiveService.hasManagerRole())
      || (this.retroStatus === RetrospectiveStatus.GROUP && this.retrospectiveService.hasManagerRole());
  }

  private get showCommentSegment() {
    return this.retroStatus === RetrospectiveStatus.OPEN;
  }
}
