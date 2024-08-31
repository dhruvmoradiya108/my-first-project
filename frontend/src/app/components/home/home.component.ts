import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { product } from '../../../data-type';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  product = inject(ProductService)
  popularProductsProp!: product[] | [];

  trendyProducts : product[] | undefined;
  currentSlide: number = 0;
  slideInterval: any;

  ngOnInit(): void {
    this.fetchHeaderData();
    this.trendyProductData();
  }


  trendyProductData() {
    this.product.trendyProduct().subscribe((res) => {
      this.trendyProducts = res;
    })
  }

  fetchHeaderData(): void {
    this.product.popularProduct().subscribe((res) => {
      this.popularProductsProp = res;
    })
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000)
  }

  nextSlide(): void {
    if (this.currentSlide < this.popularProductsProp.length - 1) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0;
    }
  }

  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    } else {
      this.currentSlide = this.popularProductsProp.length - 1;
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.slideInterval);
  }
}
