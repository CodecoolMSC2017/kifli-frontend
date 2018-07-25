import { Component, OnInit } from '@angular/core';
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
    private productService: ProductService) { }

  ngOnInit() {
    this.getProducts();
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
}
