import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public accountName: string;
  public password: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  login(): void {
    this.userService.login(this.accountName, this.password)
      .subscribe(user => console.log(user));
  }

}
