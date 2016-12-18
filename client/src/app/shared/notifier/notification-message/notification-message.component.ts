import {Component, OnInit, Input} from '@angular/core';
import {NotificationMessage} from './notification-message';
import {NotificationMessageType} from './notification-message-type';

@Component({
  selector: 'rsb-notification-message',
  templateUrl: 'notification-message.component.html',
  styleUrls: ['notification-message.component.scss']
})
export class NotificationMessageComponent implements OnInit {

  @Input()
  public message: NotificationMessage = null;

  constructor() {
  }

  ngOnInit() {
  }

  public get isError(): boolean {
    return this.message != null && NotificationMessageType.ERROR === this.message.type;
  }

  public get isWarning(): boolean {
    return this.message != null && NotificationMessageType.WARNING === this.message.type;
  }

  public get isInfo(): boolean {
    return this.message != null && NotificationMessageType.INFO === this.message.type;
  }

  public get isSuccess(): boolean {
    return this.message != null && NotificationMessageType.SUCCESS === this.message.type;
  }

  public get modifierClass() {
    return {
      'notification-message__content_success': this.isSuccess,
      'notification-message__content_info': this.isInfo,
      'notification-message__content_warning': this.isWarning,
      'notification-message__content_error': this.isError
    };
  }
}
