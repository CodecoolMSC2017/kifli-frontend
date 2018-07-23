import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

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
    console.log('logging in');
    this.authService.getAuth(this.accountName, this.password)
      .subscribe(user => this.onLoginResponse(user));
  }

  private onLoginResponse(user) {
    console.log(user);
    if (user.id > 0) {
      localStorage.setItem('user', user);
      this.router.navigate(['/']);
    } else {
      this.password = '';
      this.errorMessage = 'Invalid username or password!';
    }
  }

}
