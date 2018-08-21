import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';
import { SearchService } from '../search.service';

import { Product } from '../model/product';
import { catchError } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { Category } from '../model/category';
import { ProductListDto } from '../model/productListDto';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private products: Product[] = [];
  private errorMessage: string;
  private categories: Category[];
  private selectedCategoryId: string = '0';
  private selectedCategoryName: string = 'All';
  private minimumPrice: number = 0;
  private maximumPrice: number = 999999999;
  private priceError: string;
  private showCategories: boolean = false;

  private searchSubscription: Subscription;
  private loginSubscription: Subscription;
  private logoutSubscription: Subscription;
  private isAdmin: boolean;

  constructor(
    private productService: ProductService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loginSubscription = this.userService.didLogin$.subscribe(
      () => this.isAdmin = this.userService.isAdmin()
    );
    this.logoutSubscription = this.userService.didLogout$.subscribe(
      () => this.isAdmin = this.userService.isAdmin()
    );
    this.isAdmin = this.userService.isAdmin();
    this.subscribeSearch();
    this.getProducts();
    this.searchService.setCategoryId(this.selectedCategoryId);
    this.searchService.setMinimumPrice(this.minimumPrice.toString());
    this.searchService.setMaximumPrice(this.maximumPrice.toString());
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
    this.loginSubscription.unsubscribe();
  }

  private onCategoriesError(err): Observable<any> {
    console.log(err);
    return of();
  }

  private onProductsReceived(productListDto: ProductListDto): void {
    console.log(productListDto);
    this.errorMessage = null;
    this.products = productListDto.products;
    this.categories = productListDto.categories;
    this.updateValues();
  }

  private onProductsError(err): Observable<any> {
    if (err.status >= 500) {
      this.errorMessage = 'Server error, please try again later';
    } else {
      this.errorMessage = 'Error loading page, please try again later';
    }
    return of();
  }

  private subscribeSearch(): void {
    this.searchSubscription = this.searchService.searchTitle$.subscribe(
      () => this.getProducts()
    )
  }

  private getProducts(): void {
    if (this.checkIfPriceIsValid()) {
      return;
    }
    this.priceError = null;
    this.productService.search().pipe(
      catchError(err => this.onProductsError(err))
    ).subscribe(productListDto => this.onProductsReceived(productListDto));
  }

  private updateValues(): void {
    this.searchService.updateFromUrlParams(this.route.snapshot.queryParams);
    const searchParams = this.searchService.getSearchParams();
    this.selectedCategoryId = searchParams.categoryId;
    this.selectedCategoryName = this.findCategoryNameById(Number(this.selectedCategoryId));
    this.minimumPrice = Number(searchParams.minimumPrice);
    this.maximumPrice = Number(searchParams.maximumPrice);
  }

  private findCategoryNameById(id: number): string {
    if (id === 0) {
      return 'All';
    }
    for (let i = 0; i < this.categories.length; i++) {
      const category: Category = this.categories[i];
      if (category.id === id) {
        return category.name;
      }
    }
  }

  private checkIfPriceIsValid(): boolean {
    if (this.minimumPrice < 0) {
      this.priceError = 'Minimum price must be bigger than 0!';
      return true;
    }
    if (this.minimumPrice > 999999998) {
      this.priceError = 'Minimum price is out of range!';
      return true;
    }
    if (this.maximumPrice <= this.minimumPrice) {
      this.priceError = 'Maximum price must be bigger than minimum price!';
      return true;
    }
    if (this.maximumPrice > 999999999) {
      this.priceError = 'Maximum price is out of range!';
      return true;
    }
    return false;
  }

  private onCategoryClick(category: Category): void {
    if (!category) {
      this.selectedCategoryId = '0';
      this.selectedCategoryName = 'All';
      this.searchService.setCategoryId(this.selectedCategoryId);
      return;
    }
    this.selectedCategoryId = category.id.toString();
    this.selectedCategoryName = category.name;
    this.searchService.setCategoryId(this.selectedCategoryId);
  }

  private onMinPriceChange(): void {
    if (!this.minimumPrice || this.minimumPrice >= this.maximumPrice) {
      this.minimumPrice = this.maximumPrice - 1;
    }
    if (this.minimumPrice < 0) {
      this.minimumPrice = 0;
    }
    if (this.minimumPrice > 999999998) {
      this.minimumPrice = 999999998;
    }
    this.searchService.setMinimumPrice(this.minimumPrice.toString());
  }

  private onMaxPriceChange(): void {
    if (!this.maximumPrice || this.maximumPrice < this.minimumPrice) {
      this.maximumPrice = this.minimumPrice + 1;
    }
    if (this.maximumPrice < 1) {
      this.maximumPrice = 1;
    }
    if (this.maximumPrice > 999999999) {
      this.maximumPrice = 999999999;
    }
    this.searchService.setMaximumPrice(this.maximumPrice.toString());
  }

}
