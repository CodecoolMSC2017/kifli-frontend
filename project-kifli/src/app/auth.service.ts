import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './model/user';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

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

  public isLoggedIn(): boolean {
    if (localStorage.getItem('user')) {
      return true;
    }
    return false;
  }
}
