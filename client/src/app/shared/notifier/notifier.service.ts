import {Injectable} from '@angular/core';
import {NotificationMessage} from "../notification-message/notification-message";
import {Subject} from "rxjs";

@Injectable()
export class NotifierService {

  public showNextNotificationMessage$: Subject<NotificationMessage> = new Subject<NotificationMessage>();


  constructor() {
  }


}
