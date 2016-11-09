import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'rsb-carousel-element',
  templateUrl: './carousel-element.component.html',
  styleUrls: ['./carousel-element.component.css']
})
export class CarouselElementComponent implements OnInit {

  private _order=0;
  private _absOrder=0;
  private _stepSize =0;
  private _scaleSize = 1;

  constructor() {
  }

  get order(): number {
    return this._order;
  }

  @Input()
  set order(value) {
    this._order = value;
    this._absOrder = Math.abs(value);
  }

  get stepSize(): number {
    return this._stepSize;
  }

  @Input()
  set stepSize(value) {
    this._stepSize = value;
    this._scaleSize = value / 100;
  }

  public get leftPostion(): number {
    return (this._order * this._stepSize) + 50;
  }

  public get zIndex(): number {
    return 1000 - this._absOrder;
  };

  public get scale(): number {
    return 1 - (this._absOrder * this._scaleSize);
  };

  ngOnInit() {
  }

}
