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

  public userName: string;
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

  checkPasswordMatch(): void {
    if (this.password === this.confirmPassword) {
      this.passwordMessage = null;
    } else {
      this.passwordMessage = 'Passwords do not match!';
    }
  }

  register(): void {
    if (!this.userName
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
      this.userName,
      this.email,
      this.password,
      this.confirmPassword,
      this.firstName,
      this.lastName
    ).subscribe(user => this.onRegisterResponse(user));
  }

  private onRegisterResponse(user) {
    console.log(user);
    this.router.navigate(['/'])
  }

  private regStyle() {
    document.getElementById('register-container').style.display='none';
    document.getElementById('login-container').style.display='block';
    
  }
}
