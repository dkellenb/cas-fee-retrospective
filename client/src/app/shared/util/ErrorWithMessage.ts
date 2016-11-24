export class ErrorWithMessage extends Error {
  public message;
  constructor(message) {
    super(message);
    this.message = message;
  }
}
