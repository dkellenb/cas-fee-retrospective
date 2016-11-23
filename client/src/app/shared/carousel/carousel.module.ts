import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CarouselComponent} from './carousel.component';
import {CarouselElementComponent} from './carousel-element';
import { CarouselElementDirective } from './carousel-element.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CarouselComponent, CarouselElementComponent, CarouselElementDirective],
  exports: [CarouselComponent, CarouselElementComponent, CarouselElementDirective]
})
export class CarouselModule {
}
