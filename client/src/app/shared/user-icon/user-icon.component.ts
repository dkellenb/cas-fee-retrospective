import {Component, OnInit, Input} from '@angular/core';
import {IRetrospectiveUser, UserRole} from '../model';

@Component({
  selector: 'rsb-user-icon',
  templateUrl: './user-icon.component.html',
  styleUrls: ['user-icon.component.scss']
})
export class UserIconComponent implements OnInit {

  @Input()
  public user: IRetrospectiveUser;

  constructor() {
  }

  ngOnInit() {
  }

  public get modifierClass() {
    return {
      'user__icon_user': this.user != null && this.user.role === UserRole.USER,
      'user__icon_manager': this.user != null && this.user.role === UserRole.MANAGER,
      'user__icon_admin': this.user != null && this.user.role === UserRole.ADMIN
    };
  }
}
