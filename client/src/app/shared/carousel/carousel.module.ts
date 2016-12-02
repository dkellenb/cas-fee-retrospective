import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CarouselComponent} from './carousel.component';
import {CarouselElementDirective} from './carousel-element.directive';
import { CarouselDisableElementDirective } from './carousel-disable-element.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CarouselComponent, CarouselElementDirective, CarouselDisableElementDirective],
  exports: [CarouselComponent, CarouselElementDirective, CarouselDisableElementDirective]
})
export class CarouselModule {
}
