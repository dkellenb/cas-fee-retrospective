import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotifierComponent} from './notifier.component';
import {NotificationMessageComponent} from './notification-message';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NotifierComponent, NotificationMessageComponent],
  exports: [NotifierComponent, NotificationMessageComponent]
})
export class NotifierModule {
}
