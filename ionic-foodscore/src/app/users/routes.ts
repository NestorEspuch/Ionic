import { Routes } from '@angular/router';
import { leavePageGuard } from '../guards/leave-page-guard.guard';
import { userResolver } from './resolvers/user-resolver.resolver';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user-details/user-details.component').then((m) => m.UserDetailsComponent),
  },
  {
    path: 'me',
    loadComponent: () =>
      import('./user-details/user-details.component').then(
        (m) => m.UserDetailsComponent
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./user-form/user-form.component').then(
        (m) => m.UserFormComponent
      ),
    canDeactivate: [leavePageGuard],
    resolve: { user: userResolver },
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./user-details/user-details.component').then(
        (m) => m.UserDetailsComponent
      ),
    canDeactivate: [leavePageGuard],
    resolve: { user: userResolver },
  },
];
