import {NgModule, ErrorHandler} from '@angular/core';

//Angular Modules
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {FormsModule}   from '@angular/forms';

//Shared
import {BoardComponent, BoardBody, BoardButtons, BoardTitle} from './board';
import {IconButtonComponent} from './icon-button';
import {SplitBarComponent, SplitBarContainerRight, SplitBarContainerLeft} from './split-bar/';
import {HeaderBarComponent, HeaderBarTitle, HeaderBarMenu} from './header-bar/header-bar.component';
import {TextInputComponent} from './text-input/text-input.component';
import {ButtonSetComponent, ButtonSetElement} from './button-set';
import {ButtonSetTextComponent} from './button-set-text';
import {FormComponent, FormBody, FormSubmit, FormSetElement} from './form';
import {ConfigurationService, RetrospectiveService, UserService, AuthenticationService} from './services';
import {StickyNoteComponent} from './sticky-note/sticky-note.component';
import {GalleryComponent, GalleryElementComponent} from './gallery';
import {CarouselModule} from './carousel';
import {StickyNoteService} from './services/sticky-note.service';
import { UserStatusComponent } from './user-status/user-status.component';

@NgModule({
  declarations: [BoardComponent, BoardBody, BoardButtons, BoardTitle, IconButtonComponent,
    SplitBarComponent, SplitBarContainerLeft, SplitBarContainerRight,
    HeaderBarComponent, HeaderBarTitle, HeaderBarMenu,
    TextInputComponent,
    ButtonSetComponent, ButtonSetElement, ButtonSetTextComponent, ButtonSetTextComponent,
    FormComponent, FormBody, FormSubmit, FormSetElement, StickyNoteComponent, GalleryComponent, GalleryElementComponent, UserStatusComponent],
  imports: [CommonModule, HttpModule, RouterModule, FormsModule, CarouselModule],
  exports: [CommonModule, HttpModule, RouterModule, FormsModule,
    BoardComponent, BoardBody, BoardButtons, BoardTitle,
    IconButtonComponent,
    HeaderBarComponent, HeaderBarTitle, HeaderBarMenu,
    TextInputComponent,
    ButtonSetComponent, ButtonSetElement, ButtonSetTextComponent,
    FormComponent, FormBody, FormSubmit, FormSetElement,
    StickyNoteComponent, GalleryComponent, GalleryElementComponent, CarouselModule,
    UserStatusComponent
  ],
  providers: [ConfigurationService, RetrospectiveService, UserService, AuthenticationService, StickyNoteService]
})
export class SharedModule {
}
