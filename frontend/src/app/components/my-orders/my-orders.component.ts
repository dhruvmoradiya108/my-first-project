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

  product = inject(ProductService)
  orderedData : order[] | undefined

  ngOnInit(): void {
      this.getOrderList();
  }

  cancelOrder(orderId: number|undefined){
    orderId && this.product.cancelOrder(orderId).subscribe((res) => {
      if(res){
        this.getOrderList();
      }
    })
  }

  getOrderList(){
    this.product.orderList().subscribe((res) => {
      this.orderedData = res
    })
  }

}
