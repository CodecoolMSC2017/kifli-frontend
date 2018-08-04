import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import { of, Observable, Subscription } from 'rxjs';
import { SearchService } from '../search.service';
import { UserService } from '../user.service';
import { SearchParams } from '../model/searchParams';

@Component({
  selector: 'app-top-menu-bar',
  templateUrl: './top-menu-bar.component.html',
  styleUrls: ['./top-menu-bar.component.css']
})
export class TopMenuBarComponent implements OnInit, OnDestroy {

  public logOption: string;
  public searchTitle: string;
  public subscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.logOption = 'Logout';
    } else {
      this.logOption = 'Login';
    }
    this.route.queryParams.subscribe(params => this.sendSearchRequest(params));
    this.subscribeToSearch();

    this.someWhereClickInLogin();
    this.modifyLogOption();
  }

  ngOnDestroy() {

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

  modifyLogOption(): void {
    this.subscription = this.userService.logOption$.subscribe(
      logOption => this.logOption = logOption
    )
  }
}
