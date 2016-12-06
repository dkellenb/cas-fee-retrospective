import {NotificationMessageType} from './notification-message-type';
import {Subject, Observable} from 'rxjs';
export class NotificationMessage {

  private _type: NotificationMessageType;
  private _message: string;
  private _messageExpired$: Subject<boolean> = new Subject<boolean>();
  private _hasExpired: boolean = false;
  private _messgePriority: number;
  private _createTime;

  /**
   * Notification Message
   * @param type Type of Message
   * @param message Text of Message
   * @param expiredTimer timer in Seconds
   */
  constructor(type: NotificationMessageType, message: string, expiredTimer?: number) {
    this._type = type;
    this._message = message;
    this._messgePriority = this.calcMessgePriority();
    this._createTime = new Date().getTime();

    if (expiredTimer != null) {
      setTimeout(() => {
        this.setMessageExpired();
      }, (expiredTimer * 1000));
    }
  }

  public setMessageExpired(): void {
    this._hasExpired = true;
    this._messageExpired$.next(true);
    this._messageExpired$.complete();
  }

  public get messageExpired$(): Observable<boolean> {
    return this._messageExpired$;
  }

  public get type(): NotificationMessageType {
    return this._type;
  }

  public get message(): string {
    return this._message;
  }

  public get hasExpired(): boolean {
    return this._hasExpired;
  }

  public get messgePriority(): number {
    return this._messgePriority;
  }

  public  get createTime() {
    return this._createTime;
  }

  private calcMessgePriority(): number {
    return this._type === NotificationMessageType.ERROR ? 4
      : this._type === NotificationMessageType.WARNING ? 3
      : this._type === NotificationMessageType.SUCCESS ? 2
      : this._type === NotificationMessageType.INFO ? 1
      : 0; // Default
  }

}
