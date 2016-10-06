import {Component, OnInit, Input} from '@angular/core';
import {IconButtonType} from "./icon-button-type";

@Component({
  selector: 'rsb-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.css']
})
export class IconButtonComponent implements OnInit {

  @Input()
  iconButtonType: IconButtonType;

  constructor() {

  }

  ngOnInit() {

  }
}
