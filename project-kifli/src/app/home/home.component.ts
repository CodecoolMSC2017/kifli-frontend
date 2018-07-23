import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ProductService } from '../product.service';

import { Product } from '../product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];

  constructor(
    private userService: UserService,
    private productService: ProductService) { }

  ngOnInit() {
    this.getAds();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(console.log);
  }

  logout(): void {
    this.userService.logout().subscribe(() => console.log('logged out'));
  }

  getAds(): void {
    this.productService.getAds().subscribe(products => this.products = products);
  }

}
