import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-top-menu-bar',
  templateUrl: './top-menu-bar.component.html',
  styleUrls: ['./top-menu-bar.component.css']
})
export class TopMenuBarComponent implements OnInit {

  public logOption: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.logOption = 'Logout';
    } else {
      this.logOption = 'Login';
    }
  }

  public auth(): void {
    if (this.logOption === 'Logout') {
      this.authService.deleteAuth().subscribe(resp => this.onLogoutResponse(resp));
    } else if (this.logOption === 'Login') {
      this.router.navigate(['/login']);
    }
  }

  private onLogoutResponse(response): void {
    if (response) {
      console.log(response);
      return;
    }
    this.logOption = 'Login';
    this.router.navigate(['/'])
  }

}
