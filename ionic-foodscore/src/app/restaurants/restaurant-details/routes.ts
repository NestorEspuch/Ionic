import { Routes } from '@angular/router';

export const RESTAURANT_DETAIL_ROUTES: Routes = [
  {
    path: 'info',
    loadComponent: () =>
      import('./restaurant-info/restaurant-info.component').then(
        (m) => m.RestaurantInfoComponent
      ),
  },
  {
    path: 'comments',
    loadComponent: () =>
      import('./restaurant-comments/restaurant-comments.component').then(
        (m) => m.RestaurantCommentsComponent
      ),
  },
  {
    path: 'location',
    loadComponent: () =>
      import('./restaurant-location/restaurant-location.component').then(
        (m) => m.RestaurantLocationComponent
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'info',
  },
];
