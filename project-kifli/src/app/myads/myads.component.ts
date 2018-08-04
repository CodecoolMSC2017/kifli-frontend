import { Component, OnInit } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Product } from '../model/product';
import { ProductService } from '../product.service';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UserService } from '../user.service';
import { ProductListDto } from '../model/productListDto';

@Component({
  selector: 'app-myads',
  templateUrl: './myads.component.html',
  styleUrls: ['./myads.component.css']
})

@NgModule({
  imports: [     
    BrowserModule,
    HttpClientModule,
  ]
}) 

export class MyadsComponent implements OnInit {
  private errorMessage: string;
  private products: Product[];
  private userId: number;

  constructor(
    private productService: ProductService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userId = this.userService.getUserId();
    this.getProducts();
  }

  getProducts() {
    this.productService.getUserProducts(this.userId).
      pipe(catchError(err => this.onProductError(err))
    ).subscribe(productListDto => this.onProductReceived(productListDto))
  }

  onProductReceived(productListDto: ProductListDto) {
    this.products = productListDto.products;
  }

  onProductError(err): Observable<any> {
    if(err.status >= 500) {
      this.errorMessage = 'Server error, please try again later';
    } else {
      this.errorMessage = 'Error loading page, please try again later';
    }
    return of();
  }

}
