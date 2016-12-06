import {Component, OnInit, transition, style, animate, trigger} from '@angular/core';
import {NotificationMessage} from '../notification-message/notification-message';
import {NotifierService} from './notifier.service';

@Component({
  selector: 'rsb-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity: 0}),
        animate(500, style({opacity: 1}))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(500, style({opacity: 0}))
      ])
    ])
  ]
})
export class NotifierComponent implements OnInit {

  private _currendNotificationMessage: NotificationMessage;

  constructor(private notifierService: NotifierService) {
    this.notifierService.showNextNotificationMessage$.subscribe((notificationMessage: NotificationMessage) => {
      this._currendNotificationMessage = notificationMessage;
    });
  }

  ngOnInit() {

  }


  private get hasMessage(): boolean {
    return this._currendNotificationMessage != null;
  }
}
