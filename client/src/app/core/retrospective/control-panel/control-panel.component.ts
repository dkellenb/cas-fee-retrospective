import {Component, OnInit, Input} from '@angular/core';
import {IBasicRetrospective, IRetrospectiveUser} from '../../../shared/model/';

@Component({
  selector: 'rsb-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {

  @Input()
  private retrospective: IBasicRetrospective<IRetrospectiveUser>;

  constructor() {
  }

  ngOnInit() {
  }

  public get users(): IRetrospectiveUser[] {
    if (this.retrospective != null) {
      return this.retrospective.attendees;
    }
    return [];
  }
}
