import {Component, OnInit} from '@angular/core';
import {NotificationMessage} from "../notification-message/notification-message";

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css']
})
export class NotifierComponent implements OnInit {


  private _currendNotificationMessage: NotificationMessage;

  constructor() {
  }

  ngOnInit() {
  }


  private get hasMessage(): boolean {
    return this._currendNotificationMessage != null;
  }
}
