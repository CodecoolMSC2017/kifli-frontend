import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public accountName: string;
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
    this.authService.getAuth(this.accountName, this.password).pipe(
      catchError(err => this.onLoginError(err))
    ).subscribe(user => this.onLoginResponse(user));
  }

  private onLoginResponse(user) {
    localStorage.setItem('user', JSON.stringify(user));
    document.getElementById('id01').style.display='none';
    this.userService.modifyLogOption('Logout');
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
    document.getElementById('id01').style.display='none';
    document.getElementById('id02').style.display='block';
  }
}