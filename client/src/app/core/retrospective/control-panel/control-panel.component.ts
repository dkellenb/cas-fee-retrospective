import {Component, OnInit, Input} from '@angular/core';
import {UserService} from '../../services';
import {IBasicRetrospective} from '../../../shared/model/RetrospectiveDomainModel';
import {IRetrospectiveUser} from '../../../shared/model/UserDomainModel';

@Component({
  selector: 'rsb-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {

  @Input()
  private retrospective: IBasicRetrospective<IRetrospectiveUser>;

  constructor(private userService: UserService) {
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
