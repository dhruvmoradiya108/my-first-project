import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SellerService } from '../../services/seller/seller.service';
import { logIn, signUp } from '../../../data-type';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seller-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './seller-auth.component.html',
  styleUrl: './seller-auth.component.css'
})
export class SellerAuthComponent {

  showLoginForm: boolean = false;
  authError: string = '';
  router = inject(Router)

  constructor(private service: SellerService) { }

  onSignUp(signUpData: signUp) {
    this.service.signUp(signUpData).subscribe(
      (response) => {

        if (response && response.seller) {
          console.log('Sign-up successful:', response);
          localStorage.setItem('loggedSeller', JSON.stringify(response.seller));
          sessionStorage.setItem('seluse', JSON.stringify(response.seller))
          this.router.navigate(['seller-home'])
        }
      },
      (error) => {
        console.error('Sign-up error:', error);
        this.authError = error.error.error;
      }
    );
  }

  onLogin(loginData: logIn) {
    this.service.login(loginData).subscribe(
      (res: any) => {
        // Check if the response contains the seller data
        if (res && res.seller) {
          console.log('Sign-up successful:', res);
          // Store seller data in localStorage
          localStorage.setItem('loggedSeller', JSON.stringify(res.seller));
          sessionStorage.setItem('seluse', JSON.stringify(res.seller))

          // Navigate to seller home page
          this.router.navigate(['seller-home']);
        }
      },
      (error) => {
        // Handle login error and display the error message
        console.error('Login error:', error);
        this.authError = 'Invalid email or password';
      }
    );
  }

  openSignUpForm() {
    this.showLoginForm = false;
    this.authError = '';
  }

  openLoginForm() {
    this.showLoginForm = true;
    this.authError = '';
  }

  // showLoginForm : boolean = false;
  // authError : string = '';
  // authErrorDiv : string = '';

  // sellerLogInObj : any = {
  //   "email": "",
  //   "name": "",
  //   "password": ""
  // }

  // seller = inject(SellerService)
  // router = inject(Router)

  // onSignUp(data:signUp):void{
  //   this.seller.userSignUp(data)
  // }

  // onLogin(data: logIn): void {
  //   this.seller.userLogin(data)
  // }

  // openLoginForm() {
  //   this.showLoginForm = true;
  //   this.seller.isLoginError.subscribe((isError) => {
  //     console.warn(isError)
  //     if(isError){
  //       this.authError = 'Invalid Email or Password.';
  //       this.authErrorDiv = '';
  //     }
  //   })
  // }

  // openSignUpForm(){
  //   this.showLoginForm = false;
  // }

}
