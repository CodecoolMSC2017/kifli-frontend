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

  private shouldShowLogin: boolean = false;
  private shouldShowRegister: boolean = false;

  private logOption: string = 'Login';
  private searchTitle: string;
  private message: string = 'Loading...';
  private logOptionSubscription: Subscription;
  private showLoginSubscription: Subscription;
  private showRegisterSubscription: Subscription;
  private loginSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.deleteUser();
    this.doSubscriptions();
  }

  ngOnDestroy() {
    this.logOptionSubscription.unsubscribe();
    this.showLoginSubscription.unsubscribe();
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }

  private doSubscriptions(): void {
    this.route.queryParams.subscribe(params => this.sendSearchRequest(params));
    this.subscribeToSearch();
    this.subscribeLogOption();
    this.subscribeShowLogin();
    this.subscribeShowRegister();

    this.userService.getLoggedInUser().pipe(
      catchError(err => this.onGetUserError(err))
    ).subscribe(user => this.onGetUserResponse(user));
  }

  private subscribeShowLogin(): void {
    this.showLoginSubscription = this.userService.showLogin$
      .subscribe(show => this.shouldShowLogin = show);
  }

  private subscribeShowRegister(): void {
    this.showRegisterSubscription = this.userService.showRegister$
      .subscribe(show => this.shouldShowRegister = show);
  }

  private onGetUserResponse(user: User): void {
    if (user) {
      this.userService.storeUser(user);
      this.userService.didLogin();
      this.logOption = 'Logout';
      this.shouldShowLogin = false;
    }
    this.message = null;
  }

  private onGetUserError(err): Observable<any> {
    if (err.status === 401) {
      this.userService.deleteUser();
      this.message = null;
      return of();
    } else {
      return this.onError(err);
    }
  }

  private subscribeToSearch(): void {
    this.searchService.searchTitle$.subscribe(() => {
      this.searchTitle = this.searchService.getSearch()
    });
  }

  private auth(): void {
    if (this.logOption === 'Logout') {
      this.authService.deleteAuth().pipe(
        catchError(err => this.onError(err))
      ).subscribe(() => this.onLogoutResponse());
    } else if (this.logOption === 'Login') {
      this.showLogin();
    }
  }

  private showLogin(): void {
    this.shouldShowLogin = true;
    this.shouldShowRegister = false;
  }

  private onError(err): Observable<any> {
    if (err.status >= 500) {
      this.message = err.status + ': server error, try refreshing the page later';
    } else if (err.status === 401) {
      this.onLogoutResponse();
    } else {
      this.message = err.status + ': something went wrong... try refreshing the page later';
    }
    return of();
  }

  private onLogoutResponse(): void {
    this.userService.deleteUser();
    this.message = null;
    this.logOption = 'Login';
    this.userService.didLogout();
    this.router.navigate(['/']);
  }

  private search() {
    this.searchService.setSearch(this.searchTitle);
    this.searchService.setPage(1);
    const searchParams: SearchParams = this.searchService.getSearchParams();
    this.router.navigate(['/'], {
      queryParams: this.searchService.removeDefaultValues(searchParams)
    });
  }

  private sendSearchRequest(params) {
    this.searchService.updateFromUrlParams(params);
    this.searchService.pingSubscribers();
  }

  private subscribeLogOption(): void {
    this.logOptionSubscription = this.userService.logOption$.subscribe(
      logOption => this.logOption = logOption
    )
  }

  private navigateToProfile(): void {
    if (this.userService.isLoggedIn()) {
      this.router.navigate(['users/' + this.userService.getUserId()]);
    } else {
      this.showLogin();
      this.loginSub = this.userService.didLogin$.subscribe(
        () => {
          this.loginSub.unsubscribe();
          this.navigateToProfile();
        }
      );
    }
  }
}
