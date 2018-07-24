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
  public errorMessage: string;

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
    ).subscribe(product => this.onProductReceived(product));
  }

  private onProductReceived(product: Product) {
    this.errorMessage = null;
    this.product = product;
  }

  private onProductError(err): Observable<any> {
    if (err.status >= 500) {
      this.errorMessage = 'Server error, please try again later';
    } else {
      this.errorMessage = 'Error loading page, please try again later';
    }
    return of();
  }

}
