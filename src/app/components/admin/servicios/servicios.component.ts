import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Servicios } from '../../../models/Servicios';
import { DatePipe, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Categorias } from '../../../models/Categorias';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ServicioService } from '../../../services/servicio.service';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [NgFor, FormsModule, MatTableModule, MatPaginatorModule, DatePipe],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export default class ServiciosComponent implements OnInit, AfterViewInit {

  servicios: Servicios[] = [];
  servicio: Servicios = new Servicios({id_categoria:0 ,categoria: '' },'', 0);
  estado: string = "";
  categorias: Categorias[] = [];
  categoria: Categorias = new Categorias('');
  displayedColumns: string[] = ['nombre', 'categoria', 'precio', 'acciones'];
  dataSource!: MatTableDataSource<Servicios>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 10;
  currentPage = 0;
  totalItems = 0;

  constructor(private _servicioService: ServicioService) { }

  ngOnInit(): void {
    this.getServicios();
    this.listarCategorias();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  resetEstado() {
    this.estado = "";
    this.servicio = new Servicios({id_categoria:0, categoria: '' },'', 0);
  }

  getServicios(): void {
    this._servicioService.listarServicios(this.currentPage, this.pageSize).subscribe((data: any) => {
      this.servicios = data.content;
      this.dataSource = new MatTableDataSource<Servicios>(this.servicios);
      this.totalItems = data.totalElements;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      console.log(this.servicios);
    });
  }

  registrarServicio(): void {
    this._servicioService.crearServicio(this.servicio).subscribe((data: any) => {
      console.log(data);
      this.getServicios();
      this.closeModal();
    });
  }

  unoServicio(id: number): void {
    this._servicioService.unoServicio(id).subscribe((data: Servicios) => {
      this.servicio = data;
      console.log(this.servicio);
      this.openModal();
      this.estado = "actualizar";
      console.log(this.estado);
    });
  }

  actualizarServicio(): void {
    this._servicioService.actualizarServicio(this.servicio).subscribe((data: Servicios) => {
      console.log(data);
      this.getServicios();
      this.closeModal();
      this.resetEstado();
    });
  }

  eliminarServicio(id: number): void {
    this._servicioService.eliminarServicio(id).subscribe((data: any) => {
      console.log(data);
      this.getServicios();
      this.closeModal();
    });
  }

  listarCategorias(): void {
    this._servicioService.listarCategorias().subscribe((data: any) => {
      this.categorias = data;
      console.log(this.categorias);
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getServicios();
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
