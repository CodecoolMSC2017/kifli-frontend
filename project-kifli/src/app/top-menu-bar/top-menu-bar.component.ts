import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
    this.route.queryParams.subscribe(params => this.sendSearchRequest(params.search));
    this.subscribeToSearch();

    this.someWhereClickInLogin();
    this.modifyLogOption();
  }

  ngOnDestroy() {

  }

  private subscribeToSearch(): void {
    this.searchService.searchTitle$.subscribe(string => {
      this.searchTitle = string;
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
    if (this.searchTitle === this.route.snapshot.queryParams.search) {
      this.sendSearchRequest(this.searchTitle);
      return;
    }
    if (this.searchTitle !== '' && this.searchTitle) {
      this.router.navigate(['/'], {queryParams: {search: this.searchTitle}});
    } else {
      this.router.navigate(['']);
    }
  }

  private sendSearchRequest(searchString: string) {
    this.searchService.searchTitleApply(searchString);
  }

  modifyLogOption(): void {
    this.subscription = this.userService.logOption$.subscribe(
      logOption => {
        this.logOption = logOption;
      }
    )
  }
}
