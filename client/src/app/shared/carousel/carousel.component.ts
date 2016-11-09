import {Component, OnInit, ContentChildren, QueryList, AfterViewInit} from '@angular/core';
import {CarouselElementComponent} from './carousel-element/carousel-element.component';

@Component({
  selector: 'rsb-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, AfterViewInit {

  private range: number = 25;
  private topElement: number = 0;

  @ContentChildren(CarouselElementComponent)
  private carouselElements: QueryList<CarouselElementComponent>;

  constructor() {
    this.topElement = 0;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.updateCarouselElementPositions();
  }

  private updateCarouselElementPositions() {
    console.log('activeTopElement: ' + this.topElement);
    if (this.carouselElements.length <= 0) {
      return;
    }
    let stepSize = this.range / (this.carouselElements.length - 1);
    this.carouselElements.forEach(function (carouselElement: CarouselElementComponent, index: number) {
      carouselElement.order = index - this.topElement;
      carouselElement.stepSize = stepSize;
    }.bind(this));
  }

  public moveCarouselLeft(): void {
    if (this.topElement < (this.carouselElements.length - 1)) {
      this.topElement++;
    }
    this.updateCarouselElementPositions();
  }

  public moveCarouselRight(): void {
    if (this.topElement > 0) {
      this.topElement--;
    }
    this.updateCarouselElementPositions();
  }

}
