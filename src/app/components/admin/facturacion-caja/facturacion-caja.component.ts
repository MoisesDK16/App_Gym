import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { AdminComponent } from '../../../headers/admin/admin.component';
import {  MembresiaComponentF} from "./membresiaF/membresiaF.component";
import { ProductosComponentF } from './productosF/productosF.component';

@Component({
  selector: 'app-facturacion-caja',
  standalone: true,
  imports: [
    CommonModule,
    AdminComponent,
    ProductosComponentF,
    MembresiaComponentF
],
  templateUrl: './facturacion-caja.component.html',
  styleUrl: './facturacion-caja.component.css',
})
export default class FacturacionCajaComponent implements OnInit {

  activeMenu: string = '';

  constructor() {}

  ngOnInit(): void {
    this.activeMenu = 'fact-Producto';
  }

  setActiveMenu(menu: string): void {
    this.activeMenu = menu;
  }
}
