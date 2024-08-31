import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { product } from '../../../data-type';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-seller-home',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './seller-home.component.html',
  styleUrl: './seller-home.component.css'
})
export class SellerHomeComponent {

  productList : undefined | product[];
  product = inject(ProductService)
  faTrash = faTrash
  faEdit = faEdit
  faPlus = faPlus
  productMessage : string | undefined;

  ngOnInit(): void {
      this.productListFunction();
  }

  onDelete(id:number){
    this.product.productDelete(id).subscribe((res) => {
      confirm("Are You sure you want to delete?")
      if(res){
        
        this.productMessage = "Product deleted successfully."
      }
      this.productListFunction();
    })

    setTimeout(()=>{
      this.productMessage = undefined;
    }, 3000)
  }

  productListFunction(){
    this.product.productList().subscribe((res) => {
      this.productList = res;
    })
  }
}
