import {Component, OnInit} from '@angular/core';
import {IconButtonType} from './../shared';


@Component({
  selector: 'rsb-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})
export class CoreComponent implements OnInit {


  public iconButtonType = IconButtonType;

  constructor() {
  }

  ngOnInit() {
  }

}
