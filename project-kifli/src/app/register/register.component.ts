import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public message: string;
  public passwordMessage: string;

  public accountName: string;
  public email: string;
  public password: string;
  public confirmPassword: string;
  public firstName: string;
  public lastName: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  checkPasswordMatch(): void {
    if (this.password === this.confirmPassword) {
      this.passwordMessage = null;
    } else {
      this.passwordMessage = 'Passwords do not match!';
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
    this.userService.register(
      this.accountName,
      this.email,
      this.password,
      this.firstName,
      this.lastName
    ).subscribe(user => console.log(user));
  }

}