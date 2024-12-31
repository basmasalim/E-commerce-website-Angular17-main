import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment.development';
import { UserData } from '../interfaces/user-data';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private readonly _HttpClient = inject(HttpClient);
  private readonly _Router = inject(Router);

  userData: UserData | null = null

  handleRegisterForm(userInfo: UserData): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}api/v1/auth/signup`, userInfo)
  }

  handleLoginForm(userInfo: UserData): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}api/v1/auth/signin`, userInfo)
  }

  saveUserDate(): void {
    let token = localStorage.getItem('userToken')
    if (token !== null) {
      this.userData = jwtDecode<UserData>(token)
      console.log('userdata', this.userData);
    }
  }

  logOut(): void {
    localStorage.removeItem('userToken')
    this.userData = null
    this._Router.navigate(['/login'])
  }

  /** forgot-password */
  handleVerifyEmail(userEmail: UserData): Observable<any> {
    return this._HttpClient.post(environment.baseUrl + 'api/v1/auth/forgotPasswords', userEmail)
  }
  handleVerifyCode(userCode: object): Observable<any> {
    return this._HttpClient.post(environment.baseUrl + 'api/v1/auth/verifyResetCode', userCode)
  }
  handleResetPassword(data: object): Observable<any> {
    return this._HttpClient.put(environment.baseUrl + 'api/v1/auth/resetPassword', data)
  }
}
