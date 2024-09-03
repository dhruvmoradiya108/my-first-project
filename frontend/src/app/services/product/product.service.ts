// import { EventEmitter, inject, Injectable } from '@angular/core';
// import { cart, order, product } from '../../../data-type';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductService {

//   http = inject(HttpClient)
//   cartData = new EventEmitter<product[] | []>()


//   constructor() { }


//   addProduct(data: product) {
//     return this.http.post('http://localhost:3000/products', data)
//   }

//   productList() {
//     return this.http.get<product[]>('http://localhost:3000/products')
//   }

//   productDelete(id: number) {
//     return this.http.delete(`http://localhost:3000/products/${id}`)
//   }

//   getProduct(id: string) {
//     return this.http.get<product>(`http://localhost:3000/products/${id}`)
//   }

//   updateProduct(product: product) {
//     return this.http.put<product>(`http://localhost:3000/products/${product.id}`, product)
//   }

//   popularProduct() {
//     return this.http.get<product[]>('http://localhost:3000/products?_limit=3')
//   }

//   trendyProduct() {
//     return this.http.get<product[]>('http://localhost:3000/products?_limit=9')
//   }

//   searchProduct(query: string) {
//     return this.http.get<product[]>(`http://localhost:3000/products`)
//   }

//   localAddToCart(data: product) {
//     let cartData = [];
//     let localCart = localStorage.getItem('localCart');
//     if (!localCart) {
//       localStorage.setItem('localCart', JSON.stringify([data]));
//     } else {
//       // console.log("You already have data");
//       cartData = JSON.parse(localCart)
//       cartData.push(data)
//       localStorage.setItem('localCart', JSON.stringify(cartData));
//       this.cartData.emit(cartData)
//     }
//   }

//   localRemoveFromCart(productId: number) {
//     let cartData = localStorage.getItem('localCart')
//     if (cartData) {
//       let items: product[] = JSON.parse(cartData)
//       items = items.filter((item: product) => productId !== item.id)
//       localStorage.setItem('localCart', JSON.stringify(items))
//       this.cartData.emit(items);
//     }
//   }

//   addToCart(cartData: cart) {
//     return this.http.post('http://localhost:3000/cart', cartData)
//   }

//   getCartList(userId: number) {
//     return this.http.get<product[]>('http://localhost:3000/cart?userId=' + userId, {
//       observe: 'response'
//     }).subscribe((res) => {
//       if (res && res.body) {
//         this.cartData.emit(res.body)
//       }
//     })
//   }

//   removeToCart(cartId: number) {
//     return this.http.delete('http://localhost:3000/cart/' + cartId)
//   }

//   currentCart() {
//     let userStore = localStorage.getItem('loggedUser');
//     let storageUserData = userStore && JSON.parse(userStore)[0];
//     return this.http.get<cart[]>('http://localhost:3000/cart?userId=' + storageUserData.id)
//   }

//   onPlaceOrder(data: order) {
//     return this.http.post('http://localhost:3000/orders', data);
//   }

//   orderList() {
//     let userStore = localStorage.getItem('loggedUser');
//     let storageUserData = userStore && JSON.parse(userStore)[0];
//     return this.http.get<order[]>('http://localhost:3000/orders?userId=' + storageUserData.id)
//   }

//   deleteCartItems(cartId:number){
//     return this.http.delete('http://localhost:3000/cart/' + cartId).subscribe((res) => {
//       this.cartData.emit([])
//     })
//   }

//   cancelOrder(orderId:number){
//     return this.http.delete('http://localhost:3000/orders/' + orderId)
//   }
// }

import { EventEmitter, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { cart, order, product } from '../../../data-type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http = inject(HttpClient);
  cartData = new EventEmitter<product[] | []>();

  private apiUrl = 'http://localhost:5000';

  addProduct(data: product) {
    return this.http.post(`${this.apiUrl}/products`, data);
  }

  productList() {
    return this.http.get<product[]>(`${this.apiUrl}/products`);
  }

  productDelete(id: number) {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }

  getProduct(id: string) {
    return this.http.get<product>(`${this.apiUrl}/products/${id}`);
  }

  updateProduct(product: product) {
    return this.http.put<product>(
      `${this.apiUrl}/products/${product.id}`,
      product
    );
  }

  popularProduct() {
    return this.http.get<product[]>(`${this.apiUrl}/products?_limit=8`);
  }

  trendyProduct() {
    return this.http.get<product[]>(`${this.apiUrl}/products?_limit=9`);
  }

  searchProduct(query: string) {
    return this.http.get<product[]>(
      `${this.apiUrl}/products?search=${query}`
    );
  }

  localAddToCart(data: product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
    } else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
  }

  localRemoveFromCart(productId: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: product[] = JSON.parse(cartData);
      items = items.filter((item: product) => productId !== item.id);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.emit(items);
    }
  }

  addToCart(cartData: cart) {
    return this.http.post(`${this.apiUrl}/cart`, cartData);
  }

  getCartList(userId: number) {
    return this.http
      .get<product[]>(`${this.apiUrl}/cart?userId=` + userId, {
        observe: 'response',
      })
      .subscribe((res) => {
        if (res && res.body) {
          this.cartData.emit(res.body);
        }
      });
  }

  removeToCart(cartId: number) {
    return this.http.delete(`${this.apiUrl}/cart/${cartId}`);
  }

  currentCart() {
    let userStore = localStorage.getItem('loggedUser');
    let storageUserData = userStore && JSON.parse(userStore)[0];
    return this.http.get<cart[]>(
      `${this.apiUrl}/cart?userId=` + storageUserData.id
    );
  }

  onPlaceOrder(data: order) {
    return this.http.post(`${this.apiUrl}/orders`, data);
  }

  orderList() {
    let userStore = localStorage.getItem('loggedUser');
    let storageUserData = userStore && JSON.parse(userStore)[0];
    return this.http.get<order[]>(
      `${this.apiUrl}/orders?userId=` + storageUserData.id
    );
  }

  deleteCartItems(cartId: number) {
    return this.http
      .delete(`${this.apiUrl}/cart/` + cartId)
      .subscribe((res) => {
        this.cartData.emit([]);
      });
  }

  cancelOrder(orderId: number) {
    return this.http.delete(`${this.apiUrl}/orders/${orderId}`);
  }
}
