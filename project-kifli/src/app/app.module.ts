import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { TopMenuBarComponent } from './top-menu-bar/top-menu-bar.component';

import { httpInterceptorProviders } from './http-interceptors';
import { ProductComponent } from './product/product.component';
import { AdSpaceComponent } from './ad-space/ad-space.component';
import { ProfileComponent } from './profile/profile.component';
import { AdPlacementComponent } from './ad-placement/ad-placement.component';
import { MyadsComponent } from './myads/myads.component';
import { MessageComponent } from './message/message.component';
import { CategoriesComponent } from './categories/categories.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { EditProductWrapperComponent } from './edit-product-wrapper/edit-product-wrapper.component';

import {
  GoogleApiModule, 
  GoogleApiService, 
  GoogleAuthService, 
  NgGapiClientConfig, 
  NG_GAPI_CONFIG,
  GoogleApiConfig
} from 'ng-gapi';
import { AdminComponent } from './admin/admin.component';
import { UsersListingComponent } from './users-listing/users-listing.component';

let gapiClientConfig: NgGapiClientConfig = {
  client_id: "222157294364-s0r226g6ue92bp6n78iaqcthjbohi3pp.apps.googleusercontent.com",
  discoveryDocs: ["https://analyticsreporting.googleapis.com/$discovery/rest?version=v4"],
  scope: [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/spreadsheets.readonly"
  ].join(" ")
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    TopMenuBarComponent,
    ProductComponent,
    AdSpaceComponent,
    ProfileComponent,
    AdPlacementComponent,
    MyadsComponent,
    MessageComponent,
    CategoriesComponent,
    EditProductComponent,
    EditProductWrapperComponent,
    AdminComponent,
    UsersListingComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    }),
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
