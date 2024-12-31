import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { logedGuard } from './core/guards/loged.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { VerifyEmailComponent } from './pages/forgot-password/verify-email/verify-email.component';
import { VerifyCodeComponent } from './pages/forgot-password/verify-code/verify-code.component';
import { ResetPasswordComponent } from './pages/forgot-password/reset-password/reset-password.component';
import { CartComponent } from './pages/cart/cart.component';
import { BrandsComponent } from './pages/brands/brands.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { SpecificCategoryComponent } from './component/specific-category/specific-category.component';
import { SpecificBrandComponent } from './component/specific-brand/specific-brand.component';
import { ProductsComponent } from './pages/products/products.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { DetailsComponent } from './pages/details/details.component';
import { AllordersComponent } from './pages/allorders/allorders.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { SpecificOrderComponent } from './pages/specific-order/specific-order.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';

export const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, canActivate: [logedGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, title: 'FreshCart-Login' },
      { path: 'register', component: RegisterComponent, title: 'FreshCart-Register' },
      { path: 'verifyEmail', component: VerifyEmailComponent, title: 'FreshCart-VerifyEmail' },
      { path: 'verifyCode', component: VerifyCodeComponent, title: 'FreshCart-VerifyCode' },
      { path: 'resetPassword', component: ResetPasswordComponent, title: 'FreshCart-ResetPassword' },
    ]
  },
  {
    path: '', component: BlankLayoutComponent, canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, title: 'FreshCart-Home' },
      { path: 'cart', component: CartComponent, title: 'FreshCart-Cart' },
      { path: 'brands', component: BrandsComponent, title: 'FreshCart-Brands' },
      { path: 'categories', component: CategoriesComponent, title: 'FreshCart-Categories' },
      { path: 'specificCategory/:id', component: SpecificCategoryComponent, title: 'FreshCart-SpecificCategory' },
      { path: 'SpecificBrand/:id', component: SpecificBrandComponent, title: 'FreshCart-SpecificBrand' },
      { path: 'products', component: ProductsComponent, title: 'FreshCart-Products' },
      { path: 'favourite', component: WishlistComponent, title: 'FreshCart-Favourite' },
      { path: 'details/:id', component: DetailsComponent, title: 'FreshCart-DetailsProduct' },
      { path: 'allorders', component: AllordersComponent, title: 'FreshCart-Allorders' },
      { path: 'payment/:id', component: PaymentComponent, title: 'FreshCart-Payment' },
      { path: 'specifcOrder/:id', component: SpecificOrderComponent, title: 'FreshCart-SpecifcOrder' },
    ]
  },
  { path: '**', component: NotfoundComponent, title: 'FreshCart-NotFound' },
];
