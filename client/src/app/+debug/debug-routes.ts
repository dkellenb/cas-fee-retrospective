import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DebugComponent} from './debug.component';
import {DebugUserServiceComponent} from './debug-user-service';
import {DebugRestrospectiveServiceComponent} from './debug-restrospective-service/debug-restrospective-service.component';

const debugRoutes: Routes = [
  {
    path: '', component: DebugComponent,
    children: [
      {path: ''}, // doesn't show any component
      {path: 'user-service', component: DebugUserServiceComponent},
      {path: 'retrospective-service', component: DebugRestrospectiveServiceComponent}
    ]
  }
];

export const debugRouting: ModuleWithProviders = RouterModule.forChild(debugRoutes);
