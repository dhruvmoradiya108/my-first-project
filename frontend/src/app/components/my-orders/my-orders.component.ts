// import { Component, inject, OnInit } from '@angular/core';
// import { ProductService } from '../../services/product/product.service';
// import { order } from '../../../data-type';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-my-orders',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './my-orders.component.html',
//   styleUrl: './my-orders.component.css'
// })
// export class MyOrdersComponent implements OnInit {

//   product = inject(ProductService)
//   orderedData: order[] | undefined
//   orders: order[] | undefined;

//   ngOnInit(): void {
//     this.getOrderList();
//   }

//   cancelOrder(orderId: number | undefined) {
//     orderId && this.product.cancelOrder(orderId).subscribe((res) => {
//       if (res) {
//         this.getOrderList();
//       }
//     })
//   }

//   getOrderList() {
//     let user = localStorage.getItem('loggedUser');
//     let userId: number | undefined;

//     if (user) {
//       try {
//         let parsedUser = JSON.parse(user);
//         userId = parsedUser.id; 
//         console.error(userId)
//       } catch (e) {
//         console.error('Error parsing user from localStorage:', e);
//       }
//     }

//     if (!userId) {
//       console.error('User ID is undefined. Cannot fetch orders.');
//       return;
//     }

//     this.product.orderList(userId).subscribe(
//       (orders) => {
//         this.orders = orders;
//       },
//       (error) => {
//         console.error('Failed to fetch order list:', error);
//       }
//     );

//   }
// }


import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { order } from '../../../data-type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit {

  product = inject(ProductService);
  orderedData: order[] | undefined; // Use this variable to hold orders

  ngOnInit(): void {
    this.getOrderList();
  }

  cancelOrder(orderId: number | undefined) {
    orderId && this.product.cancelOrder(orderId).subscribe((res) => {
      if (res) {
        this.getOrderList();
      }
    });
  }

  getOrderList() {
    let user = localStorage.getItem('loggedUser');
    let userId: number | undefined;

    if (user) {
      try {
        let parsedUser = JSON.parse(user);
        userId = parsedUser.id; 
        console.error(userId)
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }

    if (!userId) {
      console.error('User ID is undefined. Cannot fetch orders.');
      return;
    }

    this.product.orderList(userId).subscribe(
      (orders) => {
        this.orderedData = orders; // Assign orders to orderedData
      },
      (error) => {
        console.error('Failed to fetch order list:', error);
      }
    );
  }
}
