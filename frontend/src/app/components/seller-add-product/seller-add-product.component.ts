import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { product } from '../../../data-type';
import { Router } from '@angular/router';
import { SellerService } from '../../services/seller/seller.service';

@Component({
  selector: 'app-seller-add-product',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './seller-add-product.component.html',
  styleUrl: './seller-add-product.component.css'
})
export class SellerAddProductComponent implements OnInit {

  addProductMessage: string | undefined;
  product = inject(ProductService)
  router = inject(Router)
  sellerService = inject(SellerService)
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

  ngOnInit(): void {
      this.sellerService.isLoggedIn.subscribe((loggedIn : boolean) => {
        if(!loggedIn){
          this.router.navigate(['/sell-auth'])
        }
      })
  }

  onSubmitAddProductForm(data: product) {
    const sellerData = JSON.parse(localStorage.getItem('loggedSeller')!);

    if (sellerData) {
      data.sellerId = sellerData.id;
      data.sellerName = sellerData.name;

      this.product.addProduct(data).subscribe(
        (result: any) => {
          // console.log(result);
          this.addProductMessage = "Product added successfully."
          this.router.navigate(['seller-home']);
        },
        (error) => {
          console.error('Error adding product:', error);
          this.addProductMessage = "Failed to add product.";
        }
      );
    } else {
      console.error('No seller logged in.');
      this.router.navigate(['/login'])
    }
  }
}
