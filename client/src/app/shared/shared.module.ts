import {NgModule} from '@angular/core';

// Angular Modules
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {FormsModule}   from '@angular/forms';

// 3rd party
import {AUTH_PROVIDERS} from 'angular2-jwt';

// Shared
import {BoardComponent, BoardBodyDirective, BoardButtonsDirective, BoardTitleDirective} from './board';
import {IconButtonComponent} from './icon-button';
import {SplitBarComponent, SplitBarContainerRightDirective, SplitBarContainerLeftDirective} from './split-bar/';
import {HeaderBarComponent, HeaderBarTitleDirective, HeaderBarMenuDirective} from './header-bar';
import {TextInputComponent} from './text-input';
import {ButtonSetComponent, ButtonSetElementDirective} from './button-set';
import {FormComponent, FormBodyDirective, FormSubmitDirective, FormSetElementDirective} from './form';
import {ConfigurationService, AuthenticationService, ScreenSizeService} from './services';
import {CarouselModule} from './carousel';
import {UserStatusComponent} from './user-status';
import {NotificationMessageComponent} from './notifier/notification-message/notification-message.component';
import {NotifierComponent} from './notifier/notifier.component';
import {UserIconComponent} from './user-icon/user-icon.component';
import {BoardFooterDirective} from './board/board.component';
import {SharedHeightDirective} from './sharedHeight/shared-height.directive';
import {LinebreakTextComponent} from './linebreak-text/linebreak-text.component';
import {DisableElementDirective} from './disable-element/disable-element.directive';
import {NotifierModule} from './notifier/notifier.module';

@NgModule({
  declarations: [BoardComponent, BoardBodyDirective, BoardButtonsDirective, BoardTitleDirective, BoardFooterDirective,
    IconButtonComponent,
    SplitBarComponent, SplitBarContainerLeftDirective, SplitBarContainerRightDirective,
    HeaderBarComponent, HeaderBarTitleDirective, HeaderBarMenuDirective,
    TextInputComponent,
    ButtonSetComponent, ButtonSetElementDirective,
    FormComponent, FormBodyDirective, FormSubmitDirective, FormSetElementDirective,
    UserStatusComponent,
    UserIconComponent,
    SharedHeightDirective,
    LinebreakTextComponent, DisableElementDirective],
  imports: [CommonModule, HttpModule, RouterModule, FormsModule, CarouselModule, NotifierModule],
  exports: [CommonModule, HttpModule, RouterModule, FormsModule,
    BoardComponent, BoardBodyDirective, BoardButtonsDirective, BoardTitleDirective, BoardFooterDirective,
    IconButtonComponent,
    HeaderBarComponent, HeaderBarTitleDirective, HeaderBarMenuDirective,
    TextInputComponent,
    ButtonSetComponent, ButtonSetElementDirective,
    FormComponent, FormBodyDirective, FormSubmitDirective, FormSetElementDirective
    , CarouselModule,
    UserStatusComponent,
    SplitBarComponent, SplitBarContainerLeftDirective, SplitBarContainerRightDirective,
    NotifierModule,
    UserIconComponent, SharedHeightDirective, LinebreakTextComponent, DisableElementDirective
  ],
  providers: [
    ConfigurationService, AuthenticationService, ScreenSizeService, AUTH_PROVIDERS
  ]
})
export class SharedModule {
}
