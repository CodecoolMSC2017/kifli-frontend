import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { Subscription, Observable, of } from 'rxjs';
import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';
import { Category } from '../model/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  private errorMessage: string;
  private responseMessage: string;
  private inputErrorMessage: string;
  private loginSubscription: Subscription;

  private categories: Category[];
  private categoryName: string;
  private attributeName: string;
  private attributes: Array<{}> = [];

  constructor(
    private userService: UserService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      if (this.userService.isAdmin()) {
        this.errorMessage = null;
        this.getCategories();
      } else {
        this.errorMessage = 'This feature is accessible only for admins!';
      }
    } else {
      this.errorMessage = 'You must login first!';
      this.userService.showLogin();
      this.loginSubscription = this.userService.didLogin$.subscribe(
        () => this.ngOnInit()
      );
    }
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  private getCategories(): void {
    this.productService.getAllCategories().pipe(
      catchError(err => this.onCategoriesError(err))
    ).subscribe(categories => this.categories = categories);
  }

  private onCategoriesError(err): Observable<any> {
    if (err.status >= 500) {
      this.errorMessage = err.status + ': server error, cannot get categories';
    } else {
      this.errorMessage = err.status + ': cannot get categories';
    }
    return of();
  }

  private submit(): void {
    if (!this.categoryName) {
      this.inputErrorMessage = 'You must name the category!';
      return;
    }
    if (this.categoryNameAlreadyExists()) {
      this.inputErrorMessage = 'A category with this name already exists!';
      return;
    }
    if (this.attributes.length == 0) {
      this.inputErrorMessage = 'A category must have at least 1 attribute!';
      return;
    }
    const attributes = this.convertAttributeTypes();
    this.productService.addCategory(this.categoryName, attributes).pipe(
      catchError(err => this.onCategoryPostError(err))
    ).subscribe(() => this.responseMessage = 'Category added!')
  }

  private categoryNameAlreadyExists(): boolean {
    for (let i = 0; i < this.categories.length; i++) {
      const category: Category = this.categories[i];
      if (category.name === this.categoryName) {
        return true;
      }
    }
    return false;
  }

  private onCategoryPostError(err): Observable<any> {
    if (err.status >= 500) {
      this.responseMessage = err.status + ': server error';
    } else {
      this.responseMessage = err.status + ': error adding category';
    }
    return of();
  }

  private convertAttributeTypes(): Array<{}> {
    const attributes: Array<{}> = [];
    for (let i = 0; i < this.attributes.length; i++) {
      const currentAttribute: any = this.attributes[i];
      const attribute: any = {};
      attribute.name = currentAttribute.name;
      if (currentAttribute.type === 'Text') {
        attribute.type = 'STRING';
      } else if (currentAttribute.type === 'Number') {
        attribute.type = 'NUMBER';
      } else if (currentAttribute.type === 'Yes/No') {
        attribute.type = 'BOOL';
      }
      attributes.push(attribute);
    }
    return attributes;
  }

  private addAttribute(): void {
    if (this.attributeNameAlreadyExists()) {
      this.inputErrorMessage = 'An attribute is already added with this name!';
      return;
    }
    if (!this.attributeName) {
      this.inputErrorMessage = 'You must give a name to this attribute!';
      return;
    }
    this.attributes.push(
      {name: this.attributeName, type: this.getRadioInputValue()}
    );
    this.attributeName = undefined;
    this.inputErrorMessage = undefined;
  }

  private getRadioInputValue(): string {
    const inputs = document.querySelectorAll('input[name=categoryType]');
    for (let i = 0; i < inputs.length; i++) {
      const input: any = inputs[i];
      if (input.checked) {
        return input.value;
      }
    }
  }

  private attributeNameAlreadyExists(): boolean {
    for (let i = 0; i < this.attributes.length; i++) {
      const attribute: any = this.attributes[i];
      if (attribute.name === this.attributeName) {
        return true;
      }
    }
    return false;
  }

  private removeAttribute(attribute): void {
    const newArray: Array<{}> = [];
    for (let i = 0; i < this.attributes.length; i++) {
      const currentAttribute: any = this.attributes[i];
      if (attribute.name === currentAttribute.name) {
        continue;
      }
      newArray.push(currentAttribute);
    }
    this.attributes = newArray;
  }

}
