import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../../services/producto-service';
import { Productos } from '../../../models/Productos';
import { NgFor } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AdminComponent } from '../../../headers/admin/admin.component';
import { Detalle } from '../../../models/Detalle';
import { CarroService } from '../../../services/carro.service';

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

  constructor(private _productoService: ProductoService, private _carroService: CarroService){}

  ngOnInit(): void {
    this.getProductos();
  }

  getProductos(): void {
    let fechaActual = new Date();
    console.log('Fecha actual: ', fechaActual);

    this._productoService
      .getProductos(this.currentPage, this.pageSize)
      .subscribe((response: any) => {

        if (response.content) {
          response.content.forEach((producto: any) => {
            let fechaCaducacionProducto = new Date(producto.fecha_caducacion);
            console.log(
              'Fecha caducación de producto:',
              fechaCaducacionProducto
            );

            if (fechaCaducacionProducto >= fechaActual && producto.stock > 0) {
              this.productos.push(producto);
            }
          });
        }

        this.dataSource = new MatTableDataSource(this.productos);
        this.totalItems = response.totalElements;

        this.productos.forEach((producto: any) =>
          console.log(typeof producto.fecha_caducacion)
        );

        // Asigna el paginador si existe
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      });
  }

  addDetalle(producto: Productos): void {
    let productoSelec: Productos;
    this._productoService.unoProducto(producto.idProducto).subscribe((productoSeleccionado) => {
      productoSelec = productoSeleccionado;
      console.log(productoSelec);
  
      const detalle: Detalle = new Detalle({ idProducto: productoSelec.idProducto , nombre: producto.nombre } ,
         productoSelec.precioVenta,
         0, 0, {
        idFactura: 0,
      });
      
      this._carroService.addToCarro(detalle, producto);
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getProductos();
  }

}
