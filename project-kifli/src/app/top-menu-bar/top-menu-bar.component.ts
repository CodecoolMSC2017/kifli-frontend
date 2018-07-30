import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

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

    this.someWhereClickInLogin();
  }

  public auth(): void {
    if (this.logOption === 'Logout') {
      this.authService.deleteAuth().pipe(
        catchError(err => this.onLogoutError(err))
      ).subscribe(() => this.onLogoutResponse());
    } else if (this.logOption === 'Login') {
      document.getElementById('id02').style.display='none';
      document.getElementById('id01').style.display='block';
    }
  }

  private onLogoutError(err): Observable<any> {
    this.onLogoutResponse();
    return of();
  }

  private onLogoutResponse(): void {
    localStorage.removeItem('user');
    this.logOption = 'Login';
    this.router.navigate(['/']);
  }

  private someWhereClickInLogin() {
    // Get the modal
    const logModal = document.getElementById('id01');
    const regModal = document.getElementById('id02');

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == logModal) {         
          logModal.style.display='none';
        } else if(event.target == regModal) {
          regModal.style.display='none';
        }
    }
  }
}
