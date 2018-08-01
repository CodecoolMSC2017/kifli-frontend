import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import { of, Observable, Subscription } from 'rxjs';
import { SearchService } from '../search.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-top-menu-bar',
  templateUrl: './top-menu-bar.component.html',
  styleUrls: ['./top-menu-bar.component.css']
})
export class TopMenuBarComponent implements OnInit {

  public logOption: string;
  public searchTitle: string;
  public subscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private searchService: SearchService,
    private userService: UserService
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.logOption = 'Logout';
    } else {
      this.logOption = 'Login';
    }

    this.someWhereClickInLogin();
    this.modifyLogOption();
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

  search() {
    if (this.searchTitle == null) {
      console.log("neeeeeeeeeem jjóóóóóóó");
    } else {
      console.log(this.searchTitle); 
      this.searchService.searchTitleApply(this.searchTitle);
    }
  }

  activateGetProduct() {
    this.searchService.getAllProductClick(true);
  }

  modifyLogOption(): void {
    this.subscription = this.userService.logOption$.subscribe(
      logOption => {
        this.logOption = logOption;
      }
    )
  }
}
