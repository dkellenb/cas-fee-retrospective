import {NgModule} from '@angular/core';

// Angular Modules
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {FormsModule}   from '@angular/forms';

// Shared
import {BoardComponent, BoardBodyDirective, BoardButtonsDirective, BoardTitleDirective} from './board';
import {IconButtonComponent} from './icon-button';
import {SplitBarComponent, SplitBarContainerRightDirective, SplitBarContainerLeftDirective} from './split-bar/';
import {HeaderBarComponent, HeaderBarTitle, HeaderBarMenu} from './header-bar/header-bar.component';
import {TextInputComponent} from './text-input/text-input.component';
import {ButtonSetComponent, ButtonSetElement} from './button-set';
import {ButtonSetTextComponent} from './button-set-text';
import {FormComponent, FormBodyDirective, FormSubmitDirective, FormSetElementDirective} from './form';
import {ConfigurationService, RetrospectiveService, UserService, AuthenticationService} from './services';
import {StickyNoteComponent} from './sticky-note/sticky-note.component';
import {GalleryComponent, GalleryElementComponent} from './gallery';
import {CarouselModule} from './carousel';
import {StickyNoteService} from './services/sticky-note.service';
import {UserStatusComponent} from './user-status/user-status.component';

@NgModule({
  declarations: [BoardComponent, BoardBodyDirective, BoardButtonsDirective, BoardTitleDirective, IconButtonComponent,
    SplitBarComponent, SplitBarContainerLeftDirective, SplitBarContainerRightDirective,
    HeaderBarComponent, HeaderBarTitle, HeaderBarMenu,
    TextInputComponent,
    ButtonSetComponent, ButtonSetElement, ButtonSetTextComponent, ButtonSetTextComponent,
    FormComponent, FormBodyDirective, FormSubmitDirective, FormSetElementDirective, StickyNoteComponent, GalleryComponent, GalleryElementComponent,
    UserStatusComponent],
  imports: [CommonModule, HttpModule, RouterModule, FormsModule, CarouselModule],
  exports: [CommonModule, HttpModule, RouterModule, FormsModule,
    BoardComponent, BoardBodyDirective, BoardButtonsDirective, BoardTitleDirective,
    IconButtonComponent,
    HeaderBarComponent, HeaderBarTitle, HeaderBarMenu,
    TextInputComponent,
    ButtonSetComponent, ButtonSetElement, ButtonSetTextComponent,
    FormComponent, FormBodyDirective, FormSubmitDirective, FormSetElementDirective,
    StickyNoteComponent, GalleryComponent, GalleryElementComponent, CarouselModule,
    UserStatusComponent
  ],
  providers: [ConfigurationService, RetrospectiveService, UserService, AuthenticationService, StickyNoteService]
})
export class SharedModule {
}
