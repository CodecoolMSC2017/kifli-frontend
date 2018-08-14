import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../model/product';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-product-wrapper',
  templateUrl: './edit-product-wrapper.component.html',
  styleUrls: ['./edit-product-wrapper.component.css']
})
export class EditProductWrapperComponent implements OnInit, OnDestroy {

  private errorMessage: string = 'Loading...';
  private productEditSub: Subscription;
  private product: Product;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscribeToProductSave();
    this.getProduct();
  }

  ngOnDestroy() {
    if (this.productEditSub) {
      this.productEditSub.unsubscribe();
    }
  }

  private subscribeToProductSave(): void {
    this.productEditSub = this.productService.editedProduct$.subscribe(
      product => this.onProductEdited(product)
    );
  }

  private onProductEdited(product: Product): void {
    this.productService.updateProduct(product).pipe(
      catchError(err => this.onProductError(err))
    ).subscribe(() => this.onUpdateResponse());
  }

  private onUpdateResponse(): void {
    this.router.navigate(['/products/' + this.product.id]);
  }

  private getProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(id).pipe(
      catchError(err => this.onProductError(err))
    ).subscribe(product => this.onProductReceived(product));
  }

  private onProductReceived(product: Product): void {
    this.product = product;
    this.errorMessage = undefined;
  }

  private onProductError(err: XMLHttpRequest): Observable<any> {
    if (err.status >= 500) {
      this.errorMessage = err.status + ': server error, try again later';
    } else {
      this.errorMessage = err.status + ': error loading page, try again later'
    }
    return of();
  }

  private delete(): void {
    this.productService.deleteProduct(this.product.id).pipe(
      catchError(err => this.onDeleteError(err))
    ).subscribe(() => this.onDeleteResponse());
  }

  private onDeleteResponse(): void {
    this.router.navigate(['/myads']);
  }

  private onDeleteError(err: XMLHttpRequest): Observable<any> {
    if (err.status >= 500) {
      this.errorMessage = err.status + ': server error, try again later';
    } else {
      this.errorMessage = err.status + ': error deleting ad, try again later'
    }
    return of();
  }

}
