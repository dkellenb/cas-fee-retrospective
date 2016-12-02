import {
  Directive, Renderer, ElementRef, OnChanges, EventEmitter, ViewChild, ViewChildren,
  ContentChildren
} from '@angular/core';
import {Subject} from "rxjs";
import {CarouselDisableElementDirective} from "./carousel-disable-element.directive";

@Directive({
  selector: '[rsbCarouselElement]'
})
export class CarouselElementDirective {


  @ContentChildren(CarouselDisableElementDirective)
  disableElements: CarouselDisableElementDirective[];

  private _order = 0;
  private _absOrder = 0;
  private _stepSize = 0;
  private _scaleSize = 1;
  private _isActive = true;
  private _isTopElement = false;

  public hasBeenClicked$: Subject<number>;

  constructor(private el: ElementRef, private renderer: Renderer) {
    renderer.listen(el.nativeElement, 'click', (event) => {
      if (!this.isTopElement && this.hasBeenClicked$ != null) {
        this.hasBeenClicked$.next(this._order);
      }
    })
  }

  public updateElement(): void {
    if (this._isActive) {
      this.renderer.setElementStyle(this.el.nativeElement, 'left', this.leftPostion + '%');
      this.renderer.setElementStyle(this.el.nativeElement, 'z-index', '' + this.zIndex);
      this.renderer.setElementStyle(this.el.nativeElement, 'transform', 'translate(-50%, 0) scale(' + this.scale + ')');
      this.renderer.setElementStyle(this.el.nativeElement, 'position', 'absolute');
      this.renderer.setElementStyle(this.el.nativeElement, 'transition', 'transform 0.5s, left 0.5s');
    } else {
      this.el.nativeElement.style = '';
    }
    console.log('possible disable: ' + (this.disableElements ? this.disableElements.length : 'none'));
  }

  public set isCarouselActive(active: boolean) {
    this._isActive = active;
  }

  public set order(value) {
    this._order = value;
    this._absOrder = Math.abs(value);
  }

  public set stepSize(value) {
    this._stepSize = value;
    this._scaleSize = value / 100;
  }

  private get leftPostion(): number {
    return (this._order * this._stepSize) + 50;
  }

  private get zIndex(): number {
    return 1000 - this._absOrder;
  }

  private get scale(): number {
    return 1 - (this._absOrder * this._scaleSize);
  }

  get isTopElement(): boolean {
    return this._isTopElement;
  }

  set isTopElement(value: boolean) {
    this._isTopElement = value;
  }
}
