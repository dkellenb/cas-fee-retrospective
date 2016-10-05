import { NgModule, ErrorHandler } from '@angular/core';

//Angular Modules
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';

//Shared
import { BoardComponent } from './board';

@NgModule({
  declarations:[BoardComponent],
    imports: [CommonModule, HttpModule, RouterModule, FormsModule],
    exports: [CommonModule, HttpModule, RouterModule, FormsModule, BoardComponent]
})
export class SharedModule { }
