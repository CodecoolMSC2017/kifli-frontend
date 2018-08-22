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
    return this.getSearchParams().search;
  }

  public getCategoryId(): string {
    return this.getSearchParams().categoryId;
  }

  public getMinimumPrice(): string {
    return this.getSearchParams().minimumPrice;
  }

  public getMaximumPrice(): string {
    return this.getSearchParams().maximumPrice;
  }

  public getPage(): string {
    return this.getSearchParams().page;
  }

  public setSearch(search: string): void {
    if (!search) {
      this.searchParams.search = '';
      return;
    }
    this.searchParams.search = search;
  }

  public setCategoryId(categoryId: number): void {
    if (!categoryId || categoryId < 0) {
      categoryId = 0;
    }
    this.searchParams.categoryId = categoryId.toString();
  }

  public setMinimumPrice(minimumPrice: number): void {
    if (!minimumPrice || minimumPrice < 0) {
      minimumPrice = 0;
    }
    this.searchParams.minimumPrice = minimumPrice.toString();
  }

  public setMaximumPrice(maximumPrice: number): void {
    if (!maximumPrice || maximumPrice < 1) {
      maximumPrice = 9999999999;
    } else {
      const minimumPrice = Number(this.searchParams.minimumPrice);
      if (maximumPrice <= minimumPrice) {
        maximumPrice = minimumPrice + 1;
      }
    }
    this.searchParams.maximumPrice = maximumPrice.toString();
  }

  public setPage(page: number): void {
    if (!page || page < 1) {
      page = 1;
    }
    this.searchParams.page = page.toString();
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
