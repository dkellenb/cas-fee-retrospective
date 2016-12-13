import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';

@Injectable()
export class SharedHeightService {

  private _heightChange$: Subject<number> = new Subject<number>();

  constructor() {
  }

  public fireHeightChangeEvent(value: number) {
    this._heightChange$.next(value);
  }

  public get heightChange$(): Observable<number> {
    return this._heightChange$;
  }
}
