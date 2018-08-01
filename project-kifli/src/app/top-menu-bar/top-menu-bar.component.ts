import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-top-menu-bar',
  templateUrl: './top-menu-bar.component.html',
  styleUrls: ['./top-menu-bar.component.css']
})
export class TopMenuBarComponent implements OnInit {

  public logOption: string;
  public searchTitle: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private searchService: SearchService,
    private route: ActivatedRoute
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
  }

  private subscribeToSearch(): void {
    this.searchService.searchTitle$.subscribe(string => this.searchTitle = string);
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
    if (this.searchTitle !== '' && this.searchTitle) {
      this.router.navigate(['/'], {queryParams: {search: this.searchTitle}});
    } else {
      this.router.navigate(['']);
    }
  }

  private sendSearchRequest(params) {
    const search = params.search;
    this.searchService.searchTitleApply(search);
  }
}
