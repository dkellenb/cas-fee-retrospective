import {Directive, Renderer, ElementRef, DoCheck, OnDestroy} from '@angular/core';
import {SharedHeightService} from './shared-height.service';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[rsbSharedHeight]'
})
export class SharedHeightDirective implements DoCheck, OnDestroy {

  private _heightChangeSubscription: Subscription;
  private _minHeight = 0;
  private _height: number;

  constructor(private el: ElementRef,
              private renderer: Renderer,
              private sharedHeightService: SharedHeightService) {
    this._heightChangeSubscription = this.sharedHeightService.heightChange$.subscribe((newHeight: number) => {
      this.minHeight = newHeight;
      this.updateElement();
    });
  }

  ngDoCheck(): void {
    if (this._height !== this.el.nativeElement.offsetHeight) {
      this._height = this.el.nativeElement.offsetHeight;
      this.sharedHeightService.fireHeightChangeEvent(this._height);
    }
  }

  ngOnDestroy(): void {
    if (this._heightChangeSubscription != null) {
      this._heightChangeSubscription.unsubscribe();
    }
  }

  public get height(): number {
    return this.el.nativeElement.offsetHeight;
  }

  public updateElement(): void {
    this.renderer.setElementStyle(this.el.nativeElement, 'min-height', this._minHeight + 'px');
  }

  public set minHeight(value: number) {
    if (this.height < value) {
      this._minHeight = value;
      this._height = value;
    } else {
      this._minHeight = 0;
    }
  }
}
