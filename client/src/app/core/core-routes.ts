import {Routes, RouterModule} from '@angular/router';
import {CoreComponent} from './core.component';
import {InitialPageComponent} from './initial-page/initial-page.component';
import {ModuleWithProviders} from '@angular/core';
import {RetrospectiveComponent} from './retrospective/retrospective.component';

export const coreRoutes: Routes = [
  {
    path: '', component: CoreComponent,
    children: [
      {path: '', component: InitialPageComponent},
      {path: ':id', component: RetrospectiveComponent},
    ]
  }
];

export const coreRouting: ModuleWithProviders = RouterModule.forChild(coreRoutes);
