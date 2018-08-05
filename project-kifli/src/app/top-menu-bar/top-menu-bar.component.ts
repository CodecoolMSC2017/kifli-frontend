import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import { of, Observable, Subscription } from 'rxjs';
import { SearchService } from '../search.service';
import { UserService } from '../user.service';
import { SearchParams } from '../model/searchParams';
import { User } from '../model/user';

@Component({
  selector: 'app-top-menu-bar',
  templateUrl: './top-menu-bar.component.html',
  styleUrls: ['./top-menu-bar.component.css']
})
export class TopMenuBarComponent implements OnInit, OnDestroy {

  public logOption: string = 'Login';
  public searchTitle: string;
  private logOptionSubscription: Subscription;
  private showLoginSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.doSubscriptions();
  }

  private doSubscriptions(): void {
    this.route.queryParams.subscribe(params => this.sendSearchRequest(params));
    this.subscribeToSearch();
    this.subscribeLogOption();
    this.subscribeShowLogin();

    this.someWhereClickInLogin();

    this.userService.getLoggedInUser().pipe(
      catchError(err => this.onGetUserError(err))
    ).subscribe(user => this.onGetUserResponse(user));
  }

  private subscribeShowLogin(): void {
    this.showLoginSubscription = this.userService.showLogin$.subscribe(
      () => this.showLogin()
    );
  }

  private onGetUserResponse(user: User): void {
    if (user) {
      this.userService.stroreUser(user);
      this.logOption = 'Logout';
    } else {
      this.userService.deleteUser();
    }
  }

  private onGetUserError(err): Observable<any> {
    if (err.status === 401) {
      this.userService.deleteUser();
      this.logOption = 'Login';
    }
    return of();
  }

  ngOnDestroy() {
    this.logOptionSubscription.unsubscribe();
    this.showLoginSubscription.unsubscribe();
  }

  private subscribeToSearch(): void {
    this.searchService.searchTitle$.subscribe(() => {
      this.searchTitle = this.searchService.getSearch()
    });
  }

  public auth(): void {
    if (this.logOption === 'Logout') {
      this.authService.deleteAuth().pipe(
        catchError(err => this.onLogoutError(err))
      ).subscribe(() => this.onLogoutResponse());
    } else if (this.logOption === 'Login') {
      this.showLogin();
    }
  }

  private showLogin(): void {
    document.getElementById('id02').style.display='none';
    document.getElementById('id01').style.display='block';
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
    this.searchService.setSearch(this.searchTitle);
    const searchParams: SearchParams = this.searchService.getSearchParams();
    this.router.navigate(['/'], {
      queryParams: this.searchService.removeUnchangedValues(searchParams)
    });
  }

  private sendSearchRequest(params) {
    this.searchService.updateFromUrlParams(params);
    this.searchService.pingSubscribers();
  }

  subscribeLogOption(): void {
    this.logOptionSubscription = this.userService.logOption$.subscribe(
      logOption => this.logOption = logOption
    )
  }
}
