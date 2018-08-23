import { Injectable, NgZone } from '@angular/core';
import * as _ from 'lodash';
import { GoogleAuthService } from "ng-gapi";
import GoogleUser = gapi.auth2.GoogleUser;
import GoogleAuth = gapi.auth2.GoogleAuth;

import { Subject, Observable, of, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './model/user';
import { PasswordChangeData } from './model/password-change-data';

const URL = '/api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //public static readonly SESSION_STORAGE_KEY: string = "accessToken";
  //private gUser: GoogleUser = undefined;

  private logOptionSub = new Subject<string>();
  public logOption$ = this.logOptionSub.asObservable();

  private showLoginSub = new Subject<boolean>();
  public showLogin$ = this.showLoginSub.asObservable();

  private didLoginSub = new Subject<void>();
  public didLogin$ = this.didLoginSub.asObservable();

  private didLogoutSub = new Subject<void>();
  public didLogout$ = this.didLogoutSub.asObservable();

  private showRegisterSub = new Subject<boolean>();
  public showRegister$ = this.showRegisterSub.asObservable();

  private didRegisterSub = new Subject<void>();
  public didRegister$ = this.didRegisterSub.asObservable();

  constructor(
    private http: HttpClient,
    private googleAuthService: GoogleAuthService,
    private ngZone: NgZone
  ) { }

  public register(
      userName: string,
      email: string,
      password: string,
      confirmPassword: string,
      firstName: string,
      lastName: string
    ): Observable<User> {
    const data = {
      'userName': userName,
      'email': email,
      'password': password,
      'confirmPassword': confirmPassword,
      'firstName': firstName,
      'lastName': lastName
    };
    console.log(data);
    return this.http.post<User>(URL + 'register', data, httpOptions);
  }

  public getUsers(): Observable<any> {
    return this.http.get(URL + 'users');
  }

  public getUserId(): number {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      return Number(user.id);
    }
  }

  public isAdmin(): boolean {
    if (!localStorage.getItem('user')) {
      return false;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    return user.authorities.includes('ROLE_ADMIN');
  }

  public getUserById(id): Observable<any> {
    return this.http.get(URL + 'users/' + id);
  }

  public modifyLogOption(isLoggedIn: boolean): void {
    if (isLoggedIn) {
      this.logOptionSub.next('Logout');
    } else {
      this.logOptionSub.next('Login');
    }
  }

  public showLogin(show: boolean): void {
    this.showLoginSub.next(show);
  }

  public didLogin(): void {
    this.didLoginSub.next();
  }

  public didLogout(): void {
    this.didLogoutSub.next();
  }

  public showRegister(show: boolean): void {
    this.showRegisterSub.next(show);
  }

  public didRegister(): void {
    this.didRegisterSub.next();
  }

  public isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    if (user) {
      return true;
    }
    return false;
  }

  public changePassword(passwordChangeData: PasswordChangeData): Observable<any> {
    return this.http.post('api/users/change-password', passwordChangeData);
  }

  public getLoggedInUser(): Observable<User> {
    return this.http.get<User>('/api/users/current');
  }

  public storeUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public deleteUser(): void {
    localStorage.removeItem('user');
  }

  /*public setGoogleUser(gUser: GoogleUser): void {
    this.gUser = gUser;
  }

  public getCurrentUser(): GoogleUser {
    return this.gUser;
  }

  public getToken(): string {
    let token: string = sessionStorage.getItem(UserService.SESSION_STORAGE_KEY);

    if (!token) {
      throw new Error("no token set , authentication required");
    }
    return sessionStorage.getItem(UserService.SESSION_STORAGE_KEY);
  }

  public signIn() {
    this.googleAuthService.getAuth().subscribe((auth) => {
      auth.signIn().then(res => this.signInSuccessHandler(res),
      err => this.signInErrorHandler(err));
    });
  }

  public signOut(): void {
    this.googleAuthService.getAuth().subscribe((auth) => {
      try {
        auth.signOut();
      } catch (e) {
        console.error(e);
      }
      sessionStorage.removeItem(UserService.SESSION_STORAGE_KEY)
    });
  }

  public isUserSignedIn(): boolean {
    return !_.isEmpty(sessionStorage.getItem(UserService.SESSION_STORAGE_KEY));
  }

  private signInSuccessHandler(res: GoogleUser) {
    this.ngZone.run(() => {
      this.gUser = res;
      sessionStorage.setItem(UserService.SESSION_STORAGE_KEY, res.getAuthResponse().access_token);
    });
  }

  private signInErrorHandler(err) {
    console.warn(err);
  }*/
  
  public getStoredUser(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  public updateUser(user: User): Observable<User> {
    return this.http.put<User>('/api/users', user);
  }
}
