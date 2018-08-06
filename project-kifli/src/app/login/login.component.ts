import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UserService } from '../user.service';
import { User } from '../model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public userName: string;
  public password: string;
  public errorMessage: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
  }

  login(): void {
    this.authService.getAuth(this.userName, this.password).pipe(
      catchError(err => this.onLoginError(err))
    ).subscribe(user => this.onLoginResponse(user));
  }

  private onLoginResponse(user: User) {
    this.userService.storeUser(user);
    document.getElementById('login-container').style.display='none';
    this.userService.modifyLogOption(true);
    this.userService.didLogin();
  }

  private onLoginError(err): Observable<any> {
    if (err.status >= 500) {
      this.errorMessage = 'Server error, try again later!';
    } else if (err.status === 401) {
      this.password = '';
      this.errorMessage = 'Invalid username or password!';
    }
    return of();
  }

  private regStyle() {
    document.getElementById('login-container').style.display='none';
    document.getElementById('register-container').style.display='block';
  }
}