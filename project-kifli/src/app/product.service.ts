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

}
