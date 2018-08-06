import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
    MessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
