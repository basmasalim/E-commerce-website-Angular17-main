import { Component, Input, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import { Product } from '../../core/interfaces/product';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Subscription } from 'rxjs';
import { Cart } from '../../core/interfaces/cart';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-main-products',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './main-products.component.html',
  styleUrls: ['./main-products.component.scss'],
})
export class MainProductsComponent implements OnInit, OnDestroy {
  private readonly _CartService = inject(CartService);
  private readonly _Renderer2 = inject(Renderer2);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _WishlistService = inject(WishlistService);

  private subscriptions: Subscription = new Subscription();

  @Input() productList: Product[] = [];
  @Input() stockStatuses: string[] = [];

  cartData: Cart = {} as Cart;

  wishlistData: string[] = []

  ngOnInit(): void {
    this.refreshCartData();
    this.getFav()
  }

  // Check if the product is in the cart
  isProductInCart(id: string): boolean {
    return this.cartData.products?.some(item => item.product._id === id);
  }

  // Get the quantity of the product in the cart
  getProductQuantity(id: string): number {
    return this.cartData.products?.find(product => product.product._id === id)?.count ?? 0;
  }

  // Add product to the cart
  addCart(id: string, el: HTMLButtonElement): void {
    this.toggleButtonState(el, true);
    this.subscriptions.add(
      this._CartService.addProductsToCart(id).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this._CartService.cartNumber.next(res.numOfCartItems);
            this.refreshCartData();
            this._ToastrService.success('Product added to cart');
          }
          this.toggleButtonState(el, false);
        },
        error: (err) => {
          console.error(err);
          this._ToastrService.error('Failed to add product to cart');
          this.toggleButtonState(el, false);
        },
      })
    );
  }

  // Update the product count in the cart
  updateCount(id: string, count: number, el1: HTMLButtonElement, el2: HTMLButtonElement): void {
    const item = this.cartData.products.find(product => product.product._id === id);
    if (item) {
      item.isloadingCount = true;
      this.toggleButtonsLoadingState(el1, el2, true);

      this.subscriptions.add(
        this._CartService.updateProductsCart(id, count).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              this._CartService.cartNumber.next(res.numOfCartItems);
              this.cartData = res.data;
              item.isloadingCount = false;
            }
            this.toggleButtonsLoadingState(el1, el2, false);
          },
          error: (err) => {
            this._ToastrService.error('Failed to update product quantity', 'Error');
            this.toggleButtonsLoadingState(el1, el2, false);
            item.isloadingCount = false;
          },
        })
      );

    }


  }

  // Toggle button loading state
  toggleButtonState(el: HTMLButtonElement, isLoading: boolean): void {
    if (isLoading) {
      this._Renderer2.setAttribute(el, 'disabled', 'true');
    } else {
      this._Renderer2.removeAttribute(el, 'disabled');
    }
  }

  // Toggle buttons loading state for add/remove actions
  toggleButtonsLoadingState(el1: HTMLButtonElement, el2: HTMLButtonElement, isLoading: boolean): void {
    this.toggleButtonState(el1, isLoading);
    this.toggleButtonState(el2, isLoading);
  }

  // Refresh cart data
  refreshCartData(): void {
    this.subscriptions.add(
      this._CartService.getProductsCart().subscribe({
        next: (res) => {
          this._CartService.cartNumber.next(res.numOfCartItems);
          this.cartData = res.data;
        },
        error: (err) => console.error(err),
      })
    );
  }

  addFav(id: string): void {
    this._WishlistService.addProductsToWishlist(id).subscribe({
      next: (res) => {
        if (res.status === "success") {
          this._ToastrService.success('❤️ Product added to Wishlist');
          this.wishlistData = res.data
          this._WishlistService.favNumber.next(res.data.length)
        }
      }
    })
  }

  removeFav(id: string): void {
    this._WishlistService.removeProductsWishlist(id).subscribe({
      next: (res) => {
        if (res.status === "success") {
          console.log(res);
          this._ToastrService.error(`💔${res.message}`);
          this.wishlistData = res.data
          this._WishlistService.favNumber.next(res.data.length)
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

  // Clean up subscriptions
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
