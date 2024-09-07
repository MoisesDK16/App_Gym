import { Component, CUSTOM_ELEMENTS_SCHEMA ,Input, NgModule, OnInit } from '@angular/core';
import {  RouterLink, RouterOutlet } from '@angular/router';
import LayoutComponent from "./layouts/layout/layout.component";
import GeneralComponent from './headers/general/general.component';
import { AdminComponent } from './headers/admin/admin.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { DetallesCompraComponent } from './components/general/modales/detalles-compra/detalles-compra.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,LayoutComponent, GeneralComponent, AdminComponent, NgxPayPalModule, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class AppComponent {

  constructor() {}
}

@NgModule({
  declarations: [DetallesCompraComponent],
  imports: [CommonModule],
  exports: [DetallesCompraComponent]
})
export class DetallesCompraModule {}