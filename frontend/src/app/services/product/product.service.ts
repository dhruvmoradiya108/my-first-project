import { EventEmitter, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { cart, order, product } from '../../../data-type';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http = inject(HttpClient);
  cartData = new EventEmitter<product[] | []>();
  private cartDataSubject = new BehaviorSubject<cart[]>([]);
  public cartAddData = this.cartDataSubject.asObservable();

  private apiUrl = 'http://localhost:5000';

  constructor() {
    this.loadInitialCartData();
  }

  addProduct(data: product) {
    return this.http.post(`${this.apiUrl}/products`, data, { withCredentials: true });
  }

  productList() {
    return this.http.get<product[]>(`${this.apiUrl}/products`,  { withCredentials: true });
  }

  productDelete(id: number) {
    return this.http.delete(`${this.apiUrl}/products/${id}`, { withCredentials: true });
  }

  getProduct(id: string) {
    return this.http.get<product>(`${this.apiUrl}/products/${id}`, { withCredentials: true });
  }

  updateProduct(product: product) {
    return this.http.put<product>(
      `${this.apiUrl}/products/${product.id}`,
      product, { withCredentials: true }
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
      `${this.apiUrl}/products?search=${query}`, { withCredentials: true }
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

  loadInitialCartData() {
    const user = localStorage.getItem('loggedUser');
    if (user) {
      const userId = JSON.parse(user).id;
      this.updateCartData(userId);
    }
  }

  addToCart(cartData: cart): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart`, cartData).pipe(
      tap(() => this.updateCartData(cartData.userId))
    );
  }

  removeToCart(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/${cartItemId}`, { withCredentials: true }).pipe(
      tap(() => {
        const user = localStorage.getItem('loggedUser');
        if (user) {
          const userId = JSON.parse(user).id;
          this.updateCartData(userId);
        }
      })
    );
  }

  getCartList(userId: number): Observable<cart[]> {
    return this.http.get<cart[]>(`${this.apiUrl}/cart?userId=${userId}`).pipe(
      tap((cartItems) => this.cartDataSubject.next(cartItems)),
      catchError(error => {
        console.error('Error fetching cart list:', error);
        return throwError(() => new Error('Error fetching cart list'));
      })
    );
  }

  private updateCartData(userId: number): void {
    this.getCartList(userId).subscribe(cartItems => {
      this.cartDataSubject.next(cartItems);
    });
  }

  currentCart(): Observable<cart[]> {
    const user = localStorage.getItem('loggedUser');
    if (user) {
      const userId = JSON.parse(user).id;
      return this.http.get<cart[]>(`${this.apiUrl}/cart?userId=${userId}`).pipe(
        map(cartItems => {
          console.log('Raw cart items from API:', cartItems);
          return cartItems.map(item => {
            if (!item.id) {
              console.warn('Item without ID found in cart:', item);
            }
            return item;
          });
        }),
        catchError(error => {
          console.error('Error fetching cart data:', error);
          return throwError(() => new Error('Failed to fetch cart data.'));
        })
      );
    } else {
      console.warn('No user logged in, returning empty cart.');
      return new BehaviorSubject<cart[]>([]).asObservable(); // Return an empty array if no user is logged in
    }
  }

  onPlaceOrder(data: order): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/orders`, data).pipe(
      catchError(error => {
        console.error('Order placement failed:', error);
        return throwError(() => new Error('Order placement failed'));
      })
    );
  }


  orderList(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders?userId=${userId}`);
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/orders/${orderId}`);
  }
  
  deleteCartItems(cartId: number) {
    return this.http
      .delete(`${this.apiUrl}/cart/` + cartId)
      .subscribe((res) => {
        this.cartData.emit([]);
      });
  }

  // cancelOrder(orderId: number) {
  //   return this.http.delete(`${this.apiUrl}/orders/${orderId}`);
  // }
}
