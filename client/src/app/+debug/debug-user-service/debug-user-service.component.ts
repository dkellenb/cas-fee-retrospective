import {Component, OnInit} from '@angular/core';
import {IconButtonType} from '../../shared';

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


  constructor() {
  }

  ngOnInit() {
  }

  public createUser(): void {
    alert('Eingaben waren: Shortname: ' + this.shortName + " email: " + this.email + " fullname: " + this.fullName);
  }

}
