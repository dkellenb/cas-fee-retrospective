import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';

@Injectable()
export class SharedHeightService {

  private _heightChange$: Subject<number> = new Subject<number>();
  private _lastHightChange: number = 0;

  constructor() {
  }

  public fireHeightChangeEvent(value: number) {
    this._lastHightChange = value;
    this._heightChange$.next(value);
  }

  public get heightChange$(): Observable<number> {
    return this._heightChange$;
  }

  get lastHightChange(): number {
    return this._lastHightChange;
  }
}
