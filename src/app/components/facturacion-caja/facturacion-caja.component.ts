import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Productos } from '../../models/Productos';
import { ProductoService } from '../../services/producto-service';
import { Detalle } from '../../models/Detalle';
import { FormsModule } from '@angular/forms';
import { Factura } from '../../models/Factura';
import { FacturacionCajaService } from '../../services/facturacion-caja.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-facturacion-caja',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, CommonModule],
  templateUrl: './facturacion-caja.component.html',
  styleUrl: './facturacion-caja.component.css',
})
export class FacturacionCajaComponent implements OnInit {
  id_cliente: string = '';
  ruc: string = '';
  fecha_emision: Date = new Date();
  detalles: Detalle[] = [];
  productos: Productos[] = [];

  detalle: Detalle = new Detalle({ id_producto: '', nombre: '' }, 0, 0, 0, {
    idFactura: 0,
  });
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
    0,
    { id_cliente: '' }, // Objeto cliente con id_cliente
    '',
    new Date(), // fecha_emision
    '', // metodo_pago
    0, // subtotal
    0, // iva
    0 // total
  );

  activeMenu: string = 'fact-Producto'; // Inicia con el menú primario activo

  constructor(
    private _productoService: ProductoService,
    private _FacturaService: FacturacionCajaService,
    private _DetalleService: FacturacionCajaService
  ) {}

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
    this.detalle = new Detalle({ id_producto: '', nombre: '' }, 0, 0, 0, {
      idFactura: 0,
    });
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

  pagar(): void {
    this.generarFactura();
  }

  generarFactura(): void {
    this.factura = new Factura(
      0,
      { id_cliente: this.id_cliente },
      this.ruc,
      this.fecha_emision,
      'EFECTIVO',
      this.factura.subtotal, // subtotal
      this.factura.iva, // iva
      this.factura.total // total
    );

    this._FacturaService.generarFactura(this.factura).subscribe(
      (data: Factura) => {
        this.factura = data;
        console.log('id Factura generada:', this.factura.idFactura);
        this.generarDetalles(); 
      },
      (error) => {
        console.error('Error al generar la factura:', error);
      }
    );
  }

  generarDetalles(): void {
    // Generar los detalles solo después de obtener la última factura
    for (const detalle of this.detalles) {
      detalle.factura = { idFactura: this.factura.idFactura};
      this._DetalleService.generarDetalle(detalle).subscribe(
        (data: Detalle) => {
          console.log('Detalle generado:', data);
        },
        (error) => {
          console.error('Error al generar el detalle:', error);
        }
      );
    }
  }
}
