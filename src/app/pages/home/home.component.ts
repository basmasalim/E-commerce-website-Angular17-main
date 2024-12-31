import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/interfaces/product';
import { Subscription } from 'rxjs';
import { MainProductsComponent } from '../../component/main-products/main-products.component';
import { CategoriesService } from '../../core/services/categories.service';
import { Categories } from '../../core/interfaces/categories';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MainProductsComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CategoriesService = inject(CategoriesService);

  productList: Product[] = [];
  categoryList: Categories[] = [];
  StockStatusList: string[] = [];

  mainSlider: string[] = [
    'assets/images/clothes-1.jpg',
    'assets/images/clothes-2.jpg',
    'assets/images/clothes-3.jpg',
  ]

  getAllProductSub!: Subscription;
  getAllCategoriesSub!: Subscription;

  ngOnInit(): void {
    // getAllProductSub
    this.getAllProductSub = this._ProductsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList = res.data
        this.setStockStatusBasedOnQuantity();
      }
    })
    // getAllCategories
    this._CategoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoryList = res.data
      }
    })
  }

  ngOnDestroy(): void {
    this.getAllProductSub?.unsubscribe()
    this.getAllCategoriesSub?.unsubscribe()
  }

  setStockStatusBasedOnQuantity(): void {
    this.StockStatusList = this.productList.map(product =>
      (product.quantity ?? 0) > 0 ? 'In Stock' : 'Out Of Stock'
    );
  }


  // swiper breakpoints
  breakpoints = {
    0: {
      slidesPerView: 2
    },
    400: {
      slidesPerView: 3
    },
    740: {
      slidesPerView: 4
    },
    950: {
      slidesPerView: 5
    },
    1200: {
      slidesPerView: 9
    }
  };
}
