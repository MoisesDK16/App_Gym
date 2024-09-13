import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AdminComponent } from '../../../../headers/admin/admin.component';
import { Detalle } from '../../../../models/Detalle';
import { Productos } from '../../../../models/Productos';
import { Factura } from '../../../../models/Factura';
import { Clientes } from '../../../../models/Clientes';
import { ProductoService } from '../../../../services/producto-service';
import { FacturacionCajaService } from '../../../../services/facturacion-caja.service';
import { ClienteService } from '../../../../services/cliente-service';
import { forkJoin, map, Observable, tap } from 'rxjs';
import ProductosComponent from '../../productos/productos.component';
import e from 'cors';

@Component({
  selector: 'app-productosF',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    AdminComponent,
    ProductosComponent,
  ],
  templateUrl: './productosF.component.html',
  styleUrl: './productosF.component.css',
})
export class ProductosComponentF {
  id_cliente: string = '';
  nombreProducto: string = '';
  ruc: string = '54656465465';
  fecha_emision: Date = new Date();
  detalles: Detalle[] = [];
  productos: Productos[] = [];

  productosModal: any[] = [];

  //Estados
  estado: string = '';
  detalle: Detalle = new Detalle({ idProducto: '', nombre: '' }, 0, 0, 0, {
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
    { id_cliente: '', nombre: '', primer_apellido: '' }, // Objeto cliente con id_cliente
    '',
    new Date(), // fecha_emision
    '', // metodo_pago
    0, // subtotal
    0, // iva
    0 // total
  );

  cliente: Clientes = new Clientes('', '', '', '', '', '', '', '', '');

  displayedColumns: string[] = [
    'nombre',
    'precio_venta',
    'stock',
    'fecha_caducacion',
    'imagen',
    'acciones',
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 10;
  currentPage = 0;
  totalItems = 0;

  constructor(
    private _productoService: ProductoService,
    private _FacturaService: FacturacionCajaService,
    private _DetalleService: FacturacionCajaService,
    private _ClienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.getAllProductos();
    console.log('holaaaa');
  }

  buscarCliente(): void {
    this._ClienteService.unoCliente(this.id_cliente).subscribe((data) => {
      this.cliente = data;
      console.log(this.cliente);
    });
  }

  getAllProductos(): void {
    this._productoService
      .getProductos(this.currentPage, this.pageSize)
      .subscribe((data: any) => {
        this.productosModal = data.content.filter(
          (producto: any) => producto.stock > 0
        );
        this.dataSource = new MatTableDataSource(this.productosModal);
        this.totalItems = data.totalElements;
        console.log(this.productosModal);
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      });
  }

  buscarProductoPorNombre(): void {
    console.log(this.productos);
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

  resetAll(): void {
    this.resetProducto();
    this.resetDetalle();
    this.resetEstado();
    this.productos = [];
    this.detalles = [];
    this.factura = new Factura(
      0,
      { id_cliente: '', nombre: '', primer_apellido: '' },
      '',
      new Date(), // fecha_emision
      '', // metodo_pago
      0, // subtotal
      0, // iva
      0 // total
    );
    this.cliente = new Clientes('', '', '', '', '', '', '', '', '');
    this.id_cliente = '';
    const buscadorProducto = document.getElementById(
      'buscador-producto'
    ) as HTMLInputElement;
    buscadorProducto.value = '';
  }

  resetEstado() {
    this.estado = '';
  }

  async unoProducto(id: string): Promise<void> {
    const result = await this._productoService.unoProducto(id).toPromise();
    if (result) {
      this.producto = result;
    }
  }

  async addProducto(id: string): Promise<void> {
    await this.unoProducto(id);
    this.agregarDetalleModal();
  }

  agregarDetalle(): void {
    if (this.detalle.cantidad <= 0) {
      console.log('la cantidad debe ser mayor a 0');
      return;
    }

    if (
      this.productos.find(
        (elemento) => this.producto.idProducto === elemento.idProducto
      )
    ) {
      console.log('Producto ya agregado');
      this.detalles.forEach((elemento) => {
        if (elemento.producto.idProducto === this.producto.idProducto) {
          if(elemento.cantidad >= this.producto.stock){
            console.log('Stock insuficiente');
            this.resetProducto();
            const buscadorProducto = document.getElementById(
              'buscador-producto'
            ) as HTMLInputElement;
            buscadorProducto.value = '';
            const cantidad_producto2 = document.getElementById('cantidad-producto2') as HTMLInputElement;
            cantidad_producto2.value = '';
            alert('Stock insuficiente');
            return;
          }else{
            elemento.cantidad += this.detalle.cantidad;
            this.calcularSubtotal();
            this.calcularAll();
            this.resetProducto();
            this.resetDetalle();
            const buscadorProducto = document.getElementById('buscador-producto') as HTMLInputElement;
            buscadorProducto.value = '';
            const nombre_producto = document.getElementById('nombre-producto') as HTMLInputElement;
            nombre_producto.value = '';
          }
        }
      });
      return;
    }
    

    this.productos.push(this.producto);
    this.detalle.producto = this.producto;
    this.detalle.precio = this.producto.precioVenta;
    this.detalles.push(this.detalle);
    this.calcularSubtotal();

    console.log(this.productos);
    console.log(this.detalles);

    this.calcularAll();
    this.resetProducto();
    this.resetDetalle();
    const buscadorProducto = document.getElementById(
      'buscador-producto'
    ) as HTMLInputElement;
    buscadorProducto.value = '';
  }
  
  agregarDetalleModal(): void {
    console.log(this.producto.idProducto);

    const productoExistente = this.productos.find(
      (elemento) => this.producto.idProducto === elemento.idProducto
    );

    if (productoExistente) {
      this.detalles.forEach((elemento) => {
        // Verificar si el producto del detalle es el mismo al idProduco de producto y si la cantidad es mayor al stock
        if (elemento.producto.idProducto === this.producto.idProducto) {
          if (elemento.cantidad >= this.producto.stock) {
            console.log('Stock insuficiente');
            this.resetProducto();
            this.resetearTxts();
            alert('Stock insuficiente'); 
            return;
          } else {
            elemento.cantidad++;
            this.calcularSubtotal();
            this.calcularAll();
            this.resetProducto();
            this.resetDetalle();
            this.resetearTxts();
          }
        }
      });
      return;
    }

    if (this.producto.stock < 1) {
      console.log('Stock insuficiente para agregar el producto');
      return;
    }

    // Si el producto no está en la lista y hay stock, agregarlo
    this.productos.push(this.producto);
    this.detalle.cantidad = 1;
    this.detalle.producto = this.producto;
    this.detalle.precio = this.producto.precioVenta;
    this.detalles.push(this.detalle);
    this.calcularSubtotal();

    console.log(this.productos);
    console.log(this.detalles);

    this.calcularAll();
    this.resetProducto();
    this.resetDetalle();
    this.resetearTxts();
  }

  editarCantidadDetalle(cantidad: number, nombreProducto: string): void {
    console.log('Cantidad:', cantidad);

    const detalleEncontrado = this.detalles.filter((detalle) => {
      return detalle.producto.nombre === nombreProducto;
    })

    const index = this.detalles.indexOf(detalleEncontrado[0]);

    const producto = this.productos.find(
      (elemento) => elemento.nombre ===  detalleEncontrado[0].producto.nombre);
    console.log('Producto Seleccionado:', producto?.nombre);

    if (producto) {
      if (cantidad > producto.stock) {
        console.log('Stock insuficiente');
        detalleEncontrado[0].cantidad = producto.stock;
        alert('Stock insuficiente');
        return;
      } else {
        const cantidad_producto = document.getElementById(
          'cantidad-producto'
        ) as HTMLInputElement;
        cantidad_producto.disabled = false;
        this.detalles[index].cantidad = cantidad;
      }
    }

    this.calcularSubtotal();
    this.calcularAll();
    console.log(this.detalles);
  }

  eliminarProducto(index: number): void {
    this.productos.splice(index, 1);
  }

  eliminarDetalle(index: number): void {
    const producto = this.productos.find(
      (elemento) =>
        elemento.idProducto === this.detalles[index].producto.idProducto
    );

    if(producto){
      this.productos.splice(this.productos.indexOf(producto), 1);
    }

    this.detalles.splice(index, 1);
    this.calcularAll();
  }

  calcularSubtotal(): void {
    this.detalles.forEach((detalle) => {
      detalle.total = detalle.precio * detalle.cantidad;
    });
  }

  calcularAll(): void {
    this.calcularSubtotalFactura();
    this.calcularIva();
    this.calcularTotalFactura();
  }

  resetearTxts(): void {
    const buscadorProducto = document.getElementById(
      'buscador-producto'
    ) as HTMLInputElement;
    buscadorProducto.value = '';
    const cantidad_producto2 = document.getElementById(
      'cantidad-producto2'
    ) as HTMLInputElement;
    cantidad_producto2.value = '';
  }

  async pagar(): Promise<void> {
    if(this.cliente.id_cliente === ''){
      alert('Cliente no encontrado');
      return;
    }

    if(this.detalles.length === 0){
      alert('No hay productos en la lista');
      return;
    }

    if(this.cliente.correo === ''){
      alert('Cliente no tiene correo');
      return;
    }

    await this.generarFactura();
  }

  async generarFactura(): Promise<void> {
    this.factura = new Factura(
      0,
      {
        id_cliente: this.id_cliente,
        nombre: this.cliente.nombre,
        primer_apellido: this.cliente.primer_apellido,
      },
      this.ruc,
      this.fecha_emision,
      'EFECTIVO',
      this.factura.subtotal,
      this.factura.iva,
      this.factura.total
    );

    this._FacturaService
      .generarFactura(this.factura)
      .subscribe((data: Factura) => {
        this.factura = data;
        console.log('id Factura generada:', this.factura.idFactura);
        this.generarDetalles().subscribe(async () => {
          await this.generarFacturaPDF();
        });
      });
  }

  generarDetalles(): Observable<void> {
    const observables = this.detalles.map((detalle) => {
      console.log('Detalle Productos: ' + detalle.producto.idProducto);
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

  async generarFacturaPDF(): Promise<void> {
    this._FacturaService
      .downloadFacturaPDF(this.factura.idFactura)
      .subscribe(async (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'facturaPersonal.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        let destinatario = this.cliente.correo;
        let asunto = 'Factura de Productos';
        let mensaje = 'Gracias por su compra';
        await this.enviarFacturaEmail(destinatario, asunto, mensaje, data);
        this.resetAll();
      });
  }

  async enviarFacturaEmail(
    destinatario: string,
    asunto: string,
    mensaje: string,
    data: Blob
  ): Promise<void> {
    this._FacturaService
      .enviarFacturaEmail(destinatario, asunto, mensaje, data)
      .subscribe((data) => {
        console.log('Correo enviado:', data);
      });
  }

  actualizarStock(id_producto: string, cantidad: number): void {
    this._productoService
      .actualizarStock(id_producto, cantidad)
      .subscribe((data) => {
        console.log('Stock actualizado:', data);
      });
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

  openModalProductos(): void {
    this.getAllProductos();
    const modalDiv = document.getElementById('myModalProductos');
    if (modalDiv != null) {
      modalDiv.classList.add('show');
      modalDiv.style.display = 'block';
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.classList.add('modal-backdrop', 'fade', 'show');
      document.body.appendChild(backdrop);
    }
  }

  cerrarModalProductos(): void {
    const modalDiv = document.getElementById('myModalProductos');
    if (modalDiv != null) {
      modalDiv.classList.remove('show');
      modalDiv.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAllProductos();
  }
}
