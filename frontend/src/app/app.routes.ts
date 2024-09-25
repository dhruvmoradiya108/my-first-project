import { Routes } from '@angular/router';
import { CartPageComponent } from './components/cart-page/cart-page.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { HomeComponent } from './components/home/home.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { SearchComponent } from './components/search/search.component';
import { SellerAddProductComponent } from './components/seller-add-product/seller-add-product.component';
import { SellerAuthComponent } from './components/seller-auth/seller-auth.component';
import { SellerHomeComponent } from './components/seller-home/seller-home.component';
import { SellerUpdateProductComponent } from './components/seller-update-product/seller-update-product.component';
import { UserAuthComponent } from './components/user-auth/user-auth.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Home'
    },
    {
        path: 'sell-auth',
        component: SellerAuthComponent,
        title: 'Seller Login'
    },
    {
        path: 'seller-home',
        component: SellerHomeComponent,
        canActivate: [authGuard],
        title: 'Seller Area'
    },
    {
        path: 'seller-add-product',
        component: SellerAddProductComponent,
        canActivate: [authGuard],
        title: 'Add Products'
    },
    {
        path: 'seller-update-product/:id',
        component: SellerUpdateProductComponent,
        // canActivate: [authGuard]
        title: 'Update Products'
    },
    {
        path: 'search',
        component: SearchComponent
    },
    {
        path: 'details/:productId',
        component: ProductDetailsComponent
    },
    {
        path: 'user-auth',
        component: UserAuthComponent,
        title: 'User Login'
    }, 
    {
        path: 'cart-page',
        component: CartPageComponent,
        title: 'Cart'
    },
    {
        path: 'checkout',
        component: CheckoutComponent,
        title: 'Checkout'
    },
    {
        path: 'my-orders',
        component: MyOrdersComponent,
        title: 'My Orders'
    }
];
