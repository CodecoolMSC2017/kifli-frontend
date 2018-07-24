import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';

const URL = '/api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

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

  public isLoggedIn(): boolean {
    if (localStorage.getItem('user')) {
      return true;
    }
    return false;
  }

  public getUserById(id): Observable<any> {
    return this.http.get(URL + 'users/' + id);
  }
}
