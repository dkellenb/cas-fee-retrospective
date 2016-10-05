import {NgModule, SkipSelf, Optional} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreComponent} from './core.component';
import {throwIfAlreadyLoaded} from "./module-import-guard";
import {SharedModule} from "./../shared"

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [CoreComponent],
  exports: [CoreComponent]
})
export class CoreModule {

 

  constructor(@Optional() @SkipSelf() parentModule:CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
