import { Component, OnInit, ViewChild } from '@angular/core';
import { Planes } from '../../../models/Planes';
import { PlanService } from '../../../services/plan-service';
import { CommonModule, NgFor } from '@angular/common';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AdminComponent } from '../../../headers/admin/admin.component';
import { ServicioService } from '../../../services/servicio.service';
import { Servicios } from '../../../models/Servicios';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-planes',
  standalone: true,
  imports: [NgFor, MatTableModule, MatPaginatorModule, AdminComponent, RouterLink, CommonModule],
  templateUrl: './catalogo-planes.component.html',
  styleUrl: './catalogo-planes.component.css'
})
export default class CatalogoPlanesComponent implements OnInit{

  planes: Planes[] = [];
  servicios: Servicios[] = [];

  displayedColumns: string[] = ['id_plan', 'nombre', 'precio', 'duracion','imagen', 'acciones'];
  dataSource!: MatTableDataSource<Planes>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 10;
  currentPage = 0;
  totalItems = 0;


  ngOnInit(): void {
    this.getPlanes();
    this.getServicios();
  }

  constructor(private planService: PlanService, private servicioService: ServicioService, private router: Router){}

  getPlanes(): void {
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

  getServicios(): void {
    this.servicioService.listarServicios().subscribe((data: any) => {
      this.servicios = data;
      console.log(this.servicios);
    });
  }

  openCheckout() {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/checkout']));
    window.open(url, '_blank');
  }

}
