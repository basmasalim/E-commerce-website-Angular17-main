import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environment/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor() { }
  private readonly _HttpClient = inject(HttpClient)

  favNumber: BehaviorSubject<number> = new BehaviorSubject(0)

  myHeaders: any = {
    token: localStorage.getItem('userToken')
  }

  addProductsToWishlist(id: string): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}api/v1/wishlist`, {
      "productId": id
    }, {
      headers: this.myHeaders
    })
  }

  getProductsWishlist(): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}api/v1/wishlist`, {
      headers: this.myHeaders
    })
  }
  removeProductsWishlist(id: string): Observable<any> {
    return this._HttpClient.delete(`${environment.baseUrl}api/v1/wishlist/${id}`, {
      headers: this.myHeaders
    })
  }
}
