import { Component, OnInit } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Product } from '../model/product';
import { ProductService } from '../product.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 
import { HttpClient } from '@angular/common/http';

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
  public errorMessage: string;
  products;
  userId: String;

  constructor(
    private http: HttpClient,
    private productService: ProductService) {}

  ngOnInit() {
    this.getUser();
    this.getProducts(this.userId)
  }

  public getUser() {
     
    let userString = localStorage.getItem("user");
    let userObject = JSON.parse(userString);
    this.userId = userObject.id;
  }

  getProducts(userId) {
    this.productService.getUserProducts(userId).
    pipe(catchError(err => this.onProductError(err))
  ).subscribe(product => this.onProductReceived(product))
  }

  onProductReceived(product: Product) {
    console.log(product);
    this.products = product; 
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
