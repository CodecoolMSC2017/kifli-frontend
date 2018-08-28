import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';
import { Subscription, Observable, of } from 'rxjs';
import { Product } from '../model/product';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-ad-placement',
  templateUrl: './ad-placement.component.html',
  styleUrls: ['./ad-placement.component.css']
})
export class AdPlacementComponent implements OnInit, OnDestroy {

  private product: Product;
  private editedProductSub: Subscription;
  private loginSubscription: Subscription;
  private errorMessage: string;
  private message: string;

  private indexOfCurrentPicture: number = 0;

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      if (!this.userService.getStoredUser().credentials) {
        this.onMissingCredentials();
        return;
      }
      this.editedProductSub = this.productService.editedProduct$.subscribe(
        product => this.onProductEdited(product)
      );
      this.product = new Product();
      this.errorMessage = undefined;
    } else {
      this.onNotLoggedIn();
    }
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    if (this.editedProductSub) {
      this.editedProductSub.unsubscribe();
    }
  }

  private onMissingCredentials(): void {
    this.errorMessage = 'You must provide your credentials first! Navigate to your profile to do so.';
  }

  private onNotLoggedIn(): void {
    this.errorMessage = 'You must login first!';
    this.userService.showLogin(true);
    this.loginSubscription = this.userService.didLogin$.subscribe(
      () => this.ngOnInit()
    );
  }

  private onProductEdited(product: Product): void {
    this.message = 'Posting ad...';
    window.scrollTo(0, document.body.scrollHeight);

    this.productService.postProduct(product).pipe(
      catchError(err => this.onPostProductError(err))
    ).subscribe(product => this.onPostProductResponse(product));
  }

  private onPostProductError(err: XMLHttpRequest): Observable<any> {
    if (err.status >= 500) {
      this.errorMessage = err.status + ': server error, try again later';
    } else if (err.status === 401) {
      this.onNotLoggedIn();
    } else {
      this.errorMessage = err.status + ': error posting ad, try again later';
    }
    return of();
  }

  private onPostProductResponse(product: Product): void {
    this.product = product;
    this.uploadNexPic();
  }

  private uploadNexPic(): void {
    const pictures: File[] = this.productService.pictures;
    if (this.indexOfCurrentPicture === pictures.length) {
      this.router.navigate(['/products/' + this.product.id]);
      return;
    }
    this.message = 'Uploading picture ' + (this.indexOfCurrentPicture + 1)
      + '/' + pictures.length;
    this.productService.sendFile(pictures[this.indexOfCurrentPicture], this.product.id).pipe(
      catchError(err => this.onSendFileError(err))
    ).subscribe(() => {
      this.indexOfCurrentPicture++;
      this.uploadNexPic();
    });
  }

  private onSendFileError(err): Observable<any> {
    this.message = err.status + ': error sending picture';
    return of();
  }

}
