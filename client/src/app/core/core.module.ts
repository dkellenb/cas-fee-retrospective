import {NgModule, SkipSelf, Optional} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreComponent} from './core.component';
import {throwIfAlreadyLoaded} from "./module-import-guard";
import {SharedModule} from "./../shared";
import {JoinSessionComponent} from './join-session';
import {CreateSessionComponent} from './create-session';
import {InitialPageComponent} from './initial-page';
import {ReviewComponent} from './review';
import {CommentModule} from './comment';
import {VoteComponent} from './vote';
import {ClosedComponent} from './closed';
import {coreRouting} from './core-routes';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    coreRouting,
    CommentModule
  ],
  declarations: [CoreComponent,
    JoinSessionComponent,
    CreateSessionComponent,
    InitialPageComponent,
    ReviewComponent,
    VoteComponent,
    ClosedComponent],
  exports: [CoreComponent]
})
export class CoreModule {


  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
