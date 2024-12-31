import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { Brand, Product } from '../../core/interfaces/product';
import { BrandsService } from '../../core/services/brands.service';
import { Subscription } from 'rxjs';
import { MainProductsComponent } from '../main-products/main-products.component';
import { FilterBrandsPipe } from '../../core/pipes/filter-brands.pipe';
import { EmptyPageComponent } from '../empty-page/empty-page.component';

@Component({
  selector: 'app-specific-brand',
  standalone: true,
  imports: [MainProductsComponent, FilterBrandsPipe, EmptyPageComponent],
  templateUrl: './specific-brand.component.html',
  styleUrl: './specific-brand.component.scss'
})
export class SpecificBrandComponent implements OnInit, OnDestroy {
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _BrandsService = inject(BrandsService);
  private readonly _ProductsService = inject(ProductsService);

  productList: Product[] = [];
  StockStatusList: string[] = [];

  searchInput: string = '';
  specificBrands: Brand = {} as Brand;

  displaySpcificBrandSub!: Subscription;
  displayProductSub!: Subscription;

  ngOnInit(): void {
    this.getIdSpicficBrand();
    this.displayProduct()
  }
  ngOnDestroy(): void {
    this.displaySpcificBrandSub?.unsubscribe()
    this.displayProductSub?.unsubscribe()
  }
  getIdSpicficBrand(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (p) => {
        const id: string | null = p.get('id')
        this.displaySpcificBrand(id)
      }
    })
  }

  displaySpcificBrand(id: string | null): void {
    this.displaySpcificBrandSub = this._BrandsService.getSpecificBrands(id).subscribe({
      next: (res) => {
        this.specificBrands = res.data
      }
    })
  }


  displayProduct(): void {
    this.displayProductSub = this._ProductsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList = res.data
      }
    })
  }

  setStockStatusBasedOnQuantity(): void {
    this.StockStatusList = this.productList.map(product =>
      (product.quantity ?? 0) > 0 ? 'In Stock' : 'Out Of Stock'
    );
  }
}
