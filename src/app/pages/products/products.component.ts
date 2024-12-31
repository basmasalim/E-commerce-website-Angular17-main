import { Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { MainProductsComponent } from '../../component/main-products/main-products.component';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/interfaces/product';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { FilterCategoryPipe } from '../../core/pipes/filter-category.pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MainProductsComponent, FormsModule, FilterCategoryPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private readonly _ProductsService = inject(ProductsService);
  private readonly _Renderer2 = inject(Renderer2)

  @ViewChild('categories') categories!: ElementRef;

  productList: Product[] = [];
  StockStatusList: string[] = [];

  searchInput: string = '';
  selectedCategoryName: any = '';


  getAllProductSub!: Subscription;

  ngOnInit(): void {
    this.displayAllProducts()
  }

  displayAllProducts(): void {
    this.getAllProductSub = this._ProductsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList = res.data
        this.setStockStatusBasedOnQuantity();
      }
    });
  }


  ngOnDestroy(): void {
    this.getAllProductSub?.unsubscribe()
  }

  setStockStatusBasedOnQuantity(): void {
    this.StockStatusList = this.productList.map(product =>
      (product.quantity ?? 0) > 0 ? 'In Stock' : 'Out Of Stock'
    );
  }


  filterCategory(event: any): void {
    this.selectedCategoryName = event.innerHTML.toLowerCase();

    if (this.selectedCategoryName === 'all') {
      this.selectedCategoryName = '';
    }

    const liElements = this.categories.nativeElement.querySelectorAll('ul li');
    liElements.forEach((li: HTMLElement) => {
      this._Renderer2.removeClass(li, 'active');
    });
    this._Renderer2.addClass(event, 'active');
  }

}
