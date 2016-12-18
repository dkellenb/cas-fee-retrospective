import {Routes, RouterModule}   from '@angular/router';
import {CoreComponent} from './core';

declare let System: any; // will be transformed by webpack +2.0 to webpack_require

export const routes: Routes = [
  {path: '', component: CoreComponent},
  {
    path: '**',
    redirectTo: '404'
  }
];

export const routing = RouterModule.forRoot(routes);
