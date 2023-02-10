import { inject } from "@angular/core";
import { ResolveFn, Router } from "@angular/router";
import { catchError, EMPTY } from "rxjs";
import { Restaurant } from "../interfaces/restaurant";
import { RestaurantsService } from "../services/restaurant-service.service";

export const restaurantResolver: ResolveFn<Restaurant> = (route) => {
  return inject(RestaurantsService)
    .getRestaurant(+route.params['id'])
    .pipe(
      catchError(() => {
        inject(Router).navigate(['/restaurants']);
        return EMPTY;
      })
    );
};
