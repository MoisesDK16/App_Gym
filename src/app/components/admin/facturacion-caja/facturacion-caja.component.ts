import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Productos } from '../../../models/Productos';
import { ProductoService } from '../../../services/producto-service';
import { Detalle } from '../../../models/Detalle';
import { FormsModule } from '@angular/forms';
import { Factura } from '../../../models/Factura';
import { FacturacionCajaService } from '../../../services/facturacion-caja.service';
import { ClienteResponse, Clientes } from '../../../models/Clientes';
import { ClienteService } from '../../../services/cliente-service';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AdminComponent } from '../../../headers/admin/admin.component';
import { forkJoin, map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-facturacion-caja',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    AdminComponent
  ],
  templateUrl: './facturacion-caja.component.html',
  styleUrl: './facturacion-caja.component.css',
})
export default class FacturacionCajaComponent implements OnInit {
  id_cliente: string = '';
  ruc: string = '54656465465';
  fecha_emision: Date = new Date();
  detalles: Detalle[] = [];
  productos: Productos[] = [];

  //Estados
  estado: string = '';
  detalle: Detalle = new Detalle({ idProducto: '', nombre: '' } , 0, 0, 0, {
    idFactura: 0,
  });
  producto: Productos = new Productos(
    '',
    '',
    { id_categoria: 0, categoria: '' },
    0,
    0,
    0,
    0,
    new Date(),
    '',
    ''
  );

  factura: Factura = new Factura(
    0,
    {id_cliente: '', nombre: '', primer_apellido: ''}, // Objeto cliente con id_cliente
    '',
    new Date(), // fecha_emision
    '', // metodo_pago
    0, // subtotal
    0, // iva
    0 // total
  );

  cliente: Clientes = new Clientes('', '', '', '', '', '', '', '', '');

  activeMenu: string = 'fact-Producto'; // Inicia con el menú primario activo

  constructor(
    private _productoService: ProductoService,
    private _FacturaService: FacturacionCajaService,
    private _DetalleService: FacturacionCajaService,
    private _ClienteService: ClienteService
  ) {}

  buscarCliente(): void {
    this._ClienteService.unoCliente(this.id_cliente).subscribe((data) => {
      this.cliente = data;
      console.log(this.cliente);
    });
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  setActiveMenu(menu: string): void {
    this.activeMenu = menu;
  }

  resetProducto() {
    this.producto = new Productos(
      '',
      '',
      { id_categoria: 0, categoria: '' },
      0,
      0,
      0,
      0,
      new Date(),
      '',
      ''
    );
  }

  resetDetalle() {
    this.detalle = new Detalle({ idProducto: '', nombre: '' }, 0, 0, 0, {
      idFactura: 0,
    });
  }

  resetEstado() {
    this.estado = '';
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
    if (this.detalle.cantidad <= 0) {
      console.log('la cantidad debe ser mayor a 0');
      return;
    }

    if (this.producto.stock < this.detalle.cantidad) {
      console.log('stock insuficiente');
      return;
    }

    this.productos.push(this.producto);
    this.detalle.producto = this.producto;
    this.detalle.precio = this.producto.precioVenta;
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
    this.factura.iva = parseFloat((this.factura.subtotal * 0.15).toFixed(2));
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
      { id_cliente: this.id_cliente, nombre: this.cliente.nombre, primer_apellido: this.cliente.primer_apellido },
      this.ruc,
      this.fecha_emision,
      'EFECTIVO',
      this.factura.subtotal,
      this.factura.iva,
      this.factura.total
    );
  
    this._FacturaService.generarFactura(this.factura).subscribe(
      (data: Factura) => {
        this.factura = data;
        console.log('id Factura generada:', this.factura.idFactura);
        this.generarDetalles().subscribe(() => {
          this.generarFacturaPDF();
        });
      }
    );
  }
  
  generarDetalles(): Observable<void> {
    const observables = this.detalles.map(detalle => {
      console.log("Detalle Productos: " + detalle.producto.idProducto);
      detalle.factura = { idFactura: this.factura.idFactura };
      return this._DetalleService.generarDetalle(detalle).pipe(
        tap((data: Detalle) => {
          console.log('Detalle generado:', data);
          this.actualizarStock(detalle.producto.idProducto, detalle.cantidad);
        })
      );
    });
    return forkJoin(observables).pipe(map(() => {}));
  }

   generarFacturaPDF(): void {
    this._FacturaService.downloadFacturaPDF(this.factura.idFactura).subscribe(
      (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'facturaPersonal.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    );
  }
  
  actualizarStock(id_producto: string , cantidad: number): void {

    this._productoService
      .actualizarStock(id_producto, cantidad)
      .subscribe(
        (data) => {
          console.log('Stock actualizado:', data);
        }
      );
  }
  

  openModal(): void {
    const modalDiv = document.getElementById('myModal');
    if (modalDiv != null) {
      modalDiv.classList.add('show');
      modalDiv.style.display = 'block';
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.classList.add('modal-backdrop', 'fade', 'show');
      document.body.appendChild(backdrop);
      console.log(this.estado);
    }
  }

  closeModal(): void {
    const modalDiv = document.getElementById('myModal');
    if (modalDiv != null) {
      this.resetEstado();
      modalDiv.classList.remove('show');
      modalDiv.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    }
  }
}
