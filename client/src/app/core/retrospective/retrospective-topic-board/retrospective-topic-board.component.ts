import {Component, OnInit, Input} from '@angular/core';
import {IBasicRetrospectiveTopic, IRetrospectiveUser} from '../../../shared/model';
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
