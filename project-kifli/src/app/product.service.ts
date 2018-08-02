import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
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

  public search(
    searchTitle: string,
    categoryId: string,
    minimumPrice: string,
    maximumPrice: string
  ): Observable<Product[]> {
    return this.http.get<Product[]>(
      '/api/products/search',
      {
        params: {
          search: searchTitle,
          categoryId: categoryId,
          minimumPrice: minimumPrice,
          maximumPrice: maximumPrice
        }
      }
    );
  }

  public getAllCategories(): Observable<any> {
    return this.http.get('/api/categories');
  }

  public postProduct(product: {}): Observable<any> {
    return this.http.post('/api/products', product);
  }

  public getUserProducts(id): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products/user/' + id);
  }

  public findAllByCategoryId(id): Observable<any> {
    return this.http.get('/api/products/category/' + id);
  }

}
