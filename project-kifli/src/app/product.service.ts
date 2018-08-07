import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './model/product';
import { SearchService } from './search.service';
import { ProductListDto } from './model/productListDto';
import { Category } from './model/category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient,
    private searchService: SearchService
  ) { }

  public getProductById(id): Observable<Product> {
    return this.http.get<Product>('/api/products/' + id);
  }

  public getPictureById(id): Observable<any> {
    return this.http.get('/api/images/' + id);
  }

  public deleteProduct(id): Observable<any> {
    return this.http.delete('/api/products/' + id);
  }

  public search(): Observable<ProductListDto> {
    const httpParams: HttpParams = this.searchService.getHttpParams();
    return this.http.get<ProductListDto>('/api/products', {params: httpParams});
  }

  public postProduct(product: {}): Observable<any> {
    return this.http.post('/api/products', product);
  }

  public getUserProducts(id): Observable<ProductListDto> {
    return this.http.get<ProductListDto>('/api/products/user/' + id);
  }

  public getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }

  public addCategory(categoryName: string, attributes: {}): Observable<any> {
    console.log({name: categoryName, attributes: attributes});
    return this.http.post('/api/categories', {name: categoryName, attributes: attributes});
  }

}
