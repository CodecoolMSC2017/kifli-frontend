import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../model/product';
import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CategoryAttribute } from '../model/category-attribute';
import { Category } from '../model/category';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  private categories: Category[];
  private selectedCategory: Category;
  private selectedCategoryString: string;
  private errorMessage: string = 'Loading...';
  private inputErrorMessage: string;
  private categoryInputErrorMessage: string;
  private newProduct: boolean = true;
  private productAttributes: Array<any> = [];

  @Input()
  private product: Product;

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.getCategories();
    if (this.product.id) {
      this.productAttributes = Object.keys(this.product.attributes);
      this.newProduct = false;
    }
  }

  private getCategories(): void {
    this.productService.getAllCategories().pipe(
      catchError(err => this.onError(err))
    ).subscribe(categories => this.onCategoriesReceived(categories));
  }

  private onCategoriesReceived(categories: Category[]) {
    this.categories = categories;
    if (!this.newProduct) {
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
    this.setBooleanAttributes();
    this.productService.productEdited(this.product);
  }

  private setBooleanAttributes(): void {
    for (let attributeName of Object.keys(this.product.attributes)) {
      const attribute: CategoryAttribute = this.findAttributeByName(attributeName);
      if (attribute.type === 'BOOL') {
        const inputNodes: NodeListOf<Element> = document.querySelectorAll('input[name=\'' + attribute.id + '\']');
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

    this.product.type = this.getAdType();
    const attributes = this.getAttributes();
    if (attributes == null) {
      return;
    }
    this.categoryInputErrorMessage = null;
    this.product.attributes = attributes;
    this.product.categoryId = this.selectedCategory.id;
    this.product.activation = false;

    if (this.checkFilesAmount()) {
      return;
    }
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
    if (!this.product.title || this.product.title.trim() === '') {
      this.inputErrorMessage = 'You must give the ad a title!';
      return true;
    }
    if (!this.product.price || typeof this.product.price !== 'number') {
      this.inputErrorMessage = 'The price is not a valid number!';
      return true;
    }
    this.inputErrorMessage = undefined;
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

  private checkFilesAmount(): boolean {
    const fileInputElement: any = document.getElementById('file-input');
    const files: File[] = fileInputElement.files;
    if (files.length > 8) {
      this.inputErrorMessage = 'You can select maximum 8 pictures!';
      return true;
    }
    this.productService.pictures = files;
    return false;
  }
}
