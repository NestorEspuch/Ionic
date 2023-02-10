import { Injectable } from '@angular/core';
import { Observable, of, from, ReplaySubject, throwError } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { GoogleLogin, User } from '../interfaces/user.interface';
import { UserResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  logged = false;
  loginChange$ = new ReplaySubject<boolean>(1);

  constructor(private http: HttpClient) {}

  login(
    email: string,
    password: string,
    firebaseToken: string
  ): Observable<void> {
    return this.http
      .post<{ accessToken: string }>('auth/login', {
        email,
        password,
        firebaseToken,
      })
      .pipe(
        switchMap(async (r) => {
          try {
            await Preferences.set({ key: 'fs-token', value: r.accessToken });
            this.setLogged(true);
          } catch (e) {
            throw new Error("Can't save authentication token in storage!");
          }
        })
      );
  }

  getUser(id: number, me?: boolean) {
    if (me) {
      return this.http.get<UserResponse>(`auth/me`).pipe(
        map((r) => r.user),
        catchError((resp: HttpErrorResponse) =>
          throwError(
            () =>
              `Error getting your user. Status: ${resp.status}. Message: ${resp.message}`
          )
        )
      );
    } else {
      return this.http.get<UserResponse>(`auth/${id}`).pipe(
        map((r) => r.user),
        catchError((resp: HttpErrorResponse) =>
          throwError(
            () =>
              `Error getting user. Status: ${resp.status}. Message: ${resp.message}`
          )
        )
      );
    }
  }

  register(user: User): Observable<void> {
    return this.http.post<void>('auth/register', user);
  }

  async logout(): Promise<void> {
    await Preferences.remove({ key: 'fs-token' });
    this.setLogged(false);
  }

  isLogged(): Observable<boolean> {
    if (this.logged) {
      return of(true);
    }
    return from(Preferences.get({ key: 'fs-token' })).pipe(
      switchMap((token) => {
        if (!token.value) {
          throw new Error();
        }
        return this.http.get('auth/validate').pipe(
          map(() => {
            this.setLogged(true);
            return true;
          }),
          catchError((error) => of(false))
        );
      }),
      catchError((e) => of(false))
    );
  }

  loginGoogle(userLogin: GoogleLogin):Observable<void> {

    return this.http
      .post<{ accessToken: string }>('auth/google', {
        token: userLogin.authentication.idToken,
        lat: userLogin.lng,
        lng: userLogin.lat,
      })
      .pipe(
        switchMap(async (r) => {
          try {
            await Preferences.set({ key: 'fs-token', value: r.accessToken });
            this.setLogged(true);
          } catch (e) {
            throw new Error("Can't save authentication token in storage!");
          }
        })
      );
  }

  private setLogged(logged: boolean) {
    this.logged = logged;
    this.loginChange$.next(logged);
  }
}
