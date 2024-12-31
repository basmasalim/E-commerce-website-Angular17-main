import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor() { }
  private readonly _HttpClient = inject(HttpClient)

  getAllCategories(): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}api/v1/categories`)
  }

  getSpecificCategories(categoryId: string | null): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}api/v1/categories/${categoryId}`)
  }
}
