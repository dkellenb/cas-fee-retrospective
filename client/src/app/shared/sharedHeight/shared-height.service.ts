import {Injectable, ElementRef} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {SharedHeight} from './shared-height.class';

@Injectable()
export class SharedHeightService {

  private _heightChange$: Subject<number> = new Subject<number>();
  private _currendHeight: number = 0;
  private elements: SharedHeight[] = [];

  constructor() {

  }

  public fireHeightChangeEvent() {
    this.updateCurrendHeight();
  }

  public registerHeight(height: SharedHeight) {
    this.elements.push(height);
  }

  public unregisterElement(height: SharedHeight) {
    let index = this.elements.indexOf(height);
    if (index > -1) {
      this.elements.slice(index, 1);
    }
  }

  public get heightChange$(): Observable<number> {
    return this._heightChange$;
  }

  public updateCurrendHeight(): void {
    this._currendHeight = Math.max.apply(Math, this.elements.map((sharedHeight: SharedHeight) => {
      return sharedHeight.height;
    }));
    this._heightChange$.next(this._currendHeight);
  }

  get currendHeight(): number {
    return this._currendHeight;
  }
}
