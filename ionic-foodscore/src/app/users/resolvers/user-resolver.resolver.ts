import { inject } from "@angular/core";
import { ResolveFn, Router } from "@angular/router";
import { catchError, EMPTY } from "rxjs";
import { User } from "src/app/auth/interfaces/user.interface";
import { UsersService } from "../services/user-service.service";

export const userResolver: ResolveFn<User> = (route) => {
  return inject(UsersService)
    .getUser(+route.params['id'])
    .pipe(
      catchError(() => {
        inject(Router).navigate(['/login']);
        return EMPTY;
      })
    );
};
