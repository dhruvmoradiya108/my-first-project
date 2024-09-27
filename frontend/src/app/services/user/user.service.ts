import { EventEmitter, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { signUp } from '../../../data-type';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL = 'http://localhost:5000'
  invalidUserAuth = new EventEmitter<boolean>(false);
  http = inject(HttpClient)
  router = inject(Router)

  constructor() { }

  userSignUp(user : signUp) {
    return this.http.post(`${this.baseURL}/userSignUp`, user, {withCredentials: true})
  }

  userLogin(user : signUp) {
    return this.http.post(`${this.baseURL}/userLogin`, user, {withCredentials: true})
  }

  userLogout(): Observable<any> {
    return this.http.get(`${this.baseURL}/logout`, {withCredentials: true});
  }
  checkSession(): Observable<any> {
    return this.http.get(`${this.baseURL}/check-session`, { withCredentials: true });
  }
  
}
