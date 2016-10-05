import {NgModule, ErrorHandler} from '@angular/core';

//Angular Modules
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {FormsModule}   from '@angular/forms';

//Shared
import {BoardComponent, BoardBody, BoardButtons, BoardTitle} from './board';
import {IconButtonComponent} from './icon-button/icon-button.component';

@NgModule({
  declarations: [BoardComponent, BoardBody, BoardButtons, BoardTitle, IconButtonComponent],
  imports: [CommonModule, HttpModule, RouterModule, FormsModule],
  exports: [CommonModule, HttpModule, RouterModule, FormsModule, BoardComponent, BoardBody, BoardButtons, BoardTitle]
})
export class SharedModule {
}
