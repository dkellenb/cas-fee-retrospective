import {Component, OnInit} from '@angular/core';
import {NotificationMessage} from "../notification-message/notification-message";
import {NotifierService} from "./notifier.service";

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css']
})
export class NotifierComponent implements OnInit {


  private _currendNotificationMessage: NotificationMessage;

  constructor(private notifierService: NotifierService) {

  }

  ngOnInit() {
  }


  private get hasMessage(): boolean {
    return this._currendNotificationMessage != null;
  }
}
