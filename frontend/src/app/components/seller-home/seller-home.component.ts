import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { product } from '../../../data-type';
import { CommonModule, Location } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faEdit, faPlus, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Router, RouterLink } from '@angular/router';
import { SellerService } from '../../services/seller/seller.service';

@Component({
  selector: 'app-seller-home',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './seller-home.component.html',
  styleUrl: './seller-home.component.css',
})
export class SellerHomeComponent {
  productList: product[] | undefined;
  productService = inject(ProductService);
  sellerService = inject(SellerService);
  router = inject(Router);
  faTrash = faTrash;
  faEdit = faEdit;
  faPlus = faPlus;
  faArrowRight = faArrowRight;
  productMessage: string | undefined;

  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  limit: number = 5;

  location = inject(Location);

  ngOnInit(): void {
    // Fetch products for the first page
    this.getProducts(this.currentPage);

    // Check if the seller is logged in
    this.sellerService.isLoggedIn.subscribe((loggedIn: boolean) => {
      if (!loggedIn) {
        this.router.navigate(['sell-auth']);
      }
    });
  }

  // Fetch products with pagination
  getProducts(page: number): void {
    this.productService.getProducts(page, this.limit).subscribe((data) => {
      this.productList = data.products;
      this.currentPage = data.currentPage;
      this.totalPages = data.totalPages;
      this.totalItems = data.totalItems;
    });
  }

  // Handle product deletion
  onDelete(id: number): void {
    const isConfirmed = confirm('Are you sure you want to delete?');
    if (isConfirmed) {
      this.productService.productDelete(id).subscribe(
        (res: any) => {
          if (res && res.success) {
            this.productMessage = 'Product deleted successfully.';
            this.getProducts(this.currentPage); // Reload products for the current page
            setTimeout(() => {
              this.productMessage = undefined;
            }, 3000);
          } else {
            this.productMessage = 'Failed to delete the product.';
          }
        },
        (error) => {
          this.productMessage = 'An error occurred while deleting the product.';
        }
      );
    }
  }

  // Handle pagination click
  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.getProducts(page);
    }
  }
}

