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
import {HeaderBarComponent, HeaderBarTitleDirective, HeaderBarMenuDirective} from './header-bar/header-bar.component';
import {TextInputComponent} from './text-input/text-input.component';
import {ButtonSetComponent, ButtonSetElementDirective} from './button-set';
import {ButtonSetTextComponent} from './button-set-text';
import {FormComponent, FormBodyDirective, FormSubmitDirective, FormSetElementDirective} from './form';
import {ConfigurationService, AuthenticationService} from './services';
import {GalleryComponent, GalleryElementComponent} from './gallery';
import {CarouselModule} from './carousel';
import {StickyNoteService} from './services/sticky-note.service';
import {UserStatusComponent} from './user-status/user-status.component';
import {DisableService} from './disable-element/disable.service';

@NgModule({
  declarations: [BoardComponent, BoardBodyDirective, BoardButtonsDirective, BoardTitleDirective, IconButtonComponent,
    SplitBarComponent, SplitBarContainerLeftDirective, SplitBarContainerRightDirective,
    HeaderBarComponent, HeaderBarTitleDirective, HeaderBarMenuDirective,
    TextInputComponent,
    ButtonSetComponent, ButtonSetElementDirective, ButtonSetTextComponent, ButtonSetTextComponent,
    FormComponent, FormBodyDirective, FormSubmitDirective, FormSetElementDirective,
    GalleryComponent, GalleryElementComponent,
    UserStatusComponent],
  imports: [CommonModule, HttpModule, RouterModule, FormsModule, CarouselModule],
  exports: [CommonModule, HttpModule, RouterModule, FormsModule,
    BoardComponent, BoardBodyDirective, BoardButtonsDirective, BoardTitleDirective,
    IconButtonComponent,
    HeaderBarComponent, HeaderBarTitleDirective, HeaderBarMenuDirective,
    TextInputComponent,
    ButtonSetComponent, ButtonSetElementDirective, ButtonSetTextComponent,
    FormComponent, FormBodyDirective, FormSubmitDirective, FormSetElementDirective,
    GalleryComponent, GalleryElementComponent, CarouselModule,
    UserStatusComponent,
    SplitBarComponent, SplitBarContainerLeftDirective, SplitBarContainerRightDirective
  ],
  providers: [
    ConfigurationService, AuthenticationService, StickyNoteService, DisableService,
    AUTH_PROVIDERS
  ]
})
export class SharedModule {
}
