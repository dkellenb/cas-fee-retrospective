export class HtmlUidGenerator {

  private static id_sequence: number = 0;

  constructor() {
  }

  public static getUid(): number {
    HtmlUidGenerator.id_sequence++;
    return HtmlUidGenerator.id_sequence;
  }

}