import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public accountName: string;
  public password: string;
  public errorMessage: string;
  public logVisibility: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService) {}

  ngOnInit() {
    this.someWhereClick();
    this.visibility();
  }

  login(): void {
    this.authService.getAuth(this.accountName, this.password).pipe(
      catchError(err => this.onLoginError(err))
    ).subscribe(user => this.onLoginResponse(user));
  }

  private onLoginResponse(user) {
    localStorage.setItem('user', JSON.stringify(user));
    this.router.navigate(['/']);
  }

  private onLoginError(err): Observable<any> {
    if (err.status >= 500) {
      this.errorMessage = 'Server error, try again later!';
    } else if (err.status === 401) {
      this.password = '';
      this.errorMessage = 'Invalid username or password!';
    }
    return of();
  }

  someWhereClick() {
    // Get the modal
    const modal = document.getElementById('id01');
    const navigate = this.router;

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {         
            navigate.navigate(['/']);
        }    
    }
  }

  public visibility() {
    if (this.logVisibility) {
      document.getElementById('id01').style.display='block';
    } else {
      document.getElementById('id01').style.display='none';
    }
  }
}
