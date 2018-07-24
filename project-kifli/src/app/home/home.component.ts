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
  errorMessage: string;

  constructor(
    private userService: UserService,
    private productService: ProductService) { }

  ngOnInit() {
    this.getProducts();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(console.log);
  }

  getProducts(): void {
    this.productService.getProducts().pipe(
      catchError(err => this.onProductsError(err))
    ).subscribe(products => this.onProductsReceived(products));
  }

  private onProductsReceived(products): void {
    this.errorMessage = null;
    this.products = products;
  }

  private onProductsError(err): Observable<any> {
    if (err.status >= 500) {
      this.errorMessage = 'Server error, please try again later';
    } else {
      this.errorMessage = 'Error loading page, please try again later';
    }
    return of();
  }

  getOneUser(): void {
    this.userService.getUserById('5').pipe(
      catchError(err => this.onProductsError(err))
    ).subscribe(console.log);
  }

  getOwnUser(): void {
    console.log(this.userService.isLoggedIn());
    console.log(localStorage.getItem('user'));
    const id = JSON.parse(localStorage.getItem('user')).id;
    this.userService.getUserById(id).pipe(
      catchError(err => this.onProductsError(err))
    ).subscribe(console.log);
  }

}
