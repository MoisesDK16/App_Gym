import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../../services/producto-service';
import { Productos } from '../../../models/Productos';
import { DatePipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Categorias } from '../../../models/Categorias';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    NgStyle,
  ],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export default class ProductosComponent implements OnInit, AfterViewInit {
  productos: Productos[] = [];
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

  fechaInicio: string = '';
  fechaFin: string = '';
  estado: string = '';
  margen_ganancias: number[] = [5, 10, 15, 20, 25, 30, 40, 50];
  margen_ganancia_porcentual: number = 0;
  categorias: Categorias[] = [];

  startDate = document.getElementById('startDate') as HTMLInputElement;
  endDate = document.getElementById('endDate') as HTMLInputElement;

  displayedColumns: string[] = [
    'id_producto',
    'nombre',
    'categoria',
    'precio_compra',
    'precio_venta',
    'stock',
    'fecha_caducacion',
    'acciones',
  ];
  dataSource!: MatTableDataSource<Productos>;
  selectedFile: File | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 10;
  currentPage = 0;
  totalItems = 0;

  constructor(private servicio_productos: ProductoService) {}

  ngOnInit(): void {
    this.getProductos();
    this.listarCategorias();
  }

  async onFileChange(event: any): Promise<void> {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log(this.selectedFile); // Verifica que el archivo se está seleccionando correctamente
    }
  }

  async unoProducto(idProducto: string): Promise<void> {
    this.servicio_productos
      .unoProducto(idProducto)
      .subscribe(async (data: Productos) => {
        this.producto = data;
        console.log(this.producto);
        this.openModal();
        this.estado = 'actualizar';
        console.log(this.estado);
      });
  }

  // unoProductoImagen(idProducto: string): void {
  //   this.servicio_productos
  //     .unoProducto(idProducto)
  //     .subscribe((data: Productos) => {
  //       this.producto = data;
  //       console.log(this.producto);
  //     });
  // }

  onFileSelected(event: Event, idProducto: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Archivo seleccionado:', file);
      let formData = new FormData();
      formData.append('imagen', file);
      this.servicio_productos
        .actualizarProductoImagen(idProducto, formData)
        .subscribe((data: any) => {
          console.log(data);
        });
    }
  }

  // Función que convierte una URL a un objeto File
  async urlToFile(url: string, filename: string): Promise<File> {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('No se pudo obtener el recurso');
    }
    // Convierte la respuesta en un blob
    const blob = await res.blob();
    // Crea un objeto File a partir del blob
    return new File([blob], filename, { type: blob.type });
  }

  getProductos(): void {
    this.servicio_productos
      .getProductos(this.currentPage, this.pageSize)
      .subscribe((data: any) => {
        this.productos = data.content;
        this.dataSource = new MatTableDataSource<Productos>(this.productos);
        this.totalItems = data.totalElements;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        console.log(this.productos);
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  resetEstado() {
    this.estado = '';
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

  calcularPrecioVenta(): void {
    console.log('Precio de compra:', this.producto.precioCompra);
    console.log(
      'Margen de ganancia Porcentual:',
      this.margen_ganancia_porcentual
    );

    if (
      !isNaN(this.margen_ganancia_porcentual) &&
      !isNaN(this.producto.precioCompra)
    ) {
      this.producto.margenGanancia =
        this.producto.precioCompra * (this.margen_ganancia_porcentual / 100);
      this.producto.precioVenta =
        this.producto.margenGanancia + this.producto.precioCompra;
      console.log('Precio de venta calculado:', this.producto.precioVenta);
    } else {
      console.error('Margen de ganancia o precio de compra no válido');
    }
  }

  printMargenGanancia(): void {
    console.log('Margen de ganancia actual:', this.producto.margenGanancia);
  }

  parseNumber(value: string): number {
    return parseFloat(value.replace('%', ''));
  }

  registrarProducto(): void {

    const productoRepetido = this.productos.findIndex((producto)=> this.producto.nombre === this.producto.nombre);

    if (productoRepetido !== -1) {
      alert('El producto ya existe');
      return;
    }

    const productoRepetido2 = this.productos.findIndex((producto)=> this.producto.idProducto === this.producto.idProducto);
    if (productoRepetido2 !== -1) {
      alert('El producto ya existe');
      return;
    }

    if (
      this.selectedFile
    ) {
      const formData: FormData = new FormData();
      formData.append('idProducto', this.producto.idProducto);
      formData.append(
        'categoriaId',
        this.producto.categoria.id_categoria.toString()
      );
      formData.append('nombre', this.producto.nombre);
      formData.append('stock', this.producto.stock.toString());
      formData.append('precioCompra', this.producto.precioCompra.toString());
      formData.append(
        'margenGanancia',
        this.producto.margenGanancia.toString()
      );
      formData.append('precioVenta', this.producto.precioVenta.toString());
      formData.append(
        'fecha_caducacion',
        this.producto.fecha_caducacion.toString()
      );
      formData.append('descripcion', this.producto.descripcion);
      formData.append('imagen', this.selectedFile);

      this.servicio_productos
        .registrarProducto(formData)
        .subscribe((data: any) => {
          console.log(data);
          this.getProductos();
          this.closeModal();
        });
    } else {
      console.error(
        'La categoría no puede ser nula o el archivo no está seleccionado'
      );
    }
  }

  actualizarProducto(): void {
    if (this.producto.categoria && this.producto.categoria.id_categoria) {
      const formData: FormData = new FormData();
      formData.append(
        'id_categoria',
        this.producto.categoria.id_categoria.toString()
      );
      formData.append('nombre', this.producto.nombre);
      formData.append('stock', this.producto.stock.toString());
      formData.append('precioCompra', this.producto.precioCompra.toString());
      formData.append(
        'margenGanancia',
        this.producto.margenGanancia.toString()
      );
      formData.append('precioVenta', this.producto.precioVenta.toString());
      formData.append(
        'fecha_caducacion',
        this.producto.fecha_caducacion.toString()
      );
      formData.append('descripcion', this.producto.descripcion);

      this.servicio_productos
        .actualizarProducto(this.producto.idProducto, formData)
        .subscribe((data: Productos) => {
          console.log(data);
          this.getProductos();
          this.closeModal();
          this.resetEstado();
        });
    }
  }

  eliminarProducto(id_producto: string): void {
    this.servicio_productos
      .eliminarProducto(id_producto)
      .subscribe((data: any) => {
        console.log(data);
        this.getProductos();
        this.closeModal();
      });
  }

  listarCategorias(): void {
    this.servicio_productos.listarCategorias().subscribe((data: any) => {
      this.categorias = data;
      console.log('CATEGORIAS: ', this.categorias);
    });
  }

  buscarNombreProducto(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const nombre = inputElement.value.toString();

    if (nombre === '') {
      this.getProductos();
      return;
    }

    this.servicio_productos.buscarXNombre(nombre).subscribe((data: any) => {
      this.productos = data;
      this.dataSource = new MatTableDataSource<Productos>(this.productos);
      console.log(this.productos);
    });

    const categoria = document.getElementById(
      'selecter-categoria'
    ) as HTMLSelectElement;
    categoria.value = '0';

    const fechaInicio = document.getElementById(
      'startDate'
    ) as HTMLInputElement;
    fechaInicio.value = '';

    const fechaFin = document.getElementById('endDate') as HTMLInputElement;
    fechaFin.value = '';

    const stock = document.getElementById('rangeStock') as HTMLInputElement;
    stock.value = '100';
  }

  buscarCategoriaProducto(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const id_categoria = parseInt(inputElement.value);

    if (id_categoria === 0) {
      this.getProductos();
      return;
    }

    this.servicio_productos
      .buscarXCategoria(id_categoria)
      .subscribe((data: any) => {
        this.productos = data;
        this.dataSource = new MatTableDataSource<Productos>(this.productos);
        console.log(this.productos);
      });

    const buscador_producto = document.getElementById(
      'buscador-producto'
    ) as HTMLInputElement;

    buscador_producto.value = '';

    const fechaInicio = document.getElementById(
      'startDate'
    ) as HTMLInputElement;
    fechaInicio.value = '';

    const fechaFin = document.getElementById('endDate') as HTMLInputElement;
    fechaFin.value = '';

    const stock = document.getElementById('rangeStock') as HTMLInputElement;
    stock.value = '100';

    let eventCreated = {
      target: {
        value: '100'
      }
    } as unknown as Event;

    this.updateStockValue(eventCreated);

  }

  buscarStockProducto(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const stock = parseInt(inputElement.value);

    this.servicio_productos.buscarXStock(stock).subscribe((data: any) => {
      this.productos = data;
      this.dataSource = new MatTableDataSource<Productos>(this.productos);
      console.log(this.productos);
    });

      const fechaInicio = document.getElementById(
        'startDate'
      ) as HTMLInputElement;
      fechaInicio.value = '';

      const fechaFin = document.getElementById('endDate') as HTMLInputElement;
      fechaFin.value = '';

      const categoria = document.getElementById(
        'selecter-categoria'
      ) as HTMLSelectElement;
      categoria.value = '0';

      const buscador_producto = document.getElementById(
        'buscador-producto'
      ) as HTMLInputElement;
  
      buscador_producto.value = '';
  }

  addFecha_Inicio(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.fechaInicio = new Date(inputElement.value).toISOString().split('T')[0];
  }

  addFecha_Fin(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.fechaFin = new Date(inputElement.value).toISOString().split('T')[0];
  }

  buscarFechaCaducacionProducto(): void {
    this.servicio_productos
      .buscarXFechaCaducacion(this.fechaInicio, this.fechaFin)
      .subscribe((data: any) => {
        this.productos = data;
        this.dataSource = new MatTableDataSource<Productos>(this.productos);
        console.log(this.productos);
      });
    const categoria = document.getElementById(
      'selecter-categoria'
    ) as HTMLSelectElement;
    categoria.value = '0';

    const stock = document.getElementById('rangeStock') as HTMLInputElement;
    stock.value = '100';

    const buscador_producto = document.getElementById(
      'buscador-producto'
    ) as HTMLInputElement;

    buscador_producto.value = '';
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getProductos();
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

  updateStockValue(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    const range_stock = document.getElementById(
      'rangeStock'
    ) as HTMLInputElement;
    if (range_stock) {
      range_stock.value = value;
    }

    const stockValue = document.getElementById('stockValue');
    if (stockValue) {
      stockValue.innerText = value; 
    }

    // this.buscarStockProducto(event);
  }
}
