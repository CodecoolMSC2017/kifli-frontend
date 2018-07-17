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
    console.log(user);
    this.router.navigate(['/']);
  }

}
