import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InitialPageComponent} from './initial-page.component';
import {JoinSessionComponent} from './join-session';
import {CreateSessionComponent} from './create-session';
import {SharedModule} from '../../shared';

@NgModule({
  imports: [
    CommonModule, SharedModule
  ],
  declarations: [InitialPageComponent, JoinSessionComponent, CreateSessionComponent]
})
export class InitialPageModule {
}
