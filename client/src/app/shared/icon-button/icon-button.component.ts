import {Component, OnInit, Input} from '@angular/core';
import {IconButtonType} from './icon-button-type';
import {HtmlUidGenerator} from '../html-uid-generator';

@Component({
  selector: 'rsb-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss']
})
export class IconButtonComponent implements OnInit {

  @Input()
  private buttonType: IconButtonType = IconButtonType.NONE;

  @Input()
  private lableText: string = null;

  @Input()
  private htmlUid: string;

  @Input()
  private toggleStatus: boolean = true;

  @Input()
  private activated: boolean = false;

  public iconButtonType = IconButtonType;

  constructor() {

  }

  ngOnInit() {
    if (!this.htmlUid) {
      this.htmlUid = 'button__' + HtmlUidGenerator.getUid();
    }
  }

  public performToggle(): void {
    this.toggleStatus = !this.toggleStatus;
  }

  public get hasLable(): boolean {
    return this.lableText != null && this.lableText.trim().length > 0;
  }

  public get htmlClassName(): string {
    if (this.buttonType.isToggleButton && !this.toggleStatus) {
      return this.buttonType.toggleClassName;
    }
    return this.buttonType.className;
  }

  public get isToggleButton(): boolean {
    return this.buttonType.isToggleButton;
  }
}
