import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(console.log);
  }

  logout(): void {
    this.userService.logout().subscribe(console.log);
  }

}
