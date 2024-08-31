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
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  product = inject(ProductService)
  router = inject(Router)
  cartData: cart[] | undefined
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  }
  orderMsg: string | undefined;


  ngOnInit(): void {
    this.product.currentCart().subscribe((res) => {
      this.cartData = res;
      // console.warn(this.cartData);
      let price = 0;
      res.forEach((item) => {
        if (item.quantity) {
          price = price + (+item.price * +item.quantity)
          //Using this "(+item.price)" we are convert string to the number
        }
      })
      this.priceSummary.price = price;
      this.priceSummary.discount = price * 10 / 100;
      this.priceSummary.delivery = 100;
      this.priceSummary.tax = price * 5 / 100;
      this.priceSummary.total = price + (price * 5 / 100) + 100 - (price * 10 / 100);
      console.warn(this.priceSummary);

    })
  }

  onPlaceOrder(data: orderUserInformation) {
    console.log(data)
    let user = localStorage.getItem('loggedUser');
    let userId = user && JSON.parse(user)[0].id;

    if (this.priceSummary) {
      let orderData: order = {
        ...data,
        priceSummary: this.priceSummary.total,
        userId,
        id: undefined
      }

      this.cartData?.forEach((item) => {
        setTimeout(()=> {
          item.id && this.product.deleteCartItems(item.id)
        }, 700)
      })

      this.product.onPlaceOrder(orderData).subscribe((result) => {
        if (result) {
          this.orderMsg = "Order has been placed";
          setTimeout(() => {
            this.orderMsg = undefined;
            this.router.navigate(['/my-orders'])
          }, 4000);
        }
      })
    }
  }

}
