import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';

const URL = 'http://localhost:8080/';

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
    console.log(data);
    return this.http.post(URL + 'login', data, httpOptions);
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
}
