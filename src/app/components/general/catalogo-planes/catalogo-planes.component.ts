import { Component, OnInit, ViewChild } from '@angular/core';
import { Planes } from '../../../models/Planes';
import { PlanService } from '../../../services/plan-service';
import { NgFor } from '@angular/common';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AdminComponent } from '../../../headers/admin/admin.component';

@Component({
  selector: 'app-planes',
  standalone: true,
  imports: [NgFor, MatTableModule, MatPaginatorModule, AdminComponent],
  templateUrl: './catalogo-planes.component.html',
  styleUrl: './catalogo-planes.component.css'
})
export default class CatalogoPlanesComponent implements OnInit{

  planes: Planes[] = [];
  dataSource!: MatTableDataSource<Planes>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 10;
  currentPage = 0;
  totalItems = 0;


  ngOnInit(): void {
    this.listarPlanes();
  }

  constructor(private planService: PlanService){}

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

}
