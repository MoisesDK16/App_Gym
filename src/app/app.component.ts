import { Component, CUSTOM_ELEMENTS_SCHEMA ,Input, NgModule, OnInit } from '@angular/core';
import {  RouterLink, RouterOutlet } from '@angular/router';
import LayoutComponent from "./layouts/layout/layout.component";
import GeneralComponent from './headers/general/general.component';
import { AdminComponent } from './headers/admin/admin.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { DetallesCompraComponent } from './components/general/modales/detalles-compra/detalles-compra.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { auth2Interceptor } from './interceptor/auth2.interceptor';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,LayoutComponent, GeneralComponent, AdminComponent, NgxPayPalModule, NgxSpinnerModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // providers: [
  //    {
  //     provide: HTTP_INTERCEPTORS,
  //     useValue: auth2Interceptor,
  //     multi: true,
  //   },
  // ],
})

export class AppComponent {

  constructor() {}
}

// @NgModule({
//   providers: [
//     {
//       provide: HTTP_INTERCEPTORS,
//       useValue: auth2Interceptor,
//       multi: true,
//     },
//   ],
// })
// export class InterceptorModule {}


// @NgModule({
//   declarations: [DetallesCompraComponent],
//   imports: [CommonModule],
//   exports: [DetallesCompraComponent],
// })
// export class DetallesCompraModule {}