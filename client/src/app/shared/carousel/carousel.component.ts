import {Component, OnInit, ContentChildren, QueryList, AfterViewInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CarouselElementDirective} from './carousel-element.directive';
import {Subject} from 'rxjs';
import {calcPossibleSecurityContexts} from '@angular/compiler/src/template_parser/binding_parser';

@Component({
  selector: 'rsb-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, AfterViewInit, OnChanges {

  private topElement: number = 0;

  // witch which

  private carouselElementHasBeenClicked$: Subject<number> = new Subject<number>();

  @ContentChildren(CarouselElementDirective)
  private carouselElements: QueryList<CarouselElementDirective>;

  @Input()
  public range: number = 25;

  @Input()
  private carouselActive: boolean = true;

  // noinspection JSUnusedLocalSymbols
  @Input()
  private fixedNavButtons: boolean = false;

  constructor() {
    this.topElement = 0;

    this.carouselElementHasBeenClicked$.subscribe((offset: number) => {
      this.topElement = this.topElement + offset;
      this.updateCarouselElementPositions();
    });
  }

  public ngOnInit() {
  }

  public ngOnChanges(changes: SimpleChanges) {
    console.log(this.isCarouselActive + ' elements: ' + this.getNumberOfElements());
    this.updateCarouselElementPositions();
  }

  public ngAfterViewInit(): void {
    this.updateCarouselElementPositions();
    this.carouselElements.changes.subscribe(() => {
        // if last element was removed and was top element set to next last element the top element.
        if (this.getNumberOfElements() <= this.topElement) {
          this.topElement = (this.getNumberOfElements() - 1);
        }
        this.updateCarouselElementPositions();
      }
    );
  }

  public moveCarouselToPosition(position: number) {
    this.topElement = position;
    this.updateCarouselElementPositions();
  }

  private updateCarouselElementPositions() {
    if (this.getNumberOfElements() <= 0) {
      return;
    }

    let stepSize = this.calcStepSize(this.getNumberOfElements());
    this.carouselElements.forEach(function (carouselElement: CarouselElementDirective, index: number) {
      carouselElement.order = index - this.topElement;
      carouselElement.stepSize = stepSize;
      carouselElement.isCarouselActive = this.isCarouselActive;
      carouselElement.isTopElement = (index === this.topElement);
      carouselElement.updateElement();
      carouselElement.hasBeenClicked$ = this.carouselElementHasBeenClicked$;
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
