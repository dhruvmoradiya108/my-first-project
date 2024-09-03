import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { product } from '../../../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-add-product',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './seller-add-product.component.html',
  styleUrl: './seller-add-product.component.css'
})
export class SellerAddProductComponent {

  addProductMessage: string | undefined;
  product = inject(ProductService)
  router = inject(Router)

  // onSubmitAddProductForm(data : product) {
  //   this.product.addProduct(data).subscribe((result : any) => {
  //     console.log(result)
  //     if(result){
  //       this.addProductMessage = "Product is added successfully."
  //     }
  //   })
  //   setTimeout (() => {
  //     this.addProductMessage = undefined
  //   }, 3000); 
  // }

  onSubmitAddProductForm(data: product) {
    const seller = localStorage.getItem('loggedSeller');
    const sellerData = seller && JSON.parse(seller);

    if (sellerData) {
      data.sellerId = sellerData.id;
      data.sellerName = sellerData.name;
    }

    this.product.addProduct(data).subscribe({
      next: (result: any) => {
        console.log(result);
        this.addProductMessage = "Product added successfully."
        this.router.navigate(['seller-home']);
      },
      error: (error) => {
        console.error('Error adding product:', error);
        this.addProductMessage = "Failed to add product.";
      }
    });

    setTimeout(() => {
      this.addProductMessage = undefined;
    }, 3000);
  }
}
