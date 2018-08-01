import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth.service';
import { Category } from '../model/category';
import { CategoryAttribute } from '../model/category-attribute';

@Component({
  selector: 'app-ad-placement',
  templateUrl: './ad-placement.component.html',
  styleUrls: ['./ad-placement.component.css']
})
export class AdPlacementComponent implements OnInit {

  private categories: Category[];
  private selectedCategory: Category;
  private selectedCategoryString: string;
  private errorMessage: string;
  private inputErrorMessage: string;
  private categoryInputErrorMessage: string;

  private title: string;
  private description: string;
  private price: number;

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.getCategories();
    } else {
      this.errorMessage = 'You must login first!';
    }
  }

  private getCategories(): void {
    this.productService.getAllCategories().pipe(
      catchError(err => this.onCategoriesError(err))
    ).subscribe(categories => this.onCategoriesReceived(categories));
  }

  private onCategoriesReceived(categories) {
    this.categories = categories;
  }

  private onCategoriesError(err): Observable<any> {
    console.log(err);
    if (err.status === 401) {
      this.authService.deleteAuth();
      this.errorMessage = 'You must login first!';
    } else if (err.status >= 500) {
      this.errorMessage = 'Server error, please try again later';
    }
    return of();
  }

  private setSelectedCategory(): void {
    this.selectedCategory = JSON.parse(this.selectedCategoryString);
  }

  private getAttributes(): {} {
    const data = {};
    const nodes = document.querySelectorAll('.attribute-input');
    for (let i = 0; i < nodes.length; i++) {
      const attribute = this.selectedCategory.attributes[i];
      const node: any = nodes[i];
      let value;
      if (node.tagName === 'TD') {
        value = this.getRadioInputValue(node);
      } else {
        value = node.value;
        if (this.checkAttribute(attribute, value)) {
          return null;
        }
      }
      data[attribute.name] = value;
    }
    return data;
  }

  private placeAd(): void {
    if (this.checkBasicData()) {
      return;
    } else {
      this.inputErrorMessage = null;
    }
    const product: any = {};
    product.title = this.title;
    product.description = this.description;
    product.price = this.price;
    const attributes = this.getAttributes();
    if (attributes == null) {
      return;
    } else {
      this.categoryInputErrorMessage = null;
    }
    product.attributes = attributes;
    product.categoryId = this.selectedCategory.id; 

    console.log(product);

    this.productService.postProduct(product).pipe(
      catchError(err => this.onPostProductError(err))
    ).subscribe();
  }

  private onPostProductError(err): Observable<any> {
    console.log(err);
    return of();
  }

  private getRadioInputValue(tdNode): boolean {
    const inputNodes = tdNode.querySelectorAll('input');
    for (let i = 0; i < inputNodes.length; i++) {
      const inputNode = inputNodes[i];
      if (inputNode.checked) {
        return inputNode.value;
      }
    }
  }

  private checkBasicData(): boolean {
    if (!this.title) {
      this.inputErrorMessage = 'You must give the ad a title!';
      return true;
    }
    if (!this.price || typeof this.price !== 'number') {
      this.inputErrorMessage = 'The price is not a valid number!';
      return true;
    }
    return false;
  }

  private checkAttribute(attribute: CategoryAttribute, value): boolean {
    if (!value) {
      this.categoryInputErrorMessage = 'You must fill all fields!';
      return true;
    }
    if (attribute.type === 'NUMBER') {
      if (Number(value) + '' === 'NaN') {
        this.categoryInputErrorMessage = 'Not a valid number at ' + attribute.name + '!';
        return true;
      }
    }
    return false;
  }

}
