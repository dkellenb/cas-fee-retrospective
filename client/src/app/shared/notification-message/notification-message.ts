import {NotificationMessageType} from './notification-message-type';
import {Subject, Observable} from "rxjs";
export class NotificationMessage {

  private _type: NotificationMessageType;
  private _message: string;
  private _messageExpired$: Subject<boolean> = new Subject<boolean>();

  constructor(type: NotificationMessageType, message: string) {
    this._type = type;
    this._message = message;
  }

  public setMessageExpired() {
    this._messageExpired$.next(true);
    this._messageExpired$.complete();
  }

  public get messageExpired(): Observable<boolean> {
    return this._messageExpired$;
  }

  public get type(): NotificationMessageType {
    return this._type;
  }

  public set type(value: NotificationMessageType) {
    this._type = value;
  }

  public get message(): string {
    return this._message;
  }

  public set message(value: string) {
    this._message = value;
  }


}
