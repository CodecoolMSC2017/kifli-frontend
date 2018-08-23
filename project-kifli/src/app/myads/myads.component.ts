import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../model/product';
import { ProductService } from '../product.service';
import { UserService } from '../user.service';
import { ProductListDto } from '../model/productListDto';

@Component({
  selector: 'app-myads',
  templateUrl: './myads.component.html',
  styleUrls: ['./myads.component.css']
})
export class MyadsComponent implements OnInit, OnDestroy {

  private errorMessage: string;
  private products: Product[];
  private loginSubscription: Subscription;

  constructor(
    private productService: ProductService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  private getProducts(): void {
    if (!this.userService.isLoggedIn()) {
      this.errorMessage = 'You must login first!';
      this.userService.showLogin(true);
      this.userService.didLogin$.subscribe(
        () => this.getProducts()
      );
      return;
    }
    this.errorMessage = 'Loading...';
    this.productService.getUserProducts(this.userService.getUserId()).
      pipe(catchError(err => this.onProductError(err))
    ).subscribe(productListDto => this.onProductReceived(productListDto))
  }

  private onProductReceived(productListDto: ProductListDto): void {
    this.errorMessage = null;
    this.products = productListDto.products;
  }

  private onProductError(err): Observable<any> {
    if (err.status >= 500) {
      this.errorMessage = err.status + ': server error, please try again later';
    } else {
      this.errorMessage = err.status + ': error loading page, please try again later';
    }
    return of();
  }

}
