import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MembresiaService } from '../../../services/membresia.service';
import { DatePipe, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanService } from '../../../services/plan-service';
import { Planes } from '../../../models/Planes';

@Component({
  selector: 'app-membresias',
  standalone: true,
  imports: [NgFor, FormsModule, MatTableModule, MatPaginatorModule, DatePipe],
  templateUrl: './membresias.component.html',
  styleUrl: './membresias.component.css',
})
export default class MembresiasComponent implements OnInit {
  membresias: any[] = [];
  planes: Planes[] | undefined;
  selectedEstado: string = 'TODOS';

  displayedColumns: string[] = [
    'ID cliente',
    'nombres',
    'plan',
    'costo',
    'fechaInicio',
    'fechaFin',
    'dias_restantes',
    'estado',
  ];

  dataSource!: MatTableDataSource<any>;
  selectedFile: File | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 10;
  currentPage = 0;
  totalItems = 0;

  constructor(
    private _membresiaService: MembresiaService,
    private _planService: PlanService
  ) {}

  ngOnInit(): void {
    this.getMembresias();
    this.listarPlanesCombo();
  }

  getMembresias(): void {
    this._membresiaService
      .getMembresias(this.currentPage, this.pageSize)
      .subscribe((data: any) => {
        this.membresias = data.content;
        this.dataSource = new MatTableDataSource<any>(this.membresias);
        this.dataSource.paginator = this.paginator;
        this.totalItems = data.totalElements;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        console.log(this.membresias);
      });
  }

  buscarCliente(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const valor = inputElement.value.trim();
    console.log(valor);
    const regexLetras = /[a-zA-Z]/;
    const regexNumeros = /[0-9]/;

    if (regexLetras.test(valor)) {
      this.getMembresiasByPrimerApellido(valor);
    } else if (regexNumeros.test(valor)) {
      this.getMembresiasByCliente(valor);
    }
  }

  getMembresiasByCliente(id_cliene: string): void {
    this._membresiaService.getMembresiasByCliente(id_cliene).subscribe({
      next: (data: any) => {
        if (data && data.length > 0) {
          this.membresias = data;
          this.dataSource = new MatTableDataSource<any>(this.membresias);
          this.dataSource.paginator = this.paginator;
        } else {
          this.getMembresias();
        }
      },
      error: (error) => {
        console.error('Error al obtener las membresías:', error);
      },
    });
  }

  getMembresiasByPrimerApellido(primerApellido: string): void {
    this._membresiaService
      .getMembresiasByPrimerApellido(primerApellido)
      .subscribe({
        next: (data: any) => {
          if (data && data.length > 0) {
            this.membresias = data;
            this.dataSource = new MatTableDataSource<any>(this.membresias);
            this.dataSource.paginator = this.paginator;
          } else {
            this.getMembresias();
          }
        },
        error: (error) => {
          console.error('Error al obtener las membresías:', error);
        },
      });
  }

  filtrarPorEstado($event: Event): void {
    const selectElement = $event.target as HTMLSelectElement;
    this.selectedEstado = selectElement.value.trim();
    console.log('Estado:', this.selectedEstado);

    if(selectElement.value === 'TODOS'){
      this.getMembresias();
    }else{
      this._membresiaService.getMembresiasByEstado(this.selectedEstado).subscribe({
        next: (data: any) => {
          if (data && data.length > 0) {
            this.membresias = data;
            this.dataSource = new MatTableDataSource<any>(this.membresias);
            this.dataSource.paginator = this.paginator;
          } else {
            this.getMembresias();
          }
        },
        error: (error) => {
          console.error('Error al obtener las membresías:', error);
        },
      });
    }
  }


  filtrarPorPlan($event: Event): void {
    const selectElement = $event.target as HTMLSelectElement;
    const planSeleccionado = selectElement.value.trim();
    console.log('Plan:', planSeleccionado);

    if (planSeleccionado === 'TODOS') {
      this.getMembresias();
    } else {
      this._membresiaService
        .getMembresiasByPlanNombre(planSeleccionado)
        .subscribe({
          next: (data: any) => {
            if (data && data.length > 0) {
              this.membresias = data;
              this.dataSource = new MatTableDataSource<any>(this.membresias);
              this.dataSource.paginator = this.paginator;
            } else {
              this.getMembresias();
            }
          },
          error: (error) => {
            console.error('Error al obtener las membresías:', error);
          },
        });
    }
  }

  async listarPlanesCombo(): Promise<void> {
    await this.getPlanes();
    const selectPlan = document.getElementById(
      'selectPlan'
    ) as HTMLSelectElement;

    const optionFirst = document.createElement('option');
    optionFirst.value = 'TODOS';
    optionFirst.text = 'TODOS';
    selectPlan.appendChild(optionFirst);

    if (this.planes) {
      this.planes.forEach((plan: any) => {
        console.log('jaajjajaPlan:', plan.nombre);
        const option = document.createElement('option');
        option.value = plan.nombre;
        option.text = plan.nombre;
        selectPlan.appendChild(option);
      });
    }
  }

  async getPlanes(): Promise<void> {
    this.planes = (await this._planService
      .listarPlanes2()
      .toPromise()) as Planes[];
    console.log('planes: ', this.planes);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getMembresias();
  }
}
