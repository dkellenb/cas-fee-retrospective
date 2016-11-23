import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CarouselComponent} from './carousel.component';
import {CarouselElementDirective} from './carousel-element.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CarouselComponent, CarouselElementDirective],
  exports: [CarouselComponent, CarouselElementDirective]
})
export class CarouselModule {
}
