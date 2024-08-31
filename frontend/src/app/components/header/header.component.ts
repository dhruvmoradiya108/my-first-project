import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router'
import { ProductService } from '../../services/product/product.service';
import { product } from '../../../data-type';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../pipe/filter.pipe";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faHome, faPowerOff, faShoppingCart, faPlus, faList12, faPerson, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, FilterPipe, FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  faUser = faUser
  faHome = faHome
  faPowerOff = faPowerOff
  faShoppingCart = faShoppingCart
  faPlus = faPlus
  faList12 = faList12
  faPerson = faPerson
  faRightFromBracket = faRightFromBracket

  menuType: string = '';
  sellerName: string = '';
  userName: string = '';
  router = inject(Router)
  product = inject(ProductService)
  searchResult: product[] | undefined;
  filterData: string = '';
  cartItems: number = 0


  ngOnInit(): void {
    this.menuTypeFun();
    let cartData = localStorage.getItem('localCart')
    if (cartData) {
      this.cartItems = JSON.parse(cartData).length
    }
    this.product.cartData.subscribe((items) => {
      this.cartItems = items.length
    })
  }

  menuTypeFun() {
    this.router.events.subscribe((value: any) => {
      if (value.url) {
        // console.warn((value.url));
        if (localStorage.getItem('loggedSeller') && value.url.includes('seller')) {
          let sellerStore = localStorage.getItem('loggedSeller');
          let storageSellerData = sellerStore && JSON.parse(sellerStore)[0];
          this.sellerName = storageSellerData.name;
          this.menuType = 'seller'
        } else if (value.url.includes('sell-auth')) {
          this.menuType = 'sellerlogin'
        } else if (localStorage.getItem('loggedUser')) {
          let userStore = localStorage.getItem('loggedUser');
          let storageUserData = userStore && JSON.parse(userStore)[0];
          this.userName = storageUserData.name;
          this.menuType = 'user';
          this.product.getCartList(storageUserData.id)
        }
        else {
          this.menuType = 'default'
        }
      }
    })

  }

  onLogout() {
    localStorage.removeItem('loggedSeller')
    this.router.navigate(['/'])
  }

  onLogoutUser() {
    localStorage.removeItem('loggedUser')
    this.router.navigate(['/user-auth'])
  }

  serarchProduct(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;
      this.product.searchProduct(element.value).subscribe((res) => {
        this.searchResult = res;
      })
    }
  }

  hideSearchMenu() {
    this.searchResult = undefined;
  }

  onSubmitSearch(value: string) {
    // console.log(value)
    // this.router.navigate([`/search/${value}`])
    if (value) {
      this.router.navigate([`search`], { queryParams: { q: value } });
    }
  }

  redirectToDetails(id: number) {
    this.router.navigate(['/details/' + id])
  }
}
