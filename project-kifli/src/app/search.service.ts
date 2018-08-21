import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
import { SearchParams } from './model/searchParams';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchTitleInput = new Subject<void>();
  public searchTitle$ = this.searchTitleInput.asObservable();

  private searchParams: SearchParams = new SearchParams();

  constructor() { }

  pingSubscribers() {
    this.searchTitleInput.next();
  }

  public getSearch(): string {
    return this.searchParams.search;
  }

  public getCategoryId(): string {
    return this.searchParams.categoryId;
  }

  public getMinimumPrice(): string {
    return this.searchParams.minimumPrice;
  }

  public getMaximumPrice(): string {
    return this.searchParams.maximumPrice;
  }

  public getPage(): string {
    return this.searchParams.page;
  }

  public setSearch(search: string): void {
    if (!search) {
      this.searchParams.search = '';
      return;
    }
    this.searchParams.search = search;
  }

  public setCategoryId(categoryId: string): void {
    if (!categoryId || categoryId === '') {
      this.searchParams.categoryId = '0';
      return;
    }
    this.searchParams.categoryId = categoryId;
  }

  public setMinimumPrice(minimumPrice: string): void {
    if (!minimumPrice || minimumPrice === '') {
      this.searchParams.minimumPrice = '0';
      return;
    }
    this.searchParams.minimumPrice = minimumPrice;
  }

  public setMaximumPrice(maximumPrice: string): void {
    if (!maximumPrice || maximumPrice === '') {
      this.searchParams.maximumPrice = '999999999';
      return;
    }
    this.searchParams.maximumPrice = maximumPrice;
  }

  public setPage(page: string): void {
    if (!page || page === '') {
      this.searchParams.page = '1';
      return;
    }
    this.searchParams.page = page;
  }

  public getSearchParams(): SearchParams {
    return JSON.parse(JSON.stringify(this.searchParams));
  }

  public getHttpParams(): HttpParams {
    const params = this.removeDefaultValues(this.getSearchParams());
    let httpParams: HttpParams = new HttpParams();
    if (params.search !== '' && params.search != null) {
      httpParams = httpParams.append('search', params.search);
    }
    if (params.categoryId !== '' && params.categoryId != null) {
      httpParams = httpParams.append('categoryId', params.categoryId);
    }
    if (params.minimumPrice !== '' && params.minimumPrice != null) {
      httpParams = httpParams.append('minimumPrice', params.minimumPrice);
    }
    if (params.maximumPrice !== '' && params.maximumPrice != null) {
      httpParams = httpParams.append('maximumPrice', params.maximumPrice);
    }
    if (params.page !== '' && params.page != null) {
      httpParams = httpParams.append('page', params.page);
    }
    return httpParams;
  }

  public removeDefaultValues(searchParams: SearchParams): SearchParams {
    const defaultParams = new SearchParams();
    for (let key of Object.keys(defaultParams)) {
      if (defaultParams[key] === searchParams[key]) {
        delete searchParams[key];
      }
    }
    return searchParams;
  }

  public updateFromUrlParams(params) {
    this.setSearch(params.search);
    this.setCategoryId(params.categoryId);
    this.setMinimumPrice(params.minimumPrice);
    this.setMaximumPrice(params.maximumPrice);
    this.setPage(params.page);
  }
}
