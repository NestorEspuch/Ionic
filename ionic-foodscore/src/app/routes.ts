import { Routes } from '@angular/router';
import { loginActivateGuard } from './guards/login-activate.guard';
import { logoutActivateGuard } from './guards/logout-activate.guard';
export const APP_ROUTES: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/routes').then((m) => m.AUTH_ROUTES),
    canActivate: [logoutActivateGuard],
  },
  {
    path: 'restaurants',
    loadChildren: () =>
      import('./restaurants/routes').then((m) => m.RESTAURANT_ROUTES),
    canActivate: [loginActivateGuard],
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./users/routes').then((m) => m.USER_ROUTES),
    canActivate: [loginActivateGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/auth/login',
  },
];
