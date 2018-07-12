import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public userName: string;
  public password: string;

  constructor() { }

  ngOnInit() {
  }

  login(): void {
    console.log(this.userName);
    console.log(this.password);
  }

}
