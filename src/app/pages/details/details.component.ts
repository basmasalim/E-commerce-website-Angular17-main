import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Product } from '../../core/interfaces/product';
import { Cart } from '../../core/interfaces/cart';
import { FilterCategoryPipe } from '../../core/pipes/filter-category.pipe';
import { FormsModule } from '@angular/forms';
import { MainProductsComponent } from '../../component/main-products/main-products.component';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [MainProductsComponent, FilterCategoryPipe, FormsModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CartService = inject(CartService);
  private readonly _Renderer2 = inject(Renderer2);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _WishlistService = inject(WishlistService);

  @ViewChild('imgShowcase') imgShowcase!: ElementRef;

  private subscriptions: Subscription = new Subscription();

  productList: Product[] = [];
  detailsProduct: Product | null = null;
  cartData: Cart = {} as Cart;

  imgId: number = 1;
  StockStatusList: string[] = [];
  wishlistData: string[] = []

  searchInput: string = '';
  selectedCategoryName: any = '';


  ngOnInit(): void {
    this.initializeData();
    this.getFav();
  }

  initializeData(): void {
    this.subscriptions.add(
      this._ActivatedRoute.paramMap
        .pipe(
          switchMap((params) => {
            const idProduct = params.get('id');
            if (idProduct) {
              return this._ProductsService.getSpecificProducts(idProduct);
            }
            return [];
          }),
          switchMap((productRes) => {
            this.detailsProduct = productRes?.data;
            return this._CartService.getProductsCart();
          })
        )
        .subscribe({
          next: (cartRes) => {
            this.cartData = cartRes.data;
            this.displayAllProducts();
          },
          error: (err) => console.error(err),
        })
    );
  }

  displayAllProducts(): void {
    this.subscriptions.add(
      this._ProductsService.getAllProducts().subscribe({
        next: (res) => {
          this.productList = res.data;
          this.setStockStatusBasedOnQuantity();
          if (this.detailsProduct && this.detailsProduct.category) {
            this.selectedCategoryName = this.detailsProduct.category.name;
          }
        }
      })
    );
  }

  setStockStatusBasedOnQuantity(): void {
    this.StockStatusList = this.productList.map((product) =>
      (product.quantity ?? 0) > 0 ? 'In Stock' : 'Out Of Stock'
    );
  }

  addCart(id: string, el: HTMLButtonElement): void {
    this.subscriptions.add(
      this._CartService.addProductsToCart(id).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this._ToastrService.success('Product added to cart');
            this._Renderer2.setAttribute(el, 'disabled', 'true');
            this.refreshCartData();
          }
        }
      })
    );
  }

  refreshCartData(): void {
    this.subscriptions.add(
      this._CartService.getProductsCart().subscribe({
        next: (res) => {
          this.cartData = res.data;
        },
        error: (err) => console.error(err),
      })
    );
  }

  updateCount(id: string, count: number, el1: HTMLButtonElement, el2: HTMLButtonElement): void {
    const item = this.cartData.products.find((product) => product.product._id === id);
    if (item) {
      this.toggleButtonsLoadingState(el1, el2, true);
      item.isloadingCount = true;
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
            console.error(err);
            this.toggleButtonsLoadingState(el1, el2, false);
            item.isloadingCount = false;
          },
        })
      );
    }
  }

  toggleButtonsLoadingState(el1: HTMLButtonElement, el2: HTMLButtonElement, isLoading: boolean): void {
    if (isLoading) {
      this._Renderer2.setAttribute(el1, 'disabled', 'true');
      this._Renderer2.setAttribute(el2, 'disabled', 'true');
    } else {
      this._Renderer2.removeAttribute(el1, 'disabled');
      this._Renderer2.removeAttribute(el2, 'disabled');
    }
  }

  isProductInCart(productId: string): boolean {
    return this.cartData.products?.some((item) => item.product._id === productId) || false;
  }

  calculateDiscountPercentage(): string | null {
    if (this.detailsProduct) {
      const oldPrice = this.detailsProduct.price;
      const newPrice = this.detailsProduct.priceAfterDiscount;

      if (oldPrice && newPrice && oldPrice > 0) {
        return (((oldPrice - newPrice) / oldPrice) * 100).toFixed(2);
      }
    }
    return null;
  }

  // !!!!!!!!!!!!!!!!!!!!
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

  onImageClick(index: number): void {
    this.imgId = index + 1;
    this.slideImage();
  }

  slideImage(): void {
    if (this.imgShowcase?.nativeElement) {
      const displayWidth = this.imgShowcase.nativeElement.querySelector('img').clientWidth;
      this.imgShowcase.nativeElement.style.transform = `translateX(${-(this.imgId - 1) * displayWidth}px)`;
    }
  }

  @HostListener('window:resize') onWindowResize(): void {
    this.slideImage();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
