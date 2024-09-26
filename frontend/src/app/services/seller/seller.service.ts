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
  isLoggedIn = new EventEmitter<boolean>(false);
  http = inject(HttpClient)
  router = inject(Router)
  loggedIn = false;
  userData: any;

  constructor() { this.checkSession(); }


  // checkSession() {
  //   this.http.get(`${this.baseUrl}/check-session`).subscribe(
  //     (response: any) => {
  //       if (response.isLoggedIn) {
  //         // Session is valid, user is logged in
  //         this.loggedIn = true;
  //         this.userData = response.userData; // Store user data if needed
  //       } else {
  //         // Session is not valid, redirect to login
  //         this.loggedIn = false;
  //         this.router.navigate(['/']);
  //       }
  //     },
  //     (error) => {
  //       // Handle error (e.g., if the session check fails)
  //       this.loggedIn = false;
  //       this.router.navigate(['/']);
  //     }
  //   );
  // }

  signUp(sellerData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, sellerData, { withCredentials: true });
  }

  login(sellerData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, sellerData, { withCredentials: true });
  }

  sellerLogout(): Observable<any> {
    return this.http.get(`${this.baseUrl}/logout`, { withCredentials: true });
  }

  checkSession(): void {
    this.http.get(`${this.baseUrl}/check-session`, { withCredentials: true }).subscribe(
      (response: any) => {
        if (response.isLoggedIn) {
          // Session is valid, emit true to indicate login state
          this.isLoggedIn.emit(true);
        } else {
          // Session is not valid, emit false and redirect to login
          this.isLoggedIn.emit(false);
          this.router.navigate(['/sell-auth']);
        }
      },
      (error) => {
        // Handle session check error (e.g., network issues)
        this.isLoggedIn.emit(false);
        this.router.navigate(['/sell-auth']);
      }
    );
  }

}
