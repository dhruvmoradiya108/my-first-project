import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { cart, product } from '../../../data-type';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  faPlus = faPlus
  faMinus = faMinus
  productQuantity: number = 1;
  activateRoute = inject(ActivatedRoute)
  product = inject(ProductService)
  productData: product | undefined
  removeCart: boolean = false;
  cartData: product | undefined;

  ngOnInit(): void {
    let productId = this.activateRoute.snapshot.paramMap.get('productId')
    // console.log(productId);
    productId && this.product.getProduct(productId).subscribe((res) => {
      // console.log(res);
      this.productData = res;
      let cartData = localStorage.getItem('localCart')
      if (productId && cartData) {
        let items = JSON.parse(cartData);
        items = items.filter((item: product) => productId === item.id.toString());
        // console.log("items", items);
        if (items.length) {
          this.removeCart = true;
        } else {
          this.removeCart = false
        }
      }

      let user = localStorage.getItem('loggedUser');
      if (user) {
        let userId = user && JSON.parse(user)[0].id;
        this.product.getCartList(userId);

        this.product.cartData.subscribe((res) => {
          let item = res.filter((item: product) => productId?.toString() === item.productId?.toString())

          if (item.length) {
            this.cartData = item[0]
            this.removeCart = true;
          }
        })
      }
    })
  }

  handleQuantity(value: string) {
    if (this.productQuantity < 20 && value === 'plus') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && value === 'min') {
      this.productQuantity -= 1;
    }
  }

  onAddToCart() {
    if (this.productData) {
      this.productData.quantity = this.productQuantity;

      if (!localStorage.getItem('loggedUser')) {
        this.product.localAddToCart(this.productData)
        this.removeCart = true;
      } else {
        // this.product.localAddToCart(this.productData)
        let user = localStorage.getItem('loggedUser');
        // console.warn(user);
        let userId = user && JSON.parse(user)[0].id;
        // console.log(userId);
        let cartData: cart = {
          ...this.productData,
          productId: this.productData.id,
          userId
        }
        // console.warn(cartData);
        delete cartData.id;
        this.product.addToCart(cartData).subscribe((res) => {
          if (res) {
            // alert("Product is Added into the cart.")
            this.product.getCartList(userId)
            this.removeCart = true;
          }
        })

      }
      // console.warn(this.productData);
    }
  }

  onRemoveFromCart(productId: number) {
    if (!localStorage.getItem('loggedUser')) {
      this.product.localRemoveFromCart(productId)
    } else {
      this.cartData && this.product.removeToCart(this.cartData.id)
      .subscribe((res) => {
        let user = localStorage.getItem('loggedUser');
        let userId = user && JSON.parse(user)[0].id;
        this.product.getCartList(userId)
      })
    } 
    this.removeCart = false
  }

}
