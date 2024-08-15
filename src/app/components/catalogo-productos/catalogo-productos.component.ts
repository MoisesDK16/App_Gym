import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../services/producto-service';
import { Productos } from '../../models/Productos';
import { NgFor } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-catalogo-productos',
  standalone: true,
  imports: [NgFor,  MatTableModule, MatPaginatorModule],
  templateUrl: './catalogo-productos.component.html',
  styleUrl: './catalogo-productos.component.css'
})
export class CatalogoProductosComponent implements OnInit{

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

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getProductos();
  }

}
