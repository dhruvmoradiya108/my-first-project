import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { product } from '../../../data-type';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  activeRoute = inject(ActivatedRoute)
  product = inject(ProductService)
  searchResult : product[] | undefined;
  query : string = '';

  ngOnInit(): void {
    // let query = this.activeRoute.snapshot.paramMap.get('query')
    // console.log(query);
    // query && this.product.searchProduct(query).subscribe((res) => {
    //   this.searchResult = res;    
    // })
    this.activeRoute.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      this.loadSearchResults();
    });
  }

  loadSearchResults(): void {
    if (this.query) {
      this.product.searchProduct(this.query).subscribe((res) => {
        this.searchResult = res.filter(product => product.category.toLowerCase() === this.query.toLowerCase());
      });
    }
  }
}
