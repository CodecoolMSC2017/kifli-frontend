import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../model/user';
import { Subscription, Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  private user: User;
  private loginSub: Subscription;
  private newPassword: String;
  private errorMessage: string;
  private response: string;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.errorMessage = 'Loading...';
    if (this.userService.isLoggedIn()) {
      this.getUser();
    } else {
      this.onNotLoggedIn();
    }
  }

  ngOnDestroy() {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }

  private getUser(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.userService.getUserById(id).pipe(
      catchError(err => this.onGetUserError(err))
    ).subscribe(user => this.onUserResponse(user));
  }

  private onUserResponse(user: User): void {
    this.errorMessage = undefined;
    this.user = user;
  }

  private onGetUserError(err: XMLHttpRequest): Observable<any> {
    if (err.status >= 500) {
      this.errorMessage = err.status + ': server error, try again later...';
    } else if (err.status === 401) {
      this.onNotLoggedIn();
    } else if (err.status === 404) {
      this.errorMessage = err.status + ': user not found!';
    } else {
      this.errorMessage = err.status + ': error loading page, try again later...';
    }
    return of();
  }

  private onNotLoggedIn(): void {
    this.errorMessage = 'You must login first!';
    this.userService.showLogin();
    this.loginSub = this.userService.didLogin$.subscribe(
      () => this.ngOnInit()
    );
  }

  private submit(oldPassword, newPassword1, newPassword2) {
    if(newPassword1.value === newPassword2.value) {  
    console.log("New PAss OK " + newPassword1.value);
    this.changePassword(oldPassword.value, newPassword1.value, newPassword2.value);
    } else {
      console.log("New pass not the same")
    }
  }

  private changePassword(oldPasswordValue, newPassword1Value1, newPassword1Value2) {
    const passwordJson: any = {};
    passwordJson.oldPassword = oldPasswordValue;
    passwordJson.newPassword = newPassword1Value1;
    passwordJson.confirmationPassword = newPassword1Value2;
    console.log("json password " + passwordJson)
    this.userService.changePassword(passwordJson).subscribe(response => {
      console.log(response)
      this.response = response.message;
    });
  }

}
