import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
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

  private logOptionSub = new Subject<string>();

  constructor(private http: HttpClient) { }

  logOption$ = this.logOptionSub.asObservable();

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

  public isLoggedIn(): boolean {
    if (localStorage.getItem('user')) {
      return true;
    }
    return false;
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

  modifyLogOption(logOption: string) {
    this.logOptionSub.next(logOption);
  }

  public changePassword(newPassword1Value): Observable<any>{
    console.log(newPassword1Value);
    this.http.post(URL + 'users/change-password' , newPassword1Value).subscribe(console.log);
   return this.http.post(URL + 'users/change-password' , newPassword1Value);
  }
}
