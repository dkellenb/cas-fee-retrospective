import {Directive, Renderer, ElementRef, DoCheck, OnDestroy, AfterViewInit} from '@angular/core';
import {SharedHeightService} from './shared-height.service';
import {Subscription} from 'rxjs';
import {SharedHeight} from './shared-height.class';

@Directive({
  selector: '[rsbSharedHeight]'
})
export class SharedHeightDirective implements DoCheck, OnDestroy, AfterViewInit {

  private _heightChangeSubscription: Subscription;
  private _sharedHeight: SharedHeight = new SharedHeight(0);
  private _minHeight = 0;
  private _height: number = 0;

  constructor(private el: ElementRef,
              private renderer: Renderer,
              private sharedHeightService: SharedHeightService) {

    this.sharedHeightService.registerHeight(this._sharedHeight);

    this._heightChangeSubscription = this.sharedHeightService.heightChange$.subscribe((newHeight: number) => {
      this.minHeight = newHeight;
      this.updateElement();
    });
  }

  ngAfterViewInit(): void {
  }


  ngDoCheck(): void {
    if (this._height !== this.height) {
      this._height = this.height;
      this._sharedHeight.height = this._height;
      this.sharedHeightService.fireHeightChangeEvent();
    }
  }

  ngOnDestroy(): void {
    if (this._heightChangeSubscription != null) {
      this._heightChangeSubscription.unsubscribe();
    }
    this.sharedHeightService.unregisterElement(this._sharedHeight);
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
      this._sharedHeight.height = 0;
      this._height = value;
    } else {
      this._minHeight = 0;
      this._sharedHeight.height = this.height;
    }
  }
}
