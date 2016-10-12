import { Component, OnInit } from '@angular/core';
import {IconButtonType} from '../../shared';

@Component({
  selector: 'rsb-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.css']
})
export class CreateSessionComponent implements OnInit {


  public iconButtonType = IconButtonType;


  constructor() { }



  ngOnInit() {
  }

}
