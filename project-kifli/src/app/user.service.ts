import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';
import { catchError } from 'rxjs/operators';

const URL = '/api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public login(accountName: string, password: string): Observable<any> {
    const data = {'accountName': accountName, 'password': password};
    return this.http.post(URL + 'login', data, httpOptions)
      .pipe(
        catchError(this.onLoginError)
      );
  }

  private onLoginError(): Observable<any> {
    return of({id: -1});
  }

  public logout(): Observable<any> {
    return this.http.delete(URL + 'logout');
  }

  public register(
      accountName: string,
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ): Observable<User> {
    const data = {
      'accountName': accountName,
      'email': email,
      'password': password,
      'firstName': firstName,
      'lastName': lastName
    };
    console.log(data);
    return this.http.post<User>(URL + 'register', data, httpOptions);
  }

  public getUsers(): Observable<any> {
    return this.http.get(URL + 'users');
  }
}
