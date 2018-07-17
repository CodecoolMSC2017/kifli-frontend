import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

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
    private router: Router) { }

  ngOnInit() {
  }

  login(): void {
    this.userService.login(this.accountName, this.password)
      .subscribe(user => this.onLoginResponse(user));
  }

  private onLoginResponse(user) {
    if (user.id > 0) {
      localStorage.setItem('user', user);
      this.router.navigate(['/']);
    } else {
      this.password = '';
      this.errorMessage = 'Invalid username or password!';
    }
  }

}
