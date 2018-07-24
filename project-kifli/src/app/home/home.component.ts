import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ProductService } from '../product.service';

import { Product } from '../product';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];

  constructor(
    private userService: UserService,
    private productService: ProductService) { }

  ngOnInit() {
    this.getAds();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(console.log);
  }

  logout(): void {
    this.userService.logout().subscribe(() => console.log('logged out'));
  }

  getAds(): void {
    this.productService.getAds().pipe(
      catchError(err => this.onAdsError(err))
    ).subscribe(products => this.products = products);
  }

  private onAdsError(err): Observable<any> {
    console.log(err);
    return of();
  }

  getOneUser(): void {
    this.userService.getUserById('5').pipe(
      catchError(err => this.onAdsError(err))
    ).subscribe(console.log);
  }

  getOwnUser(): void {
    console.log(this.userService.isLoggedIn());
    console.log(localStorage.getItem('user'));
    const id = JSON.parse(localStorage.getItem('user')).id;
    this.userService.getUserById(id).pipe(
      catchError(err => this.onAdsError(err))
    ).subscribe(console.log);
  }

}
