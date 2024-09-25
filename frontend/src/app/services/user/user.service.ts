import { EventEmitter, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL = 'http://localhost:5000'
  invalidUserAuth = new EventEmitter<boolean>(false);
  http = inject(HttpClient)
  router = inject(Router)

  constructor() { }

  userSignUp(userData : any) {
    return this.http.post(`${this.baseURL}/userSignUp`, userData)
  }

  userLogin(userData: any) {
    return this.http.post(`${this.baseURL}/userLogin`, userData)
  }

  userLogout(): Observable<any> {
    return this.http.get(`${this.baseURL}/logout`, {withCredentials: true});
  }

  
}
