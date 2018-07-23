import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

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
    private userService: UserService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
  }

  login(): void {
    this.authService.getAuth(this.accountName, this.password).pipe(
      catchError(err => this.onLoginError(err))
    ).subscribe(user => this.onLoginResponse(user));
  }

  private onLoginResponse(user) {
    console.log(user);
    localStorage.setItem('user', user);
    this.router.navigate(['/']);
  }

  private onLoginError(err): Observable<any> {
    if (err.status >= 500) {
      this.errorMessage = 'Server error';
    } else if (err.status === 401) {
      this.password = '';
      this.errorMessage = 'Invalid username or password!';
    }
    return of();
  }

}
