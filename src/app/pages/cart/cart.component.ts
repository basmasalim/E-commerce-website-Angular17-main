import { Component, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { Subscription } from 'rxjs';
import { Cart } from '../../core/interfaces/cart';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmptyPageComponent } from '../../component/empty-page/empty-page.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, EmptyPageComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {

  private readonly _CartService = inject(CartService);
  private readonly _Renderer2 = inject(Renderer2);
  private readonly _ToastrService = inject(ToastrService);

  cartData: Cart = {} as Cart

  getProductsCartSub!: Subscription;
  removeItemSub!: Subscription;
  updateCountSub!: Subscription;

  ngOnInit(): void {
    this.getProductsCartSub = this._CartService.getProductsCart().subscribe({
      next: (res) => {
        if (res.status === "success") {
          this.cartData = res.data
        }
      },
      error: (err) => {
        console.log(err);

      }
    })
  }

  ngOnDestroy(): void {
    this.getProductsCartSub?.unsubscribe()
    this.removeItemSub?.unsubscribe();
    this.updateCountSub?.unsubscribe();
  }

  removeItem(id: string): void {
    const item = this.cartData.products.find(product => product.product._id === id);
    if (item) {
      item.isloading = true
      this.removeItemSub = this._CartService.removeSpecificCart(id).subscribe({
        next: (res) => {
          if (res.status === "success") {
            this._CartService.cartNumber.next(res.numOfCartItems)
            this._ToastrService.error('Product removed from the cart');
            this.cartData = res.data
          }
          item.isloading = false
        },
        error: (err) => {
          console.log(err);
          item.isloading = false
        }
      });
    }
  }

  updateCount(id: string, count: number, el1: HTMLButtonElement, el2: HTMLButtonElement): void {
    const item = this.cartData.products.find(product => product.product._id === id);

    if (item && count > 0) {
      item.isloadingCount = true;

      this._Renderer2.setAttribute(el1, 'disabled', 'true');
      this._Renderer2.setAttribute(el2, 'disabled', 'true');

      this.updateCountSub = this._CartService.updateProductsCart(id, count).subscribe({
        next: (res) => {
          if (res.status === "success") {
            this.cartData = res.data;
          }
          this._Renderer2.removeAttribute(el1, 'disabled');
          this._Renderer2.removeAttribute(el2, 'disabled');
          item.isloadingCount = false;

        },
        error: (err) => {
          item.isloadingCount = false;

          this._Renderer2.removeAttribute(el1, 'disabled');
          this._Renderer2.removeAttribute(el2, 'disabled');
        }
      });
    }
  }

}
