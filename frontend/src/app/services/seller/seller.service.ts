import { HttpClient } from '@angular/common/http';
import { EventEmitter, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  private baseUrl = 'http://localhost:5000'
  isLoginError = new EventEmitter<boolean>(false);
  http = inject(HttpClient)
  router = inject(Router)

  constructor() { }

  signUp(sellerData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, sellerData);
  }

  login(sellerData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, sellerData);
  }

  sellerLogout () : Observable<any> {
    return this.http.get(`${this.baseUrl}/logout`, {withCredentials: true});
  }
}
