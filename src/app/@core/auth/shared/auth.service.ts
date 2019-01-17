import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, of } from 'rxjs';
import 'rxjs/add/operator/finally';
import { catchError, map } from 'rxjs/operators';
import { EnvironmentProviderService } from '../../data/environment-provider.service';
import { User } from '../../model';
import { SignUpCredentials } from '../sign-up/sign-up.component';
import { Credentials } from './../login/login.component';

const authUserStorage = ((key: string) => ({
  get: () => JSON.parse(localStorage.getItem(key)),
  set: (user: User) => localStorage.setItem(key, JSON.stringify(user)),
  remove: () => localStorage.removeItem(key)
}))('authUser');

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly isAuthenticatedSubject$ = new BehaviorSubject<boolean>(this.isAuthenticated());
  private readonly baseApiUrl: string;

  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject$.asObservable();

  helper = new JwtHelperService();

  get isAuth(): boolean {
    return this.isAuthenticated();
  }

  get isExp(): boolean {
    return this.isExpired();
  }

  get decToken() {
    return this.decodeToken();
  }

  constructor(private router: Router,
              private httpClient: HttpClient,
              environmentProviderService: EnvironmentProviderService) {
    this.baseApiUrl = environmentProviderService.current.apiBaseUri;
  }

  login(credentials: Credentials): Observable<boolean> {
    const { email, password } = credentials;
    return this.httpClient.post<User>(`${this.baseApiUrl}/login`, { user: { email, password } })
      .pipe(
        map(( authUser: User ) => {
          authUserStorage.set({...authUser});
          this.isAuthenticatedSubject$.next(true);
          this.router.navigate(['/']);

          return true;
        }),
        catchError(err => {
          return of(err);
        })

      );
  }

  logout(): void {
    this.httpClient.post(`${this.baseApiUrl}/logout`, {}).finally(() => {
      authUserStorage.remove();
      this.isAuthenticatedSubject$.next(false);
      this.router.navigate(['/auth/login']);
    }).subscribe();
  }

  signUp(credentials: SignUpCredentials): Observable<boolean> {
    return of(false);
  }

  activateAcc(token: string): Observable<boolean> {
    return of(false);
  }

  recoverAcc(email: string): Observable<boolean> {
    return of(true);
  }

  canChangePass(token: string): Observable<boolean> {
    return of(false);
  }

  changePass({ pass }): Observable<boolean> {
    return of(true);
  }

  getAuthorizationHeaderValue(): string | null {
    return `Bearer ${this.getToken()}`;
  }

  /**
   * This is a simple case scenario, we don't handle here token expiration, token renewal ect.
   * We are only checking if it exists
   * @returns {boolean}
   */
  private isAuthenticated(): boolean {
    return !!authUserStorage.get();
  }

  private isExpired(): boolean {
    return this.helper.isTokenExpired(this.getToken());
  }

  private decodeToken(): User {
    return this.helper.decodeToken(this.getToken());
  }

  private getToken(): string {
    const authObj = authUserStorage.get();
    return authObj ? authObj.user.token : '';
  }

}
