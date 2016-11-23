import {NgModule, SkipSelf, Optional} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreComponent} from './core.component';
import {throwIfAlreadyLoaded} from './module-import-guard';
import {SharedModule} from './../shared';
import {coreRouting} from './core-routes';
import {RetrospectiveModule} from './retrospective/retrospective.module';
import {InitialPageModule} from './initial-page';
import {RetrospectiveService, UserService, WebSocketService} from './services';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RetrospectiveModule,
    InitialPageModule,
    coreRouting,
  ],
  declarations: [CoreComponent],
  exports: [CoreComponent],
  providers: [RetrospectiveService, WebSocketService, UserService]
})
export class CoreModule {


  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
