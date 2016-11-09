import {Component, OnInit} from '@angular/core';
import {IconButtonType, UserService,AuthenticationService} from '../../shared';

@Component({
  selector: 'app-debug-user-service',
  templateUrl: './debug-user-service.component.html',
  styleUrls: ['./debug-user-service.component.css']
})
export class DebugUserServiceComponent implements OnInit {

  public iconButtonType = IconButtonType;


  //Fields
  public shortName: string;
  public email: string;
  public fullName: string;


  constructor(private userService: UserService, private authService:AuthenticationService) {
  }

  ngOnInit() {
  }

  public createUser(): void {

    this.userService.createUser(this.shortName, this.fullName, this.email).subscribe(created => {
      if(created){
        console.log("user wurde erfolgreich angelegt")
      }

      console.log('Eingaben waren: Shortname: ' + this.shortName + " email: " + this.email + " fullname: " + this.fullName);
      console.log(this.authService.getLoggedInUser())
    });
  }

}
