export class ErrorWithMessage extends Error {
  private message;
  constructor(message) {
    super(message);
    this.message = message;
  }
}
