import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UserService } from '../user.service';
import { User } from '../model/user';
import { GoogleAuthService } from 'ng-gapi';
import { GoogleApiService } from 'ng-gapi';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public userName: string;
  public password: string;
  public errorMessage: string;
  
  /*public sheetId: string;
  public sheet: any;
  public soundSheet: any;*/

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private googleAuthService: GoogleAuthService,
    private gapiService: GoogleApiService
  ) {
    this.gapiService.onLoad().subscribe();
  }

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
    console.log(user);
  }

  private onLoginError(err): Observable<any> {
    if (err.status >= 500) {
      this.errorMessage = 'Server error, try again later!';
    } else if (err.status === 401) {
      this.password = '';
      this.errorMessage = 'Invalid username or password!';
    } else if (err.status === 404) {
      console.log('nem jóóóóóó');
    }
    return of();
  }

  private regStyle() {
    document.getElementById('login-container').style.display='none';
    document.getElementById('register-container').style.display='block';
  }

  /*public isLoggedIn(): boolean {
    return this.userService.isUserSignedIn();
  }*/

  /*public signIn() {
    this.googleAuthService.getAuth().subscribe((auth) => {
      if (auth.isSignedIn.get()) {
        console.log(auth.currentUser.get().getBasicProfile())
      } else {
        auth.signIn().then((response) => {
          console.log(response.getBasicProfile());
        })
      }
    })
  }*/

  public signIn() {
    this.authService.getGoogleAuth().pipe(
      catchError(err => this.onLoginError(err))
    ).subscribe(user => this.onLoginResponse(user));
  }
}