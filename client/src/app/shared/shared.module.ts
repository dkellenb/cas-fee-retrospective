import {NgModule, ErrorHandler} from '@angular/core';

//Angular Modules
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {FormsModule}   from '@angular/forms';

//Shared
import {BoardComponent, BoardBody, BoardButtons, BoardTitle} from './board';
import {IconButtonComponent, IconButtonType} from './icon-button';
import {SplitBarComponent, SplitBarContainerRight, SplitBarContainerLeft} from './split-bar/';
import {HeaderBarComponent, HeaderBarTitle, HeaderBarMenu} from './header-bar/header-bar.component';
import {TextInputComponent} from './text-input/text-input.component';
import {ButtonSetComponent, ButtonSetElement} from './button-set';
import {ButtonSetTextComponent} from './button-set-text';
import {FormComponent, FormBody, FormSubmit,FormSetElement} from './form';
import {ConfigurationService,RetrospectiveService,UserService,AuthenticationService} from './services';
import { StickyNoteComponent } from './sticky-note/sticky-note.component';
import { GalleryComponent } from './gallery/gallery.component';

@NgModule({
  declarations: [BoardComponent, BoardBody, BoardButtons, BoardTitle, IconButtonComponent,
    SplitBarComponent, SplitBarContainerLeft, SplitBarContainerRight,
    HeaderBarComponent, HeaderBarTitle, HeaderBarMenu,
    TextInputComponent,
    ButtonSetComponent, ButtonSetElement, ButtonSetTextComponent, ButtonSetTextComponent,
    FormComponent, FormBody, FormSubmit, FormSetElement, StickyNoteComponent, GalleryComponent],
  imports: [CommonModule, HttpModule, RouterModule, FormsModule],
  exports: [CommonModule, HttpModule, RouterModule, FormsModule,
    BoardComponent, BoardBody, BoardButtons, BoardTitle,
    IconButtonComponent,
    HeaderBarComponent, HeaderBarTitle, HeaderBarMenu,
    TextInputComponent,
    ButtonSetComponent, ButtonSetElement, ButtonSetTextComponent,
    FormComponent, FormBody, FormSubmit,FormSetElement,
    StickyNoteComponent, GalleryComponent
  ],
  providers: [ConfigurationService,RetrospectiveService,UserService, AuthenticationService]
})
export class SharedModule {
}
