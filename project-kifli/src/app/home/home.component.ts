import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class HomeComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  errorMessage: string;
  subscription: Subscription;
  categories: Category[];
  selectedCategoryId: string = '0';
  selectedCategoryName: string = 'All';
  minimumPrice: number = 0;
  maximumPrice: number = 9999999999;
  priceError: string;
  showCategories: boolean = false;

  constructor(
    private productService: ProductService,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.subscribeSearch();
    this.loadInitialProducts();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadCategories(): void {
    this.productService.getAllCategories().pipe(
      catchError(err => this.onCategoriesError(err))
    ).subscribe(categories => {
      this.categories = categories;
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

  getAllProducts(): void {
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
      searchString = '';
    }
    if (!this.checkIfPriceIsValid()) {
      return;
    }
    this.priceError = null;
    this.productService.search(
      searchString,
      this.selectedCategoryId,
      this.minimumPrice.toString(),
      this.maximumPrice.toString()
    ).pipe(
      catchError(err => this.onProductsError(err))
    ).subscribe(products => this.onProductsReceived(products));
  }

  private categoryFilter(): void {
    this.productService.findAllByCategoryId(this.selectedCategoryId).pipe(
      catchError(err => this.onProductsError(err))
    ).subscribe(products => this.products = products);
  }

  private checkIfPriceIsValid(): boolean {
    if (this.minimumPrice < 0) {
      this.priceError = 'Minimum price must be bigger than 0!';
      return false;
    }
    if (this.maximumPrice <= this.minimumPrice) {
      this.priceError = 'Maximum price must be bigger than minimum price!';
      return false;
    }
    return true;
  }

  private onCategoryClick(category: Category): void {
    if (!category) {
      this.selectedCategoryId = '0';
      this.selectedCategoryName = 'All';
      return;
    }
    this.selectedCategoryId = category.id.toString();
    this.selectedCategoryName = category.name;
  }

}
