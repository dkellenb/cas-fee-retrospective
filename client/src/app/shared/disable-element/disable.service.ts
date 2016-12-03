import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class DisableService {

  public hasBeenDisabled$: Subject<boolean> = new Subject<boolean>();

  constructor() {
  }

  public disableSubElements(disable: boolean) {
    this.hasBeenDisabled$.next(disable);
  }
}
