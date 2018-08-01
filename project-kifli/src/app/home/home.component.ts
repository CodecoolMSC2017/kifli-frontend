import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { SearchService } from '../search.service';

import { Product } from '../product';
import { catchError } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  errorMessage: string;
  subscription: Subscription;
  searchTitle: string;
  activateGetProdact: boolean;

  constructor(
    private productService: ProductService,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.getProducts();
    this.subscribeSearch();
    this.activateGetProductMethod();
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

  subscribeSearch(): void {
    this.subscription = this.searchService.searchTitle$.subscribe(
      searchString => {
        this.searchTitle = searchString;
        this.getSearchProducts();
      }   
    )
  }

  getSearchProducts(): void {
    this.productService.getProductBySearchTitle(this.searchTitle).pipe(
      catchError(err => this.onProductsError(err))
    ).subscribe(products => this.onProductsReceived(products));
  }

  activateGetProductMethod(): void {
    this.subscription = this.searchService.getProductAds$.subscribe(
      activateGetProdact => {
        this.activateGetProdact = activateGetProdact;
        if (activateGetProdact) {
          this.getProducts();
        }
      }
    )
  }
}
