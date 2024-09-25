
import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { cart, priceSummary } from '../../../data-type';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent implements OnInit {

  product = inject(ProductService);
  router = inject(Router);
  cartData: cart[] | undefined;
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  };

  ngOnInit(): void {
    this.loadDetails();
  }

  removeToCart(cartId: number | undefined) {
    if (cartId) {
      this.product.removeToCart(cartId).subscribe((res) => {
        this.loadDetails();
      });
    }
  }

  onCheckout() {
    this.router.navigate(['/checkout']);
  }

  loadDetails() {
    const user = localStorage.getItem('loggedUser');
    if (user) {
      const userId = JSON.parse(user).id;
      this.product.getCartList(userId).subscribe({
        next: (res) => {
          this.cartData = res;

          let price = 0;
          this.cartData.forEach((item) => {
            if (item.quantity) {
              price += (+item.price * +item.quantity);
            }
          });
          this.priceSummary.price = price;
          this.priceSummary.discount = price * 10 / 100;
          this.priceSummary.delivery = 100;
          this.priceSummary.tax = price * 5 / 100;
          this.priceSummary.total = price + this.priceSummary.tax + this.priceSummary.delivery - this.priceSummary.discount;

          if (!this.cartData.length) {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          console.error('Error loading cart details:', err);
        }
      });
    } else {
      console.error('No user logged in.');
      this.router.navigate(['/']);
    }
  }
}
