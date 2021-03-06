import {Injectable, NgZone} from '@angular/core';

@Injectable()
export class ScreenSizeService {

  private _screenWidth = window.innerWidth;
  private _screenHeight = window.innerHeight;

  constructor(ngZone: NgZone) {
    window.onresize = (e) => {
      ngZone.run(() => {
        this._screenWidth = window.innerWidth;
        this._screenHeight = window.innerHeight;
      });
    };
  }

  public get screenWidth() {
    return this._screenWidth;
  }


  public get isSmaleScreen(): boolean {
    return this._screenWidth < 900;
  }
}
