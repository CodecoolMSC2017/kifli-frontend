import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { Category } from '../model/category';
import { CategoryAttribute } from '../model/category-attribute';
import { UserService } from '../user.service';

@Component({
  selector: 'app-ad-placement',
  templateUrl: './ad-placement.component.html',
  styleUrls: ['./ad-placement.component.css']
})
export class AdPlacementComponent implements OnInit, OnDestroy {

  private loginSubscription: Subscription;

  private categories: Category[];
  private selectedCategory: Category;
  private selectedCategoryString: string;
  private errorMessage: string;
  private message: string;
  private inputErrorMessage: string;
  private categoryInputErrorMessage: string;

  private title: string;
  private description: string;
  private price: number;

  constructor(
    private productService: ProductService,
    private userService: UserService
  ) { }

  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      this.getCategories();
    } else {
      this.onNotLoggedIn();
    }
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  private reloadPage(): void {
    this.errorMessage = null;
    this.ngOnInit();
  }

  private onNotLoggedIn(): void {
    this.errorMessage = 'You must login first!';
    this.userService.showLogin();
    this.loginSubscription = this.userService.didLogin$.subscribe(
      () => this.reloadPage()
    );
  }

  private getCategories(): void {
    this.productService.getAllCategories().pipe(
      catchError(err => this.onError(err))
    ).subscribe(categories => this.onCategoriesReceived(categories));
  }

  private onCategoriesReceived(categories) {
    this.categories = categories;
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
    }
    const product: any = {};
    product.title = this.title;
    product.description = this.description;
    product.price = this.price;
    product.type = this.getAdType();
    const attributes = this.getAttributes();
    if (attributes == null) {
      return;
    } else {
      this.categoryInputErrorMessage = null;
    }
    product.attributes = attributes;
    product.categoryId = this.selectedCategory.id;

    console.log('posting product:')
    console.log(product);

    this.productService.postProduct(product).pipe(
      catchError(err => this.onPostProductError(err))
    ).subscribe(() => this.message = 'Ad posted!');
  }

  private getAdType(): string {
    const div = document.getElementById('ad-type-input');
    const inputNodes = div.querySelectorAll('input');
    for (let i = 0; i < inputNodes.length; i++) {
      const inputNode = inputNodes[i];
      if (inputNode.checked) {
        return inputNode.value;
      }
    }
  }

  private onPostProductError(err) {
    if (err.status >= 500) {
      this.message = err.status + ': server error while adding this ad';
    } else if (err.status === 401) {
      this.onNotLoggedIn();
    } else {
      this.message = err.status + ': error adding this ad';
    }
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
    this.inputErrorMessage = null;
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

  private onError(err): Observable<any> {
    if (err.status >= 500) {
      this.errorMessage = err.status + ': server error, try refreshing the page later';
    } else {
      this.errorMessage = err.status + ': something went wrong... try again later'
    }
    return of();
  }

}
