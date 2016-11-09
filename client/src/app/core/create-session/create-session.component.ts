import {Component, OnInit} from '@angular/core';
import {IconButtonType, AuthenticationService, RetrospectiveService} from '../../shared';

@Component({
  selector: 'rsb-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.css']
})
export class CreateSessionComponent implements OnInit {
  public iconButtonType = IconButtonType;

  // Fields
  public sessionTitle;
  public sessionDesc;
  public shortName;


  constructor(private authService: AuthenticationService, private retrospectiveService: RetrospectiveService) {
  }

  ngOnInit() {
  }

  public createSession() {
    this.retrospectiveService.createRetrospective(this.sessionTitle, this.sessionDesc, this.shortName).subscribe(sessionKey => {
      console.log('new SessionKey is: ' + sessionKey);
    });
  }

  public get isUserLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }


}
