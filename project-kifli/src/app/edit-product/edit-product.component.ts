import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Product } from '../model/product';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { CategoryAttribute } from '../model/category-attribute';
import { Category } from '../model/category';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit, OnDestroy {

  private loginSubscription: Subscription;

  private categories: Category[];
  private selectedCategory: Category;
  private selectedCategoryString: string;
  private errorMessage: string;
  private message: string;
  private inputErrorMessage: string;
  private categoryInputErrorMessage: string;
  private newProduct: boolean = true;
  private productAttributes: Array<any> = [];

  @Input()
  private product: Product;
  private pictures: File[];
  private indexOfCurrentPicture: number = 0;

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.errorMessage = 'Loading...';
    if (this.userService.isLoggedIn()) {
      this.getCategories();
      if (this.product.id) {
        this.productAttributes = Object.keys(this.product.attributes);
        this.newProduct = false;
      }
    } else {
      this.onNotLoggedIn();
    }
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  private onNotLoggedIn(): void {
    this.errorMessage = 'You must login first!';
    this.userService.showLogin();
    this.loginSubscription = this.userService.didLogin$.subscribe(
      () => this.ngOnInit()
    );
  }

  private getCategories(): void {
    this.productService.getAllCategories().pipe(
      catchError(err => this.onError(err))
    ).subscribe(categories => this.onCategoriesReceived(categories));
  }

  private onCategoriesReceived(categories: Category[]) {
    this.categories = categories;
    if (this.product.id) {
      this.selectedCategory = this.findCategoryByName(this.product.categoryName);
    }
    this.errorMessage = undefined;
  }

  private findCategoryByName(categoryName: string): Category {
    for (let category of this.categories) {
      if (category.name === categoryName) {
        return category;
      }
    }
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

  private updateProduct(): void {
    if (this.checkBasicData()) {
      return;
    }
    /*
    if (this.checkFilesAmount()) {
      return;
    }
    */
    this.product.title = this.product.title;
    this.product.description = this.product.description;
    this.product.price = this.product.price;

    this.setBooleanAttributes();

    this.productService.productEdited(this.product);
  }

  private setBooleanAttributes(): void {
    for (let attributeName of Object.keys(this.product.attributes)) {
      const attribute: CategoryAttribute = this.findAttributeByName(attributeName);
      if (attribute.type === 'BOOL') {
        const inputNodes: NodeListOf<Element> = document.querySelectorAll('input[name=' + attribute.name + ']');
        for (let i = 0; i < inputNodes.length; i++) {
          const node: any = inputNodes.item(i);
          if (node.checked) {
            this.product.attributes[attribute.name] = node.value;
          }
        }
      }
    }
  }

  private findAttributeByName(attributeName: string): CategoryAttribute {
    for (let attribute of this.selectedCategory.attributes) {
      if (attribute.name === attributeName) {
        return attribute;
      }
    }
  }

  private save(): void {
    if (this.checkBasicData()) {
      return;
    }
    /*
    if (this.checkFilesAmount()) {
      return;
    }
    */
    this.product.title = this.product.title;
    this.product.description = this.product.description;
    this.product.price = this.product.price;

    this.product.type = this.getAdType();
    const attributes = this.getAttributes();
    if (attributes == null) {
      return;
    }
    this.categoryInputErrorMessage = null;
    this.product.attributes = attributes;
    this.product.categoryId = this.selectedCategory.id;

    this.productService.productEdited(this.product);
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
    if (!this.product.title) {
      this.inputErrorMessage = 'You must give the ad a title!';
      return true;
    }
    if (!this.product.price || typeof this.product.price !== 'number') {
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

  /* Picture handling methods, will be refactored later

  private checkFilesAmount(): boolean {
    const fileInputElement: any = document.getElementById('file-input');
    const files: File[] = fileInputElement.files;
    if (files.length > 8) {
      this.inputErrorMessage = 'You can select maximum 8 pictures!';
      return true;
    }
    this.inputErrorMessage = null;
    return false;
  }

  private onPostProductResponse(product: Product): void {
    const fileInputElement: any = document.getElementById('file-input');
    const files: File[] = fileInputElement.files;
    window.scrollTo(0, document.body.scrollHeight);
    if (files.length > 0) {
      this.uploadPictures(files);
      return;
    }
    this.router.navigate(['/products/' + this.product.id]);
  }

  private uploadPictures(pictures: File[]): void {
    this.pictures = pictures;
    this.uploadNexPic();
  }

  private uploadNexPic(): void {
    if (this.indexOfCurrentPicture === this.pictures.length) {
      this.router.navigate(['/products/' + this.product.id]);
      return;
    }
    this.message = 'Uploading picture ' + (this.indexOfCurrentPicture + 1)
      + '/' + this.pictures.length;
    this.productService.sendFile(this.pictures[this.indexOfCurrentPicture], this.product.id)
      .pipe(catchError(err => this.onSendFileError(err)))
      .subscribe(() => {
        this.indexOfCurrentPicture++;
        this.uploadNexPic();
      }
    );
  }

  private onSendFileError(err): Observable<any> {
    this.message = 'Error sending picture';
    return of();
  }
  */
}
