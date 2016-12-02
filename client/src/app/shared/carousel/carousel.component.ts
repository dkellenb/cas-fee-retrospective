import {Component, OnInit, ContentChildren, QueryList, AfterViewInit, Input, OnChanges, DoCheck} from '@angular/core';
import {CarouselElementDirective} from './carousel-element.directive';

@Component({
  selector: 'rsb-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, AfterViewInit, OnChanges, DoCheck {

  private range: number = 25;

  private topElement: number = 0;

  @ContentChildren(CarouselElementDirective)
  private carouselElements: QueryList<CarouselElementDirective>;

  @Input()
  private carouselActive: boolean = true;

  constructor() {
    this.topElement = 0;
  }

  public ngOnInit() {
  }

  public ngOnChanges() {
    this.updateCarouselElementPositions();
  }

  public ngDoCheck(): void {
  }

  public ngAfterViewInit(): void {
    this.updateCarouselElementPositions();
    this.carouselElements.changes.subscribe(() => {
        this.updateCarouselElementPositions();
      }
    );
  }

  public moveCarouselToPosition(position: number) {
    this.topElement = position;
  }

  private updateCarouselElementPositions() {
    if (this.getNumberOfElements() <= 0) {
      return;
    }
    if (this.getNumberOfElements() <= this.topElement) {
      this.topElement = (this.getNumberOfElements() - 1);
    }
    let stepSize = this.calcStepSize(this.getNumberOfElements());
    this.carouselElements.forEach(function (carouselElement: CarouselElementDirective, index: number) {
      carouselElement.order = index - this.topElement;
      carouselElement.stepSize = stepSize;
      carouselElement.isCarouselActive = this.isCarouselActive;
      carouselElement.isTopElement = (index == this.topElement);
      carouselElement.updateElement();
    }.bind(this));
  }

  private moveCarouselRight(): void {
    if (this.topElement < (this.getNumberOfElements() - 1)) {
      this.topElement++;
    }
    this.updateCarouselElementPositions();
  }

  private moveCarouselLeft(): void {
    if (this.topElement > 0) {
      this.topElement--;
    }
    this.updateCarouselElementPositions();
  }

  private showNavigationArrows(): boolean {
    return (this.getNumberOfElements() > 1)
      && this.carouselActive;
  }

  private getNumberOfElements(): number {
    return this.carouselElements ? this.carouselElements.length : 0;
  }

  public get isCarouselActive(): boolean {
    return this.carouselActive;
  }

  private calcStepSize(numberOfElements: number): number {
    if (numberOfElements < 2) {
      return this.range;
    }
    return this.range / (numberOfElements - 1);
  }

}
