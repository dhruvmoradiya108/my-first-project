import { EventEmitter, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { signUp } from '../../../data-type';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL = 'http://localhost:5000'
  invalidUserAuth = new EventEmitter<boolean>(false);
  http = inject(HttpClient)
  router = inject(Router)
  isLoggedIn = new EventEmitter<boolean>(false);

  constructor() { }

  userSignUp(user: signUp) {
    return this.http.post(`${this.baseURL}/userSignUp`, user, { withCredentials: true })
    
  }

  userLogin(user: signUp) {
    return this.http.post(`${this.baseURL}/userLogin`, user, { withCredentials: true })
  }

  userLogout(): Observable<any> {
    return this.http.get(`${this.baseURL}/logout`, { withCredentials: true });
  }
  
  userCheckSession(): void {
    this.http.get(`${this.baseURL}/check-session`, { withCredentials: true }).subscribe(
      (response: any) => {
        if (response.isLoggedIn) {
          // Session is valid, emit true to indicate login state
          this.isLoggedIn.emit(true);
        } else {
          // Session is not valid, emit false and redirect to login
          this.isLoggedIn.emit(false);
          this.router.navigate(['/']);
        }
      },
      (error) => {
        // Handle session check error (e.g., network issues)
        this.isLoggedIn.emit(false);
        this.router.navigate(['/']);
      }
    );
  }

}
