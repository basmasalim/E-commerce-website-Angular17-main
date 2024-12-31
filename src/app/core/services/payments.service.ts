import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment.development';
import { ShippingAddress } from '../interfaces/shipping-address';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private _HttpClient: HttpClient) { }

  myHeaders: any = {
    token: localStorage.getItem('userToken')
  }


  onlineOrder(idCart: string | null, shippingDetails: ShippingAddress): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}api/v1/orders/checkout-session/${idCart}?url=${environment.urlServer}`,
      {
        "shippingAddress": shippingDetails
      },
      {
        headers: this.myHeaders
      }
    )
  }

  cashOrder(idCart: string | null, shippingDetails: ShippingAddress): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}api/v1/orders/${idCart}`, {
      shippingAddress: shippingDetails,
    },
      {
        headers: this.myHeaders
      }

    );
  }

  getUserOrders(id: string): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}api/v1/orders/user/${id}`);
  }

  decodeUserData(): any {
    if (localStorage.getItem('userToken') !== null) {
      const token: any = localStorage.getItem('userToken');
      const decoded = jwtDecode(token);
      return decoded;
    }
  }

  getSpecificOrder(id: string | null): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}api/v1/orders/${id}`,
      {
        headers: this.myHeaders
      }
    )
  }

}
