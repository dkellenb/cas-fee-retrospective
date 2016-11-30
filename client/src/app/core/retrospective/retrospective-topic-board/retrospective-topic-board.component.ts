import {Component, OnInit, Input} from '@angular/core';
import {IBasicRetrospectiveTopic} from '../../../shared/model/RetrospectiveDomainModel';
import {IRetrospectiveUser} from '../../../shared/model/UserDomainModel';

@Component({
  selector: 'rsb-retrospective-topic-board',
  templateUrl: './retrospective-topic-board.component.html',
  styleUrls: ['./retrospective-topic-board.component.css']
})
export class RetrospectiveTopicBoardComponent implements OnInit {

  @Input()
  public topic: IBasicRetrospectiveTopic<IRetrospectiveUser>;

  constructor() {
  }

  ngOnInit() {
  }

}
