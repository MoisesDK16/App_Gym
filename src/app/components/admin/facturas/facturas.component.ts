import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FacturacionCajaService } from '../../../services/facturacion-caja.service';
import { Factura } from '../../../models/Factura';
import { Detalle } from '../../../models/Detalle';
import { AdminComponent } from '../../../headers/admin/admin.component';
import ProductosComponent from "../productos/productos.component";
import { FacturasProductosComponent } from "./facturas-productos/facturas-productos.component";
import { FacturasRenovacionComponent } from "./facturas-membresias/facturas-membresias.component";

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, CommonModule, AdminComponent, ProductosComponent, FacturasProductosComponent, FacturasRenovacionComponent],
  templateUrl: './facturas.component.html',
  styleUrl: './facturas.component.css'
})
export default class FacturasComponent implements OnInit{

  facturas: Factura[] = [];
  detallesFactura: Detalle[] = [];
  estado: String = '';

  constructor(private _FacturaService: FacturacionCajaService) { }

  ngOnInit(): void {
    this.setActiveMenu('fact-Producto');

  }

  activeMenu: String = 'fact-Producto';

  setActiveMenu(menu: String):void {
    this.activeMenu = menu;
  }

}
