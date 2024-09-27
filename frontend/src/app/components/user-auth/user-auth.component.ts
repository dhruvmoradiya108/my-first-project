import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { cart, logIn, product, signUp } from '../../../data-type';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.css',
})
export class UserAuthComponent {

  router = inject(Router)
  user = inject(UserService);
  product = inject(ProductService)
  userService = inject(UserService)
  showLoginForm: boolean = false;
  userAuthError: string = '';

  onUserSignup(userSignUpdata: signUp) {
    this.userService.userSignUp(userSignUpdata).subscribe((res: any) => {
      if (res) { 
        this.showLoginForm = true;
        // console.log('Signup Successfully.', res)
        // // localStorage.setItem('loggedUser', JSON.stringify(res));
        // const { id, name, email, password } = res.seller;
        // const loggedUser = { id, name, email, password };
        // localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        // this.router.navigate(['']);
      } else {
        console.error('Error occurred while signing up.')
      }
    })
  }

  onUserLogin(userLogindata: signUp) {
    this.userService.userLogin(userLogindata).subscribe((res: any) => {
      if (res) {
        // console.log('Login Successfully.', res)
        // localStorage.setItem('loggedUser', JSON.stringify(res));
        const { id, name, email, password } = res.user;
        const loggedUser = { id, name, email, password };
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        this.router.navigate(['']);
      } else {
        console.error('Error occurred while logging in.')
      }
    })
  }

  openLoginForm() {
    this.showLoginForm = true;
    this.user.invalidUserAuth.subscribe((isError) => {
      // console.warn(isError)
      if (isError) {
        this.userAuthError = 'User not found.';
      } else {
        this.localCartToRemoteCart();
      }
    })
  }
  
  openSignUpForm() {
    this.showLoginForm = false
  }

  localCartToRemoteCart() {
    // console.warn("called")
    let data = localStorage.getItem('localCart')
    if (data) {
      let cartDataList: product[] = JSON.parse(data);
      let user = localStorage.getItem('loggedUser')
      let userId = user && JSON.parse(user).id
      console.warn(userId);
      cartDataList.forEach((product: product, index) => {
        let cartData: cart = {
          ...product,
          productId: product.id,
          userId
        }
        delete cartData.id;
        setTimeout(() => {
          this.product.addToCart(cartData).subscribe((res) => {
            if (res) {
              console.log("Data is stored into the DB");
            }
          })
        }, 500)
        if (cartDataList.length === index + 1) {
          localStorage.removeItem('localCart')
        }
      })
      setTimeout(() => {
        this.product.getCartList(userId)
      }, 2000)
    }
  }
}
