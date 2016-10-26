import {Routes, RouterModule} from '@angular/router';
import {CoreComponent} from './core.component';
import {InitialPageComponent} from './initial-page/initial-page.component';
import {CommentComponent} from './comment/comment.component';
import {ReviewComponent} from './review/review.component';
import {VoteComponent} from './vote/vote.component';
import {ClosedComponent} from './closed/closed.component';
import {ModuleWithProviders} from '@angular/core';

export const coreRoutes: Routes = [
  {
    path: '', component: CoreComponent,
    children: [
      {path: '', component: InitialPageComponent}, //doesn't show any component
      {path: 'comment', component: CommentComponent},
      {path: 'review', component: ReviewComponent},
      {path: 'vote', component: VoteComponent},
      {path: 'closed', component: ClosedComponent}
    ]
  }
];

export const coreRouting: ModuleWithProviders = RouterModule.forChild(coreRoutes);
