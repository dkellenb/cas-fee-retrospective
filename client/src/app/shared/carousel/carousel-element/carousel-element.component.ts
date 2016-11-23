import {Component, OnInit, Input, KeyValueDiffers} from '@angular/core';

@Component({
  selector: 'rsb-carousel-element',
  templateUrl: './carousel-element.component.html',
  styleUrls: ['./carousel-element.component.css']
})
export class CarouselElementComponent implements OnInit {

  private _order = 0;
  private _absOrder = 0;
  private _stepSize = 0;
  private _scaleSize = 1;
  private _isActive = true;

  constructor() {
  }

  @Input()
  public set isCarouselActive(active: boolean) {
    this._isActive = active;
  }

  @Input()
  public set order(value) {
    this._order = value;
    this._absOrder = Math.abs(value);
  }

  @Input()
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

  public get style(): any {
    if (this._isActive) {
      return {
        'left': this.leftPostion + '%',
        'z-index': this.zIndex,
        'transform': 'translate(-50%, 0) scale(' + this.scale + ')'
      };
    } else {
      return {};
    }
  }

  public get isCarouselActive() {
    return this._isActive;
  }

  ngOnInit() {
  }


}
