import {Injectable, OnDestroy} from '@angular/core';
import {NotificationMessage} from '../notification-message/notification-message';
import {Subject} from 'rxjs';

@Injectable()
export class NotifierService implements OnDestroy {
  public showNextNotificationMessage$: Subject<NotificationMessage> = new Subject<NotificationMessage>();

  public notificationMessages: NotificationMessage[] = [];

  constructor() {
  }

  ngOnDestroy(): void {
    this.showNextNotificationMessage$.complete();
  }

  public pushNextMessage(message: NotificationMessage) {
    this.notificationMessages.push(message);
    this.sendNextMessage();
    console.log('Waiting messages' + this.notificationMessages.length);
  }

  private sendNextMessage() {
    this.updateMessageList();
    if (this.notificationMessages.length > 0) {
      this.notificationMessages[0].messageExpired$.first().subscribe((hasExpired: boolean) => {
        if (hasExpired) {
          this.sendNextMessage();
        }
      });
      this.showNextNotificationMessage$.next(this.notificationMessages[0]);
    } else {
      // No more Messages
      this.showNextNotificationMessage$.next(null);
    }
  }

  private updateMessageList() {
    this.notificationMessages = this.notificationMessages
      .filter((message: NotificationMessage) => {
        return !message.hasExpired;
      })
      .sort((message1: NotificationMessage, message2: NotificationMessage) => {
        return message1.messgePriority > message2.messgePriority ? 1
          : message1.messgePriority < message2.messgePriority ? -1
          : message1.createTime > message2.createTime ? 1
          : message1.createTime < message2.createTime ? -1
          : 0; // Default
      });
  }

}

