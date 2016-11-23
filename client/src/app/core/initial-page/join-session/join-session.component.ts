import {Component, OnInit} from '@angular/core';
import {IconButtonType, AuthenticationService} from '../../../shared';

@Component({
  selector: 'rsb-join-session',
  templateUrl: 'join-session.component.html',
  styleUrls: ['join-session.component.css']
})
export class JoinSessionComponent implements OnInit {

  public iconButtonType = IconButtonType;

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit() {
  }

  public get isUserLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }


}