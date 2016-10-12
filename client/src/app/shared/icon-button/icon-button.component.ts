import {Component, OnInit, Input} from '@angular/core';
import {IconButtonType} from "./icon-button-type";

@Component({
  selector: 'rsb-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.css']
})
export class IconButtonComponent implements OnInit {

  @Input()
  private buttonType:IconButtonType = IconButtonType.ADD;

  public iconButtonType = IconButtonType;

  constructor() {

  }

  public getHtmlClassName():string {
    return this.buttonType.className;
  }

  public isToggleButton():boolean{
    return this.buttonType.isToggleButton;
  }

  ngOnInit() {

  }
}
