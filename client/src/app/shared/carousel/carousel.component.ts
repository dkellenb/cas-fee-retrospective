import {Component, OnInit, ContentChildren, QueryList, AfterViewInit, Input, OnChanges, AfterContentInit, NgZone, ChangeDetectorRef} from '@angular/core';
import {CarouselElementComponent} from './carousel-element/carousel-element.component';
import {CarouselElementDirective} from './carousel-element.directive';

@Component({
  selector: 'rsb-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, AfterViewInit, OnChanges {

  private range: number = 25;
  private topElement: number = 0;

  @ContentChildren(CarouselElementDirective)
  private carouselElements: QueryList<CarouselElementDirective>;

  @Input()
  private carouselActive: boolean = true;

  constructor() {
    this.topElement = 0;
  }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('Carousel aktive: ' + this.carouselActive);
    this.updateCarouselElementPositions();
  }

  ngAfterViewInit(): void {
    this.updateCarouselElementPositions();
    this.carouselElements.changes.subscribe(() => {
      this.updateCarouselElementPositions();
      }
    );
  }

  private updateCarouselElementPositions() {
    console.log('activeTopElement: ' + this.topElement);
    if (this.getNumberOfElements() <= 0) {
      console.log('no elements in carousel');
      return;
    }
    console.log('update Elements');
    let stepSize = this.range / (this.getNumberOfElements() - 1);
    this.carouselElements.forEach(function (carouselElement: CarouselElementDirective, index: number) {
      carouselElement.order = index - this.topElement;
      carouselElement.stepSize = stepSize;
      carouselElement.isCarouselActive = this.isCarouselActive;
      carouselElement.updateElement();
    }.bind(this));
  }

  public moveCarouselRight(): void {
    if (this.topElement < (this.getNumberOfElements() - 1)) {
      this.topElement++;
    }
    this.updateCarouselElementPositions();
  }

  public moveCarouselLeft(): void {
    if (this.topElement > 0) {
      this.topElement--;
    }
    this.updateCarouselElementPositions();
  }

  public showNavigationArrows(): boolean {
    return (this.getNumberOfElements() > 1)
      && this.carouselActive;
  }

  private getNumberOfElements(): number {
    return this.carouselElements ? this.carouselElements.length : 0;
  }

  public get isCarouselActive(): boolean {
    return this.carouselActive;
  }
}
