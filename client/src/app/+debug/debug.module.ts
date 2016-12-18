import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DebugComponent} from './debug.component';
import {SharedModule} from './../shared';
import {debugRouting} from './debug-routes';
import {DebugUserServiceComponent} from './debug-user-service';
import {DebugRestrospectiveServiceComponent} from './debug-restrospective-service';
import { SampleComponent } from './sample/sample.component';

@NgModule({
  imports: [
    CommonModule, SharedModule, debugRouting
  ],
  declarations: [DebugComponent, DebugUserServiceComponent, DebugRestrospectiveServiceComponent, SampleComponent],
  exports: [DebugComponent]
})
export class DebugModule {
}
