import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { cart, order, orderUserInformation, priceSummary } from '../../../data-type';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

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
  orderMsg: string | undefined;

  ngOnInit(): void {
    this.product.currentCart().subscribe((res) => {
      console.log('Cart data received in ngOnInit:', res); // Log the data received in the component

      if (res && res.length > 0) {
        this.cartData = res.filter(item => item && item.id !== undefined); // Filter out items with undefined id
        console.log('Filtered cart data:', this.cartData); // Log the filtered cart data

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
        this.priceSummary.total = price + (price * 5 / 100) + 100 - (price * 10 / 100);
      } else {
        // Handle the case where the cart is empty or undefined
        this.cartData = [];
        this.priceSummary = {
          price: 0,
          discount: 0,
          tax: 0,
          delivery: 0,
          total: 0
        };
        console.warn('Cart is empty or contains invalid items');
      }
    }, error => {
      console.error('Error fetching cart data:', error);
    });
  }



  onPlaceOrder(data: orderUserInformation) {
    let user = localStorage.getItem('loggedUser');
    let userId: number | undefined;
    if (user) {
      let parsedUser = JSON.parse(user);
      userId = parsedUser && parsedUser[0] ? parsedUser[0].id : undefined;
    }

    if (userId === undefined) {
      this.orderMsg = "User is not logged in. Please log in to place an order.";
      return;
    }

    if (this.priceSummary) {
      let orderData: order = {
        ...data,
        priceSummary: this.priceSummary.total,
        userId,
        id: undefined
      };

      if (this.cartData) {
        this.cartData.forEach((item: any) => {
          if (item.id) {
            setTimeout(() => {
              this.product.deleteCartItems(item.id).unsubscribe(); // Ensure you handle the observable
            }, 700);
          }
        });
      }

      this.product.onPlaceOrder(orderData).subscribe((result) => {
        if (result) {
          this.orderMsg = "Order has been placed";
          setTimeout(() => {
            this.orderMsg = undefined;
            this.router.navigate(['/my-orders']);
          }, 4000);
        }
      });
    }
  }
}
