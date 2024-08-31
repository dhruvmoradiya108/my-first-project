import { EventEmitter, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  // userSignUp(data: signUp) {
  //   return this.http.post('http://localhost:3000/users', data, { observe: 'response' })
  //   .subscribe((res: any) => {
  //     if(res){
  //       localStorage.setItem('loggedUser', JSON.stringify(res.body))
  //       this.router.navigate(['/'])
  //     }
  //   })
  // }

  // userLogin(data : logIn){
  //   return this.http.get(`http://localhost:3000/users?email=${data.email}&password=${data.password}`, 
  //     { observe: 'response' })
  //     .subscribe((res : any) => {
  //     if(res && res.body?.length){
  //       // console.log(res)
  //       this.invalidUserAuth.emit(false)
  //       localStorage.setItem('loggedUser', JSON.stringify(res.body))
  //       this.router.navigate(['/'])
  //      } 
  //     else {
  //       console.error("Login Failed");
  //       this.invalidUserAuth.emit(true)
  //     }
  //   })
  // }

  // userAuthReload(){
  //   if(localStorage.getItem('user')){
  //     this.router.navigate(['/'])
  //   }
  // }
}
