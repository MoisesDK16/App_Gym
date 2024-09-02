import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../../services/producto-service';
import { Productos } from '../../../models/Productos';
import { NgFor } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AdminComponent } from '../../../headers/admin/admin.component';
import { Detalle } from '../../../models/Detalle';

@Component({
  selector: 'app-catalogo-productos',
  standalone: true,
  imports: [NgFor,  MatTableModule, MatPaginatorModule, AdminComponent],
  templateUrl: './catalogo-productos.component.html',
  styleUrl: './catalogo-productos.component.css'
})
export default class CatalogoProductosComponent implements OnInit{

  productos: Productos[] = [];

  displayedColumns: string[] = ['id_producto', 'nombre', 'categoria', 'precio_compra', 'precio_venta', 'stock','fecha_caducacion', 'acciones'];
  dataSource!: MatTableDataSource<Productos>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 10;
  currentPage = 0;
  totalItems = 0;

  constructor(private servicio_producto: ProductoService){}

  ngOnInit(): void {
    this.getProductos();
  }

  getProductos(): void {
    this.servicio_producto.getProductos(this.currentPage, this.pageSize).subscribe((data: any) => {
      this.productos = data.content;
      this.dataSource = new MatTableDataSource<Productos>(this.productos);
      this.totalItems = data.totalElements;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      console.log(this.productos);
    });
  }

  addDetalle(producto: Productos): void {
    let productoSelec: Productos;
    this.servicio_producto.unoProducto(producto.idProducto).subscribe((productoSeleccionado) => {
      productoSelec = productoSeleccionado;
      console.log(productoSelec);
  
      const detalle: Detalle = new Detalle({ idProducto: productoSelec.idProducto , nombre: producto.nombre } ,
         productoSelec.precioVenta,
         0, 0, {
        idFactura: 0,
      });
      
      this.servicio_producto.addToCarro(detalle, producto);
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getProductos();
  }

}
