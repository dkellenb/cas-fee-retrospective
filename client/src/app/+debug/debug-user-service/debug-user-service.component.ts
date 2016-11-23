import {Component, OnInit} from '@angular/core';
import {IconButtonType, AuthenticationService} from '../../shared';
import {UserService} from '../../core/services/user.service';

@Component({
  selector: 'rsb-debug-user-service',
  templateUrl: './debug-user-service.component.html',
  styleUrls: ['./debug-user-service.component.css']
})
export class DebugUserServiceComponent implements OnInit {

  public iconButtonType = IconButtonType;


  // Fields
  public shortName: string;
  public email: string;
  public fullName: string;


  constructor(private userService: UserService, private authService: AuthenticationService) {
  }

  ngOnInit() {
  }

  public createUser(): void {

    this.userService.createUser(this.shortName, this.fullName, this.email).subscribe(created => {
      if (created) {
        console.log('create user success');
      }
      console.log(this.authService.getLoggedInUser());
    });
  }

}
