import { Component, OnInit } from '@angular/core';
import {IconButtonType} from '../../shared';
import {AuthenticationService} from '../../shared/services/authentication.service';

@Component({
  selector: 'rsb-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.css']
})
export class CreateSessionComponent implements OnInit {


  public iconButtonType = IconButtonType;


  constructor(private authService:AuthenticationService) { }



  ngOnInit() {
  }

  public get isUserLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }

}
