import { Component, OnInit, ViewChild } from '@angular/core';
import { Planes } from '../../../models/Planes';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PlanService } from '../../../services/plan-service';

@Component({
  selector: 'app-planes',
  standalone: true,
  imports: [NgFor, FormsModule, MatTableModule, MatPaginatorModule],
  templateUrl: './planes.component.html',
  styleUrl: './planes.component.css'
})
export default class PlanesComponent implements OnInit{

  planes: Planes[] = [];
  plan: Planes = new Planes(0, '', '', 0, 0);
  estado: string = '';
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'costo', 'duracion_dias', 'acciones'];
  dataSource!: MatTableDataSource<Planes>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 10;
  currentPage = 0;
  totalItems = 0;

  constructor(private planService: PlanService) {}

  ngOnInit(): void {
    this.listarPlanes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  resetEstado() {
    this.estado = '';
    this.plan = new Planes(0, '', '', 0, 0);
  }

  listarPlanes(): void {
    this.planService.listarPlanes(this.currentPage, this.pageSize).subscribe((data: any) => {
      this.planes = data.content;
      this.dataSource = new MatTableDataSource<Planes>(this.planes);
      this.totalItems = data.totalElements;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      console.log(this.planes);
    });
  }

  registrarPlan(): void {
    this.planService.registrarPlan(this.plan).subscribe((data: any) => {
      console.log(data);
      this.listarPlanes();
      this.closeModal();
    });
  }

  actualizarPlan(): void {
    this.planService.actualizarPlan(this.plan).subscribe((data: any) => {
      console.log(data);
      this.listarPlanes();
      this.closeModal();
      this.resetEstado();
    });
  }

  eliminarPlan(id: number): void {
    this.planService.eliminarPlan(id).subscribe((data: any) => {
      console.log(data);
      this.listarPlanes();
    });
  }

  unoPlan(id: number): void {
    console.log(id);
    this.planService.buscarPlanId(id).subscribe((data: Planes) => {
      this.plan = data;
      console.log(this.plan);
      this.estado = 'actualizar';
      this.openModal();
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.listarPlanes();
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
