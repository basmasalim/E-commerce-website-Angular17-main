import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MainProductsComponent } from '../main-products/main-products.component';
import { FilterCategoryPipe } from '../../core/pipes/filter-category.pipe';
import { Product } from '../../core/interfaces/product';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from '../../core/services/categories.service';
import { Categories } from '../../core/interfaces/categories';
import { ProductsService } from '../../core/services/products.service';
import { Subscription } from 'rxjs';
import { EmptyPageComponent } from '../empty-page/empty-page.component';

@Component({
  selector: 'app-specific-category',
  standalone: true,
  imports: [MainProductsComponent, FilterCategoryPipe, EmptyPageComponent],
  templateUrl: './specific-category.component.html',
  styleUrl: './specific-category.component.scss'
})
export class SpecificCategoryComponent implements OnInit, OnDestroy {
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _CategoriesService = inject(CategoriesService);
  private readonly _ProductsService = inject(ProductsService);

  productList: Product[] = [];
  StockStatusList: string[] = [];

  searchInput: string = '';
  specificCategory: Categories = {} as Categories;

  displaySpcificCategorySub!: Subscription;
  displayProductSub!: Subscription;

  ngOnInit(): void {
    this.getIdSpicficCategory()
    this.displayProduct()
  }

  ngOnDestroy(): void {
    this.displaySpcificCategorySub?.unsubscribe()
    this.displayProductSub?.unsubscribe()
  }

  getIdSpicficCategory(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (p) => {
        const id: string | null = p.get('id')
        this.displaySpcificCategory(id);
      },
    });
  }

  displaySpcificCategory(id: string | null): void {
    this.displaySpcificCategorySub = this._CategoriesService.getSpecificCategories(id).subscribe({
      next: (res) => {
        this.specificCategory = res.data
      }
    })
  }

  displayProduct(): void {
    this.displayProductSub = this._ProductsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList = res.data
        console.log(res.data);
      }
    })
  }

  setStockStatusBasedOnQuantity(): void {
    this.StockStatusList = this.productList.map(product =>
      (product.quantity ?? 0) > 0 ? 'In Stock' : 'Out Of Stock'
    );
  }


}
