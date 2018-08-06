import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { Product } from '../model/product';
import { UserService } from '../user.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy {

  private loginSubscription: Subscription;

  private product: Product;
  private errorMessage: string;
  private message: string;
  private isOwnProduct: boolean = false;
  private isAdmin: boolean = false;
  private selectedPictureSrc: string;
  private contactButtonText: string = 'Show';
  private productAttributes = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginSubscription = this.userService.didLogin$.subscribe(
      () => this.updateUserData()
    );
    this.getProduct();
    this.isAdmin = this.userService.isAdmin();
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }

  private updateUserData(): void {
    this.isAdmin = this.userService.isAdmin();
    if (this.product) {
      if (this.userService.getUserId() === this.product.ownerId) {
        this.isOwnProduct = true;
      }
    }
  }

  private getProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(id).pipe(
      catchError(err => this.onError(err))
    ).subscribe(product => this.onProductReceived(product));
  }

  private onProductReceived(product: Product): void {
    if (this.userService.getUserId() === product.ownerId) {
      this.isOwnProduct = true;
    }
    this.errorMessage = null;

    this.productAttributes = Object.keys(product.attributes);
    this.product = product;
  }

  private onError(err): Observable<any> {
    if (err.status === 404) {
      this.errorMessage = err.status + ': ad not found!';
    } else if (err.status >= 500) {
      this.errorMessage = 'Server error, please try again later';
    } else {
      this.errorMessage = 'Error loading page, please try again later';
    }
    return of();
  }

  private deleteProduct(): void {
    this.productService.deleteProduct(this.product.id).pipe(
      catchError(err => this.onDeleteError(err))
    ).subscribe(() => this.router.navigate(['/']))
  }

  private editProduct(): void {
    console.log('edit button clicked');
  }

  private onDeleteError(err): Observable<any> {
    if (err.status >= 500) {
      this.message = err.status + ': server error, try again later';
    } else {
      this.message = err.status + ': something went wrong, try again later';
    }
    return of();
  }

  private contact(): void {
    if (this.contactButtonText === 'Show') {
      this.contactButtonText = 'Hide';
    } else {
      this.contactButtonText = 'Show';
    }
  }

}
