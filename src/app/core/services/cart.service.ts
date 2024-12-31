import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environment/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }
  private readonly _HttpClient = inject(HttpClient);

  cartNumber: BehaviorSubject<number> = new BehaviorSubject(0)

  myHeaders: any = {
    token: localStorage.getItem('userToken')
  }

  addProductsToCart(id: string): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}api/v1/cart`, {
      "productId": id
    }, {
      headers: this.myHeaders
    })
  };

  getProductsCart(): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}api/v1/cart`, {
      headers: this.myHeaders
    })
  }

  removeSpecificCart(id: string): Observable<any> {
    return this._HttpClient.delete(`${environment.baseUrl}api/v1/cart/${id}`, {
      headers: this.myHeaders
    })
  }

  updateProductsCart(id: string, newCount: number): Observable<any> {
    return this._HttpClient.put(`${environment.baseUrl}api/v1/cart/${id}`, {
      "count": newCount
    }, {
      headers: this.myHeaders
    })
  }
}
