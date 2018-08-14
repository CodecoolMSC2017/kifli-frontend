import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';
import { Subscription, Observable, of } from 'rxjs';
import { Product } from '../model/product';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ad-placement',
  templateUrl: './ad-placement.component.html',
  styleUrls: ['./ad-placement.component.css']
})
export class AdPlacementComponent implements OnInit, OnDestroy {

  private product: Product = new Product();
  private editedProductSub: Subscription;

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit() {
    this.editedProductSub = this.productService.editedProduct$.subscribe(
      product => this.onProductEdited(product)
    );
  }

  ngOnDestroy() {
    if (this.editedProductSub){
      this.editedProductSub.unsubscribe();
    }
  }

  private onProductEdited(product: Product): void {
    this.productService.postProduct(product).pipe(
      catchError(err => this.onPostProductError(err))
    ).subscribe(product => this.onPostProductResponse(product));
  }

  private onPostProductError(err: XMLHttpRequest): Observable<any> {
    console.log(err);
    return of();
  }

  private onPostProductResponse(product: Product): void {
    this.router.navigate(['/products/' + product.id]);
  }

}
