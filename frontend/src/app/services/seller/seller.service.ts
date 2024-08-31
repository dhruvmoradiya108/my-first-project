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

  // userSignUp(data: signUp) {
  //   return this.http.post('http://localhost:3000/seller', data, { observe: 'response' })
  //   .subscribe((result : any) => {
  //     if(result){
  //       localStorage.setItem('loggedSeller', JSON.stringify(result.body))
  //       this.router.navigate(["seller-home"])
  //     }
  //   })
  // }

  // userLogin(data: logIn) {
  //   return this.http.get(`http://localhost:3000/seller?email=${data.email}&password=${data.password}`,
  //     { observe: 'response' })
  //     .subscribe((result: any) => {
  //       // console.log(result)
  //       // console.warn(result)
  //       if(result && result.body && result.body.length){
  //         this.isLoginError.emit(false);
  //         localStorage.setItem('loggedSeller', JSON.stringify(result.body))
  //         this.router.navigate(["seller-home"])
  //       } else {
  //         console.error("Login failed.")
  //         this.isLoginError.emit(true);
  //       }
  //     })
  // }
}
