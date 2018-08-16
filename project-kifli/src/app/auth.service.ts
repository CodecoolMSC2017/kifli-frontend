import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './model/user';
import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GoogleAuthService } from "ng-gapi";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private googleAuthService: GoogleAuthService
  ) { }

  getAuth(username: string, password: string): Observable<User> {
    return this.http.get<User>('/api/auth', {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + window.btoa(username + ':' + password)
      })
    });
  }

  deleteAuth(): Observable<void> {
    return this.http.delete<void>('/api/auth').pipe(
      tap(() => localStorage.removeItem('user'))
    );
  }

  public getGoogleAuth(): Observable<User> {
    return this.googleAuthService.getAuth()
      .flatMap(googleAuth => from(googleAuth.signIn()))
      .flatMap(googleUser => {
        console.log(googleUser.getAuthResponse().id_token);
        return this.http.post<User>(URL + 'auth', {idToken: googleUser.getAuthResponse().id_token});
      });
  }

  public deleteGoogleAuth(): void {
    this.googleAuthService.getAuth().subscribe((auth) => {
      try {
        auth.signOut();
      } catch(e) {
        console.error(e);
      }
    });
  }
}
