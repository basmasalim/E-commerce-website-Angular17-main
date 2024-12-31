import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environment/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor() { }
  private readonly _HttpClient = inject(HttpClient);

  getAllProducts(): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}api/v1/products`)
  }
  getSpecificProducts(productId: string | null): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}api/v1/products/${productId}`)
  }
}
