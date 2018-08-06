import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './model/user';

const URL = '/api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private logOptionSub = new Subject<string>();
  public logOption$ = this.logOptionSub.asObservable();

  private showLoginSub = new Subject<void>();
  public showLogin$ = this.showLoginSub.asObservable();

  private didLoginSub = new Subject<void>();
  public didLogin$ = this.didLoginSub.asObservable();

  constructor(
    private http: HttpClient
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

  public showLogin(): void {
    this.showLoginSub.next();
  }

  public didLogin(): void {
    this.didLoginSub.next();
  }

  public isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    if (user) {
      return true;
    }
    return false;
  }

  public changePassword(newPassword1Value): Observable<any>{
    return this.http.post(URL + 'users/change-password' , newPassword1Value);
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
}
