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
  

  ngOnInit(): void {
    this.loadDetails();
  }

  removeToCart(cartId: number | undefined) {
    cartId && this.cartData && this.product.removeToCart(cartId)
      .subscribe((res) => {
        this.loadDetails();
      })
  }

  onCheckout() {
    this.router.navigate(['/checkout'])
  }

  loadDetails(){
    this.product.currentCart().subscribe((res) => {
      this.cartData = res;
      console.warn(this.cartData);
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

    if(!this.cartData.length){
      this.router.navigate(['/'])
    }

    })
  }

  
}
