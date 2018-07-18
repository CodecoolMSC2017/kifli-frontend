import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public message: string;
  public passwordMessage: string;
  public emailMessage: string;
  public accountMessage: string;

  public accountName: string;
  public email: string;
  public password: string;
  public confirmPassword: string;
  public firstName: string;
  public lastName: string;

  constructor(
    private userService: UserService,
    private router: Router) { }

  ngOnInit() {
  }

  checkAccountnameSpace(): void {
    if (this.accountName.includes(" ")) {
      this.accountMessage = 'Invalid account name!';
    } else {
      this.accountMessage = null;
    }
  }

  checkPasswordMatch(): void {
    if (this.password === this.confirmPassword) {
      this.passwordMessage = null;
      if (this.password != this.password.toLowerCase()) {
        this.passwordMessage = null;
        if (this.password.match(/\d+/g)) {
          this.passwordMessage = null;
        } else {
          this.passwordMessage = 'Password should contain a number!';
        }
      } else {
        this.passwordMessage = 'Password should contain a capital letter!';
      }
    } else {
      this.passwordMessage = 'Password not match!';
    }
  }

  checkValidEmail(): void {
    if (this.email.includes("@")) {
      this.emailMessage = null;
    } else {
      this.emailMessage = 'Invalid e-mail(missing @)';
    }
  }

  

  register(): void {
    if (!this.accountName
      || !this.email
      || !this.password
      || !this.confirmPassword
      || !this.firstName
      || !this.lastName) {
        this.message = 'Please fill all fields!';
        return;
    }
    if (this.passwordMessage) {
      return;
    }
    if (this.emailMessage) {
      return;
    }
    this.userService.register(
      this.accountName,
      this.email,
      this.password,
      this.firstName,
      this.lastName
    ).subscribe(user => this.onRegisterResponse(user));
  }

  private onRegisterResponse(user) {
    console.log(user);
    this.router.navigate(['/'])
  }

}
