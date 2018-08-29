import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
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

  private gapiSub: Subscription;

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
    private gapiService: GoogleApiService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.gapiSub = this.gapiService.onLoad().subscribe();
  }

  login(): void {
    this.authService.getAuth(this.userName, this.password).pipe(
      catchError(err => this.onLoginError(err))
    ).subscribe(user => this.onLoginResponse(user));
  }

  private onLoginResponse(user: User) {
    this.userService.storeUser(user);
    this.userService.showLogin(false);
    this.userService.modifyLogOption(true);
    this.userService.didLogin();
  }

  private onLoginError(err): Observable<any> {
    if (err.status >= 500) {
      this.errorMessage = 'Server error, try again later!';
    } else if (err.status === 401) {
      this.password = '';
      this.errorMessage = 'Invalid username or password!';
    } else {
      this.errorMessage = err.status + ': error :(';
    }
    return of();
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
    ).subscribe(user => this.ngZone.run(
      () => this.onLoginResponse(user)));
  }

  private hide(): void {
    this.userService.showLogin(false);
  }

  private showRegister(): void {
    this.userService.showLogin(false);
    this.userService.showRegister(true);
  }
}
