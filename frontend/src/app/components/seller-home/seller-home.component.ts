import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { product } from '../../../data-type';
import { CommonModule, Location } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Router, RouterLink } from '@angular/router';
import { SellerService } from '../../services/seller/seller.service';

@Component({
  selector: 'app-seller-home',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './seller-home.component.html',
  styleUrl: './seller-home.component.css'
})
export class SellerHomeComponent {

  productList: undefined | product[];
  product = inject(ProductService)
  sellerService = inject(SellerService)
  router = inject(Router)
  faTrash = faTrash
  faEdit = faEdit
  faPlus = faPlus
  productMessage: string | undefined;

  location = inject(Location)

  ngOnInit(): void {
    this.productListFunction();

    this.sellerService.isLoggedIn.subscribe((loggedIn :boolean) => {
      if(!loggedIn){
        this.router.navigate(['/sell-auth'])
      }
    })
  }
  
  productListFunction() {
    this.product.productList().subscribe((res) => {
      this.productList = res;
    })
  }
  onDelete(id: number) {
    // Show confirmation dialog first
    const isConfirmed = confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      this.product.productDelete(id).subscribe(
        (res: any) => {
          if (res && res.success) {

            this.productMessage = "Product deleted successfully.";
            this.productListFunction();

            setTimeout(() => {
              this.productMessage = undefined;
            }, 3000);
          } else {
            this.productMessage = "Failed to delete the product.";
          }
        },
        (error) => {
          // Handle any errors during the deletion process
          this.productMessage = "An error occurred while deleting the product.";
        }
      );
    }
  }

  
  
}
