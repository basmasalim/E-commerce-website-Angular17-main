import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist.service';
import { Subscription } from 'rxjs';
import { Product } from '../../core/interfaces/product';
import { MainProductsComponent } from '../../component/main-products/main-products.component';
import { ToastrService } from 'ngx-toastr';
import { EmptyPageComponent } from '../../component/empty-page/empty-page.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [MainProductsComponent, EmptyPageComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit, OnDestroy {

  private readonly _WishlistService = inject(WishlistService);
  private readonly _ToastrService = inject(ToastrService);

  getProductsWishlistSub!: Subscription;
  wishlistData: Product[] = [];
  StockStatusList: string[] = [];
  productList: Product[] = [];

  ngOnInit(): void {
    this.getProductsWishlistSub = this._WishlistService.getProductsWishlist().subscribe({
      next: (res) => {
        if (res.status === "success") {
          this.wishlistData = res.data
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.getProductsWishlistSub?.unsubscribe()
  }

  setStockStatusBasedOnQuantity(): void {
    this.StockStatusList = this.productList.map(product =>
      (product.quantity ?? 0) > 0 ? 'In Stock' : 'Out Of Stock'
    );
  }

  removeFav(id: string): void {
    this._WishlistService.removeProductsWishlist(id).subscribe({
      next: (res) => {
        if (res.status === "success") {
          this._ToastrService.error(`💔${res.message}`);
          this.wishlistData = res.data
          const newProductsData = this.productList.filter((item: any) => this.wishlistData.includes(item._id))
          this.productList = newProductsData
        }
      }
    })
  }

  getFav(): void {
    this._WishlistService.getProductsWishlist().subscribe({
      next: (res) => {
        const newData = res.data.map((item: any) => item._id)
        this.wishlistData = newData
      }
    })
  }
}
