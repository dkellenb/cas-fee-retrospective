import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CarouselComponent} from './carousel.component';
import {CarouselElementComponent} from './carousel-element';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CarouselComponent, CarouselElementComponent],
  exports: [CarouselComponent, CarouselElementComponent]
})
export class CarouselModule {
}
