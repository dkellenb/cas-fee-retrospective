import {Directive, Renderer, ElementRef} from '@angular/core';
import {NgIf} from "@angular/common";

@Directive({
  selector: '[rsbCarouselDisableElement]'
})
/**
 * Disable a Element if it is not on top of the carousel.
 */
export class CarouselDisableElementDirective {


  private _isDisabled: boolean;

  constructor(private el: ElementRef, private renderer: Renderer) {
  }

  get isDisabled(): boolean {
    return this._isDisabled;
  }

  set isDisabled(value: boolean) {
    this._isDisabled = value;
    if (this._isDisabled) {
      this.el.nativeElement.setAttribute('disabled');
    } else {
      this.el.nativeElement.removeAttribute('disabled');
    }
    this._isDisabled = value;
  }
}
