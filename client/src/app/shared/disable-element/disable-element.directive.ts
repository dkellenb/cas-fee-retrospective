import {Directive, Renderer, ElementRef, OnDestroy, Inject, OnInit, ReflectiveInjector, ResolvedReflectiveProvider, Optional} from '@angular/core';
import {DisableService} from './disable.service';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[rsbDisableElement]'
})
/**
 * Disable a Element if it is not on top of the carousel.
 */
export class DisableElementDirective implements OnDestroy, OnInit {
  private _subscrition: Subscription;

  constructor(private el: ElementRef, private renderer: Renderer, @Optional() private disableService: DisableService) {
  }

  ngOnInit(): void {
    if (this.disableService != null) {
      this._subscrition = this.disableService.hasBeenDisabled$.subscribe(this.setDisabled.bind(this));
    }
  }

  private setDisabled(value: boolean) {
    console.log('was called');
    if (value) {
      this.el.nativeElement.setAttribute('disabled', '');
    } else {
      this.el.nativeElement.removeAttribute('disabled');
    }
  }

  public ngOnDestroy(): void {
    if (this._subscrition != null) {
      this._subscrition.unsubscribe();
    }
  }
}
