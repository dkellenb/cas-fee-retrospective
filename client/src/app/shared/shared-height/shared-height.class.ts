export class SharedHeight {
  private _height: number;

  constructor(height: number) {
    this._height = height;
  }

  public get height(): number {
    return this._height;
  }

  public set height(value: number) {
    this._height = value;
  }
}
