import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../services/producto-service';
import { Productos } from '../../models/Productos';
import { DatePipe, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Categorias } from '../../models/Categorias';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [NgFor, FormsModule, MatTableModule, MatPaginatorModule, DatePipe],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit, AfterViewInit {

  productos: Productos[] = [];
  producto: Productos = new Productos('', '', { id_categoria: '', categoria: '' }, 0, 0, 0, 0, new Date(), '');
  estado: string = "";
  margen_ganancias: number[] = [5, 10, 15, 20, 25, 30, 40, 50];
  margen_ganancia_porcentual: number = 0;
  categorias: Categorias[] = [];
  displayedColumns: string[] = ['id_producto', 'nombre', 'categoria', 'precio_compra', 'precio_venta', 'stock','fecha_caducacion', 'acciones'];
  dataSource!: MatTableDataSource<Productos>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 10;
  currentPage = 0;
  totalItems = 0;

  constructor(private servicio_productos: ProductoService) { }

  ngOnInit(): void {
    this.getProductos();
    this.listarCategorias();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  resetEstado() {
    this.estado = "";
    this.producto = new Productos('', '', { id_categoria: '', categoria: '' } , 0, 0, 0, 0, new Date(), '');
  }

  calcularPrecioVenta(): void {
    console.log("Precio de compra:", this.producto.precio_compra);
    console.log("Margen de ganancia Porcentual:", this.margen_ganancia_porcentual);

    if (!isNaN(this.margen_ganancia_porcentual) && !isNaN(this.producto.precio_compra)) {
      this.producto.margen_ganancia = this.producto.precio_compra * (this.margen_ganancia_porcentual / 100);
      this.producto.precio_venta = this.producto.margen_ganancia + this.producto.precio_compra;
      console.log("Precio de venta calculado:", this.producto.precio_venta);
    } else {
      console.error("Margen de ganancia o precio de compra no válido");
    }
  }

  printMargenGanancia(): void {
    console.log("Margen de ganancia actual:", this.producto.margen_ganancia);
  }

  parseNumber(value: string): number {
    return parseFloat(value.replace('%', ''));
  }

  getProductos(): void {
    this.servicio_productos.getProductos(this.currentPage, this.pageSize).subscribe((data: any) => {
      this.productos = data.content;
      this.dataSource = new MatTableDataSource<Productos>(this.productos);
      this.totalItems = data.totalElements;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      console.log(this.productos);
    });
  }

  registrarProducto(): void {
    if (this.producto.categoria && this.producto.categoria.id_categoria) {
       this.servicio_productos.registrarProducto(this.producto).subscribe((data: any) => {
          console.log(data);
          this.getProductos();
          this.closeModal();
       });
    } else {
       console.error("La categoría no puede ser nula");
    }
 }

  unoProducto(id_producto: string): void {
    this.servicio_productos.unoProducto(id_producto).subscribe((data: Productos) => {
      this.producto = data;
      console.log(this.producto);
      this.openModal();
      this.estado = "actualizar";
      console.log(this.estado);
    });
  }

  actualizarProducto(): void {
    this.servicio_productos.actualizarProducto(this.producto).subscribe((data: Productos) => {
      console.log(data);
      this.getProductos();
      this.closeModal();
      this.resetEstado();
    });
  }

  eliminarProducto(id_producto: string): void {
    this.servicio_productos.eliminarProducto(id_producto).subscribe((data: any) => {
      console.log(data);
      this.getProductos();
      this.closeModal();
    });
  }

  listarCategorias(): void {
    this.servicio_productos.listarCategorias().subscribe((data: any) => {
      this.categorias = data;
      console.log(this.categorias);
    });
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
}
