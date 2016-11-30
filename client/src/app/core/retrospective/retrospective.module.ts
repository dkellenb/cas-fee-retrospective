import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RetrospectiveComponent} from './retrospective.component';
import {SharedModule} from '../../shared/shared.module';
import {RetrospectiveTopicBoardModule} from './retrospective-topic-board';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RetrospectiveTopicBoardModule
  ],
  exports: [RetrospectiveComponent],
  declarations: [RetrospectiveComponent]
})
export class RetrospectiveModule {
}
