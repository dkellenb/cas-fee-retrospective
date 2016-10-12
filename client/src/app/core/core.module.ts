import {NgModule, SkipSelf, Optional} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreComponent} from './core.component';
import {throwIfAlreadyLoaded} from "./module-import-guard";
import {SharedModule} from "./../shared";
import { JoinSessionComponent } from './join-session/join-session.component';
import { CreateSessionComponent } from './create-session/create-session.component'

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [CoreComponent, JoinSessionComponent, CreateSessionComponent],
  exports: [CoreComponent]
})
export class CoreModule {



  constructor(@Optional() @SkipSelf() parentModule:CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
