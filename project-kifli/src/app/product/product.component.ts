import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Product } from '../product';
import { UserService } from '../user.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public product;
  public errorMessage: string;
  public isOwnProduct: boolean = false;
  public isAdmin: boolean = false;
  public selectedPictureSrc: string;
  public contactButtonText: string = 'Show';
  public productAttributes = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getProduct();
    this.isAdmin = this.userService.isAdmin();
  }

  private getProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(id).pipe(
      catchError(err => this.onProductError(err))
    ).subscribe(product => this.onProductReceived(product));
  }

  private onProductReceived(product: Product) {
    console.log(product);
    if (this.userService.getUserId() === product.ownerId) {
      this.isOwnProduct = true;
    }
    this.errorMessage = null;

    this.productAttributes = Object.keys(product.attributes);
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

  deleteProduct(): void {
    this.productService.deleteProduct(this.product.id).pipe(
      catchError(err => this.onDeleteError(err))
    ).subscribe(() => this.router.navigate(['/']))
  }

  editProduct(): void {
    console.log('edit button clicked');
  }

  private onDeleteError(err): Observable<any> {
    console.log(err);
    return of();
  }

  contact(): void {
    if (this.contactButtonText === 'Show') {
      this.contactButtonText = 'Hide';
    } else {
      this.contactButtonText = 'Show';
    }
  }

}
