import {Component, OnInit, Input} from '@angular/core';
import {IconButtonType} from "./icon-button-type";

@Component({
  selector: 'rsb-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.css']
})
export class IconButtonComponent implements OnInit {

  @Input()
  private buttonType: IconButtonType = IconButtonType.NONE;

  @Input()
  private toggleStatus: boolean = true;

  public iconButtonType = IconButtonType;

  constructor() {

  }

  public getHtmlClassName(): string {
    if (this.buttonType.isToggleButton && !this.toggleStatus) {
      return this.buttonType.toggleClassName;
    }
    return this.buttonType.className
  }

  public isToggleButton(): boolean {
    return this.buttonType.isToggleButton;
  }

  ngOnInit() {

  }

  public toggleButton(): void {
    this.toggleStatus = !this.toggleStatus;
  }
}
