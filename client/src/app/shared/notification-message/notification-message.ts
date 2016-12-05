import {NotificationMessageType} from './notification-message-type';
export class NotificationMessage {

  private _type: NotificationMessageType;
  private _message: string;

  constructor(type: NotificationMessageType, message: string) {
    this._type = type;
    this._message = message;
  }

  get type(): NotificationMessageType {
    return this._type;
  }

  set type(value: NotificationMessageType) {
    this._type = value;
  }

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    this._message = value;
  }
}
