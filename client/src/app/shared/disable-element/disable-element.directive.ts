import {Directive, Renderer, ElementRef, OnDestroy} from '@angular/core';
import {DisableService} from './disable.service';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[rsbDisableElement]'
})
/**
 * Disable a Element if it is not on top of the carousel.
 */
export class DisableElementDirective implements OnDestroy {
  private _isDisabled: boolean;


  private _subscrition: Subscription;

  constructor(private el: ElementRef, private renderer: Renderer, disableService: DisableService) {
    if (disableService != null) {
      this._subscrition = disableService.hasBeenDisabled$.subscribe(this.setDisabled.bind(this));
    }
  }

  private setDisabled(value: boolean) {
    console.log('disabled:' + value);
    console.log(this.el);
    console.log(this.renderer);

    if (this.el != null) {
      this._isDisabled = value;
      if (this._isDisabled) {
        console.log('set disable');
        this.el.nativeElement.setAttribute('disabled', '');
      } else {
        this.el.nativeElement.removeAttribute('disabled');
      }
      this._isDisabled = value;
    }
  }

  public ngOnDestroy(): void {
    this._subscrition.unsubscribe();
  }
}
