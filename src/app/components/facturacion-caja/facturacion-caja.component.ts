import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Productos } from '../../models/Productos';
import { ProductoService } from '../../services/producto-service';
import { Detalle } from '../../models/Detalle';
import { FormsModule } from '@angular/forms';
import { Factura } from '../../models/Factura';

@Component({
  selector: 'app-facturacion-caja',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, CommonModule],
  templateUrl: './facturacion-caja.component.html',
  styleUrl: './facturacion-caja.component.css',
})
export class FacturacionCajaComponent implements OnInit {
  detalles: Detalle[] = [];
  productos: Productos[] = [];

  detalle: Detalle = new Detalle({ id_producto: '', nombre: '' }, 0, 0, 0);
  producto: Productos = new Productos(
    '',
    '',
    { id_categoria: '', categoria: '' },
    0,
    0,
    0,
    0,
    new Date(),
    ''
  );

  factura: Factura = new Factura(
    { id_cliente: '' }, // Objeto cliente con id_cliente
    new Date(), // fecha_emision
    'EFECTIVO', // metodo_pago
    0, // subtotal
    0, // iva
    0 // total
  );

  activeMenu: string = 'fact-Producto'; // Inicia con el menú primario activo

  constructor(private _productoService: ProductoService) {}

  resetProducto() {
    this.producto = new Productos(
      '',
      '',
      { id_categoria: '', categoria: '' },
      0,
      0,
      0,
      0,
      new Date(),
      ''
    );
  }

  resetDetalle() {
    this.detalle = new Detalle({ id_producto: '', nombre: '' }, 0, 0, 0);
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  setActiveMenu(menu: string): void {
    this.activeMenu = menu;
  }

  unoProducto(id: string): void {
    this._productoService.unoProducto(id).subscribe(
      (data: Productos) => {
        this.producto = data;
        console.log(this.producto);
      },
      (error) => {
        console.error('Error en la solicitud', error);
        this.resetProducto();
      }
    );
  }

  agregarDetalle(): void {
    this.productos.push(this.producto);
    this.detalle.producto = this.producto;
    this.detalle.precio = this.producto.precio_venta;
    this.calcularSubtotal();
    this.detalles.push(this.detalle);

    console.log(this.productos);
    console.log(this.detalles);
    this.calcularSubtotalFactura();
    this.calcularIva();
    this.calcularTotalFactura();
    this.resetProducto();
    this.resetDetalle();
  }

  calcularSubtotal(): void {
    this.detalle.total = this.detalle.precio * this.detalle.cantidad;
  }

  calcularSubtotalFactura(): void {
    this.factura.subtotal = this.detalles.reduce(
      (total, detalle) => total + detalle.total,
      0
    );
  }

  calcularIva(): void {
    this.factura.iva = parseFloat((this.factura.subtotal * 0.14).toFixed(2));
  }

  calcularTotalFactura(): void {
    this.factura.total = parseFloat(
      (this.factura.subtotal + this.factura.iva).toFixed(2)
    );
  }

  eliminarDetalle(index: number): void {
    this.detalles.splice(index, 1);
  }
}
