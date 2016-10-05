import {Component, OnInit, Input} from '@angular/core';
import {IconButtonType} from "./icon-button-types";

@Component({
  selector: 'icon-button',
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
