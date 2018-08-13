import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Product } from '../model/product';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit, OnDestroy {

  private errorMessage: string;
  private loginSubscription: Subscription;

  private product: Product;

  private title: string;
  private description: string;
  private price: number;

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      this.getProduct();
    } else {
      this.onNotLoggedIn();
    }
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  private onNotLoggedIn(): void {
    this.errorMessage = 'You must login first!';
    this.userService.showLogin();
    this.userService.didLogin$.subscribe(
      () => {
        this.errorMessage = undefined;
        this.ngOnInit();
      }
    );
  }

  private getProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(id).pipe(
      catchError(err => this.onProductError(err))
    ).subscribe(product => this.onProductReveiced(product));
  }

  private onProductReveiced(product: Product): void {
    if (product.ownerId !== this.userService.getUserId()) {
      this.errorMessage = 'You can only edit your own ads!';
      return;
    }
    this.product = product;
  }

  private onProductError(err): Observable<Product> {
    if (err.status >= 500) {
      this.errorMessage = err.status + ': server error, try again later';
    } else {
      this.errorMessage = err.status + ': error loading page';
    }
    return of();
  }

  private deleteProduct(): void {
    this.productService.deleteProduct(this.product.id).pipe(
      catchError(err => this.onDeleteError(err))
    ).subscribe(() => this.router.navigate(['/']))
  }

  private onDeleteError(err: XMLHttpRequest): Observable<any> {
    this.errorMessage = err.status + ': error deleting ad';
    return of();
  }

}
