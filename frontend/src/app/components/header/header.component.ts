import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { product } from '../../../data-type';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../pipe/filter.pipe";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faHome, faPowerOff, faShoppingCart, faPlus, faList12, faPerson, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../services/user/user.service';
import { SellerService } from '../../services/seller/seller.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, FilterPipe, FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  faUser = faUser;
  faHome = faHome;
  faPowerOff = faPowerOff;
  faShoppingCart = faShoppingCart;
  faPlus = faPlus;
  faList12 = faList12;
  faPerson = faPerson;
  faRightFromBracket = faRightFromBracket;

  userService = inject(UserService)
  sellerService = inject(SellerService)
  menuType: string = '';
  sellerName: string = '';
  userName: string = '';
  router = inject(Router);
  product = inject(ProductService);
  searchResult: product[] | undefined;
  filterData: string = '';
  cartItems: number = 0;

  ngOnInit(): void {
    this.menuTypeFun();

    // Subscribe to cart data updates from the service
    this.product.cartData.subscribe((items) => {
      this.cartItems = items.length;
    });

    // Fetch the cart data from the server once on initialization
    const user = localStorage.getItem('loggedUser');
    if (user) {
      const userId = JSON.parse(user).id;
      this.product.getCartList(userId).subscribe((cartData) => {
        this.cartItems = cartData.length;
      });
    }
  }

  menuTypeFun() {
    this.router.events.subscribe((value: any) => {
      if (value.url) {
        if (localStorage.getItem('loggedSeller') && value.url.includes('seller')) {
          let sellerStore = localStorage.getItem('loggedSeller');
          if (sellerStore) {
            let storageSellerData = JSON.parse(sellerStore);
            if (storageSellerData && storageSellerData.name) {
              this.sellerName = storageSellerData.name;
              this.menuType = 'seller';
            } else {
              console.warn('Seller data does not have a name property');
            }
          } else {
            console.warn('No seller data found in local storage');
          }
        } else if (value.url.includes('sell-auth')) {
          this.menuType = 'sellerlogin';
        } else if (localStorage.getItem('loggedUser')) {
          let userStore = localStorage.getItem('loggedUser');
          if (userStore) {
            let storageUserData = JSON.parse(userStore);
            if (storageUserData && storageUserData.name) {
              this.userName = storageUserData.name;
              this.menuType = 'user';
              this.product.getCartList(storageUserData.id).subscribe((cartData) => {
                this.cartItems = cartData.length;
              });
            } else {
              console.warn('User data does not have a name property');
            }
          } else {
            console.warn('No user data found in local storage');
          }
        } else {
          this.menuType = 'default';
        }
      }
    });
  }

  onLogoutSeller() {
    this.sellerService.sellerLogout().subscribe(
      (res) => {
        console.log('Logged out:', res);
        localStorage.removeItem('loggedSeller'); // Clear session data
        this.router.navigate(['/sell-auth']);
      },
      (error) => {
        console.error('Error during logout:', error)
      }
    )
  }

  onLogoutUser() {
    this.userService.userLogout().subscribe(
      () => {
        localStorage.removeItem('loggedUser');
        this.router.navigate(['/user-auth']);
      }
    )
  }

  searchProduct(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;
      this.product.searchProduct(element.value).subscribe((res) => {
        this.searchResult = res;
      });
    }
  }

  hideSearchMenu() {
    this.searchResult = undefined;
  }

  onSubmitSearch(value: string) {
    if (value) {
      this.router.navigate([`search`], { queryParams: { q: value } });
    }
  }

  redirectToDetails(id: number) {
    this.router.navigate(['/details/' + id]);
  }
}

