import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {IUser} from '../../../../../shared/src/model/user/User';

@Component({
  selector: 'rsb-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.css']
})
export class UserStatusComponent implements OnInit {

  private loggedInUser: IUser;

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit() {

  }

  public get isLoggedIn(): boolean {
    if (this.authService.isUserLoggedIn()) {
      this.loggedInUser = this.authService.getLoggedInUser();
      return true;
    }
    return false;
  }

  public logout(): void {
    this.authService.logoutUser();
  }
}
