export class UUID {
  private uuid: string;

  private static createUUID() {
    /* tslint:disable */
    // your favourite uuid generation function could go here
    // ex: http://stackoverflow.com/a/8809472/188246
    var date = new Date();
    let d = date.getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    /* tslint:enable */
  }

  constructor(uuid?: string) {
    this.uuid = uuid || UUID.createUUID();
  }

  toString() {
    return this.uuid;
  }

}
