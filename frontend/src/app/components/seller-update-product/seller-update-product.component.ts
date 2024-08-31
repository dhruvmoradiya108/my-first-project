import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { product } from '../../../data-type';

@Component({
  selector: 'app-seller-update-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-update-product.component.html',
  styleUrl: './seller-update-product.component.css'
})
export class SellerUpdateProductComponent implements OnInit {

  product = inject(ProductService)
  route = inject(ActivatedRoute)
  router = inject(Router)
  productData : undefined | product; // tp populate data in update form automatically
  productMessage : string | undefined;
  ngOnInit(): void {
    let productId = this.route.snapshot.paramMap.get('id')
    console.log(productId);
    productId && this.product.getProduct(productId).subscribe((data) => {
      console.log(data);
      this.productData = data; // the data will be dtored into the "productData"
    })
    
  }

  onSubmitUpdateProductForm(data: any) {
    if (this.productData){
      data.id = this.productData.id;
    }
    this.product.updateProduct(data).subscribe((res)=> {
      if(res){
        this.productMessage = "Data updated successfully, Redirecting you to List..."
      }

    })
    setTimeout(() => {  
      // this.productMessage = undefined
      this.router.navigate(['seller-home'])
    }, 3000)
    // console.log(data)
  }
}
