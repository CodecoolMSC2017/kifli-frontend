import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../model/user';
import { Subscription, Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { PasswordChangeData } from '../model/password-change-data';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  private user: User;
  private userCopy: User;
  private loginSub: Subscription;
  private errorMessage: string;
  private isOwnProfile: boolean;
  private editProfile: boolean;
  private changingPassword: boolean = false;
  private passwordChangeData: PasswordChangeData;
  private passwordChangeMessage: string;

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
    this.isOwnProfile = Number(id) === this.userService.getUserId();
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
    this.userService.showLogin(true);
    this.loginSub = this.userService.didLogin$.subscribe(
      () => this.ngOnInit()
    );
  }

  private edit(): void {
    if (!this.editProfile) {
      this.copyUser();
    }
    this.editProfile = !this.editProfile;
  }

  private copyUser(): void {
    this.userCopy = JSON.parse(JSON.stringify(this.user));
  }

  private changePassword(): void {
    if (this.checkPasswords()) {
      return;
    }
    this.userService.changePassword(this.passwordChangeData).pipe(
      catchError(err => this.onPasswordChangeError(err))
    ).subscribe(() => this.onPasswordChanged());
  }

  private checkPasswords(): boolean {
    if (!this.passwordChangeData.oldPassword || !this.passwordChangeData.oldPassword.trim()) {
      this.passwordChangeMessage = 'Old password can\'t be empty!';
      return true;
    }
    if (!this.passwordChangeData.newPassword || !this.passwordChangeData.newPassword.trim()) {
      this.passwordChangeMessage = 'New password can\'t be empty!';
      return true;
    }
    if (this.passwordChangeData.confirmationPassword !== this.passwordChangeData.newPassword) {
      this.passwordChangeMessage = 'Confirmation password does not match new password!';
      return true;
    }
    return false;
  }

  private onPasswordChanged(): void {
    this.passwordChangeMessage = 'Password changed!';
  }

  private onPasswordChangeError(err: XMLHttpRequest): Observable<any> {
    if (err.status >= 500) {
      this.passwordChangeMessage = err.status + ': server error';
    } else if (err.status === 400) {
      this.passwordChangeMessage = 'Incorrect password!';
    } else {
      this.passwordChangeMessage = err.status + ': error';
    }
    return of();
  }

  private onChangePasswordClicked(): void {
    this.passwordChangeData = new PasswordChangeData();
    this.passwordChangeMessage = undefined;
    this.changingPassword = true;
  }

  private saveProfile(): void {
    this.userService.updateUser(this.userCopy).pipe(
      catchError(err => this.onUpdateUserError(err))
    ).subscribe(user => this.onUserUpdated(user));
  }

  private onUserUpdated(user: User): void {
    this.userService.storeUser(user);
    this.user = user;
    this.editProfile = false;
  }

  private onUpdateUserError(err: XMLHttpRequest): Observable<any> {
    console.log(err);
    return of();
  }

}
