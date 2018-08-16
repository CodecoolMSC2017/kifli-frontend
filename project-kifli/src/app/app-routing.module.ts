import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';

import { ProfileComponent } from './profile/profile.component';

import { AdPlacementComponent } from './ad-placement/ad-placement.component';
import { MyadsComponent } from './myads/myads.component';
import { CategoriesComponent } from './categories/categories.component';
import { EditProductWrapperComponent } from './edit-product-wrapper/edit-product-wrapper.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: HomeComponent },
  { path: 'products/:id', component: ProductComponent },
  { path: 'products/:id/edit', component: EditProductWrapperComponent },
  { path: 'users/:id', component: ProfileComponent },
  { path: 'place-ad', component: AdPlacementComponent },
  { path: 'myads', component: MyadsComponent },
  { path: 'categories', component: CategoriesComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
