import { Injectable } from '@angular/core';
import { Subject, Observable }    from 'rxjs';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchTitleInput = new Subject<string>();
  private getAllProduct = new Subject<boolean>();

  constructor() { }

  searchTitle$ = this.searchTitleInput.asObservable();
  getProductAds$ = this.getAllProduct.asObservable();

  searchTitleApply(search: string) {
    this.searchTitleInput.next(search);
    console.log(search);
  }

  getAllProductClick(activate: boolean) {
    this.getAllProduct.next(activate);
  }
}
