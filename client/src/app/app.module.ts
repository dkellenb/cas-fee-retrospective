import {BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {AppComponent} from './app.component';
import {CoreModule} from './core';
import {routing} from './app-routes';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
    // override hammerjs default configuration
    'pan': { threshold: 5 },
    'swipe': {
      velocity: 0.4,
      threshold: 20,
      direction: 31 // allow swipe in all direction
    }
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CoreModule,
    routing
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
