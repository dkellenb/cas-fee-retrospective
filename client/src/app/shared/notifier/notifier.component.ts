import {Component, OnInit} from '@angular/core';
import {NotificationMessage} from "../notification-message/notification-message";
import {NotifierService} from "./notifier.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css']
})
export class NotifierComponent implements OnInit {


  private _currendNotificationMessage: NotificationMessage;
  private _waitForExpired: Subscription;

  constructor(private notifierService: NotifierService) {
    this.notifierService.showNextNotificationMessage$.subscribe((notificationMessage: NotificationMessage) => {

      if (this._waitForExpired != null) {
        this._waitForExpired.unsubscribe();
      }
      this._currendNotificationMessage = notificationMessage;

      this._waitForExpired = this._currendNotificationMessage.messageExpired.first().subscribe((hasExpired: boolean) => {
        if (hasExpired) {
          this._currendNotificationMessage = null;
        }
      });
    });
  }

  ngOnInit() {

  }


  private get hasMessage(): boolean {
    return this._currendNotificationMessage != null;
  }
}
