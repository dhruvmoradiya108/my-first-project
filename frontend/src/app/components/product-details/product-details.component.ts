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

  // ngOnInit(): void {
  //   let productId = this.activateRoute.snapshot.paramMap.get('productId')
  //   console.log(productId);
  //   productId && this.product.getProduct(productId).subscribe((res) => {
  //     console.log(res);
  //     this.productData = res;
  //     let cartData = localStorage.getItem('localCart')
  //     if (productId && cartData) {
  //       let items = JSON.parse(cartData);
  //       items = items.filter((item: product) => productId === item.id.toString());
  //       // console.log("items", items);
  //       if (items.length) {
  //         this.removeCart = true;
  //       } else {
  //         this.removeCart = false
  //       }
  //     }

  //     let user = localStorage.getItem('loggedUser');
  //     if (user) {
  //       let userId = user && JSON.parse(user)[0].id;
  //       this.product.getCartList(userId);

  //       this.product.cartData.subscribe((res) => {
  //         let item = res.filter((item: product) => productId?.toString() === item.productId?.toString())

  //         if (item.length) {
  //           this.cartData = item[0]
  //           this.removeCart = true;
  //         }
  //       })
  //     }
  //   })
  // }

  ngOnInit(): void {
    let productId = this.activateRoute.snapshot.paramMap.get('productId');
    // console.log(productId);

    if (productId) {
      this.product.getProduct(productId).subscribe((res) => {
        if (res) {
          this.productData = res;
          // console.log('Product Data:', this.productData);

          // Handling local cart data
          let cartData = localStorage.getItem('localCart');
          if (cartData) {
            let items = JSON.parse(cartData);
            items = items.filter((item: product) => item.id?.toString() === productId);
            if (items.length) {
              this.removeCart = true;
            } else {
              this.removeCart = false;
            }
          }

          // Handling logged in user and cart data
          let user = localStorage.getItem('loggedUser');
          if (user) {
            let userId = JSON.parse(user)?.id;
            if (userId) {
              this.product.getCartList(userId);
              this.product.cartData.subscribe((cartItems) => {
                let item = cartItems.find((cartItem: product) => cartItem.productId?.toString() === productId);
                if (item) {
                  this.cartData = item;
                  this.removeCart = true;
                }
              });
            }
          }
        } else {
          console.error('Product not found');
        }
      });
    } else {
      console.error('Invalid product ID');
    }
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

      const loggedUser = localStorage.getItem('loggedUser');

      if (!loggedUser) {
        this.product.localAddToCart(this.productData);
        this.removeCart = true;
      } else {
        const user = JSON.parse(loggedUser);
        const userId = user?.id;

        if (userId) {
          const cartData: cart = {
            userId: userId,
            productId: this.productData.id,
            name: this.productData.name,
            price: this.productData.price,
            image: this.productData.image,
            quantity: this.productQuantity
          };

          this.product.addToCart(cartData).subscribe({
            next: (res) => {
              console.log("Product added to cart:", res);
              this.product.getCartList(userId);
              this.removeCart = true;
            },
            error: (err) => {
              if (err.error.text === 'Item added to cart') {
                console.log("Product added to cart successfully.");
                this.product.getCartList(userId);
                this.removeCart = true;
              } else {
                console.error("Error adding product to cart:", err);
              }
            }
          });

        } else {
          console.error('User ID not found in localStorage');
        }
      }
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


  // onRemoveFromCart(productId: number) {
  //   if (!localStorage.getItem('loggedUser')) {
  //     this.product.localRemoveFromCart(productId);
  //   } else {
  //     this.cartData && this.product.removeToCart(this.cartData.id).subscribe({
  //       next: (res) => {
  //         console.log("Response from server:", res);
  //         let user = localStorage.getItem('loggedUser');
  //         let userId = user && JSON.parse(user)[0].id;
  //         this.product.getCartList(userId);
  //       },
  //       error: (err) => {
  //         console.error("Error removing product from cart:", err);
  //       }
  //     });
  //   }
  // }
}



