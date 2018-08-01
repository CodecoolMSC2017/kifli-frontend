import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { SearchService } from '../search.service';

import { Product } from '../product';
import { catchError } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { Category } from '../model/category';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  errorMessage: string;
  subscription: Subscription;
  activateGetProdact: boolean;
  categories: Category[];
  selectedCategoryId: string;

  constructor(
    private productService: ProductService,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.subscribeSearch();
    this.loadInitialProducts();
    this.loadCategories();
  }

  private loadCategories(): void {
    this.productService.getAllCategories().pipe(
      catchError(err => this.onCategoriesError(err))
    ).subscribe(categories => {
      this.categories = categories;
      this.selectedCategoryId = categories[0].id;
    });
  }

  private onCategoriesError(err): Observable<any> {
    console.log(err);
    return of();
  }

  private loadInitialProducts(): void {
    const searchString = this.searchService.lastValue;
    this.getSearchProducts(searchString);
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
      searchString => this.getSearchProducts(searchString)
    )
  }

  getSearchProducts(searchString: string): void {
    if (!searchString) {
      this.getProducts();
    }
    this.productService.getProductBySearchTitle(searchString).pipe(
      catchError(err => this.onProductsError(err))
    ).subscribe(products => this.onProductsReceived(products));
  }

  private categoryFilter(): void {
    this.productService.findAllByCategoryId(this.selectedCategoryId).pipe(
      catchError(err => this.onProductsError(err))
    ).subscribe(products => this.products = products);
  }
}
