import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './model/product';
import { SearchParams } from './model/searchParams';
import { SearchService } from './search.service';
import { ProductListDto } from './model/productListDto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient,
    private searchService: SearchService
  ) { }

  public getProducts(): Observable<ProductListDto> {
    return this.http.get<ProductListDto>('/api/products');
  }

  public getProductById(id): Observable<Product> {
    return this.http.get<Product>('/api/products/' + id);
  }

  public getPictureById(id): Observable<any> {
    return this.http.get('/api/images/' + id);
  }

  public deleteProduct(id): Observable<any> {
    return this.http.delete('/api/products/' + id);
  }

  public search(params: SearchParams): Observable<ProductListDto> {
    const httpParams: HttpParams = this.searchService.getHttpParams(params);
    return this.http.get<ProductListDto>('/api/products', {params: httpParams});
  }

  public postProduct(product: {}): Observable<any> {
    return this.http.post('/api/products', product);
  }

  public getUserProducts(id): Observable<ProductListDto> {
    return this.http.get<ProductListDto>('/api/products/user/' + id);
  }

}
