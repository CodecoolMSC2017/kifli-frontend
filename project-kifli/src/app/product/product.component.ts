import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Product } from '../product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public product: Product;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.getProduct();
  }

  private getProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(id)
    .pipe(
      tap(console.log),
      catchError(err => this.onProductError(err))
    ).subscribe(product => this.product = product);
  }

  private onProductError(err): Observable<any> {
    console.log(err);
    return of();
  }

  private getPic(): void {
    this.productService.getPictureById(1).pipe(
      catchError(err => this.onPictureError(err))
    ).subscribe(console.log);
  }

  private onPictureError(err): Observable<any> {
    console.log(err);
    return of();
  }

}
