import { Component, OnInit, ViewChild } from '@angular/core';
import { Planes, PlanResponse } from '../../../models/Planes';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PlanService } from '../../../services/plan-service';
import { ServicioService } from '../../../services/servicio.service';
import { Servicios } from '../../../models/Servicios';
import { AuthService } from '../../../services/auth.service';
import { MembresiaService } from '../../../services/membresia.service';

@Component({
  selector: 'app-planes',
  standalone: true,
  imports: [NgFor, FormsModule, MatTableModule, MatPaginatorModule, NgIf],
  templateUrl: './planes.component.html',
  styleUrl: './planes.component.css',
})
export default class PlanesComponent implements OnInit {
  planes: Planes[] = [];
  plan2: any;
  servicios: Servicios[] = [];
  serviciosSeleccionados: Servicios[] = [];
  plan: Planes = new Planes(0, '', '', 0, 0, '');
  servicio: Servicios = new Servicios(
    { id_categoria: 0, categoria: '' },
    '',
    0
  );
  estado: string = '';
  displayedColumns: string[] = [
    'id',
    'nombre',
    'descripcion',
    'costo',
    'duracion_dias',
    'acciones',
  ];
  dataSource!: MatTableDataSource<Planes>;
  selectedFile: File | null = null;
  myModal = document.getElementById('myModal');

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 10;
  currentPage = 0;
  totalItems = 0;

  constructor(
    private planService: PlanService,
    private servicioService: ServicioService,
    
  ) {}

  ngOnInit(): void {
    this.listarPlanes();
    this.listarServicios();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  resetEstado() {
    this.estado = '';
    this.plan = new Planes(0, '', '', 0, 0, '');
    this.serviciosSeleccionados = [];
  }

    listarPlanes(): void {
    this.planService
      .listarPlanes(this.currentPage, this.pageSize)
      .subscribe((data: any) => {
        this.planes = data.content;
        this.dataSource = new MatTableDataSource<Planes>(this.planes);
        this.totalItems = data.totalElements;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        console.log(this.planes);
      });
  }

  listarServicios(): void {
    this.servicioService.listarServicios().subscribe((data: any) => {
      this.servicios = data;
      console.log(this.servicios);
    });
  }

  registrarPlan(): void {
    const plan = new FormData();
    plan.append('nombre', this.plan.nombre);
    plan.append('descripcion', this.plan.descripcion);
    plan.append('costo', this.plan.costo.toString());
    plan.append('duracion_dias', this.plan.duracion_dias.toString());

    // if (this.selectedFile) {
    //   plan.append('imagen', this.selectedFile);
    // } else {
    //   console.warn('No se ha seleccionado ningún archivo.');
    // }

    this.planService.registrarPlan(plan).subscribe((data: any) => {
      console.log(data);
      this.listarPlanes();
      this.closeModal();
      this.resetEstado();
    });
  }


  onFileSelected(event: Event, id_plan: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Archivo seleccionado:', file);
      let formData = new FormData();
      formData.append('imagen', file);
      this.planService.insertarImagen(formData, id_plan).subscribe((data: any) => {
        console.log(data);
      });
    }
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

  unoPlan2(id: number): void {
    this.planService.buscarPlanId(id).subscribe((data: any) => {
      this.plan2 = {
        id_plan: data.id_plan,
        nombre: data.nombre,
        descripcion: data.descripcion,
        costo: data.costo,
        duracion_dias: data.duracion_dias,
        servicios: data.servicios,
      };
      console.log('PLAN 2: ', this.plan2);
      this.estado = 'servicios';
    });
  }


  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.listarPlanes();
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  async addServicio(id_servicio: any): Promise<void> {
    console.log('Plan 2 jejejeje: ', this.plan2);
    
    try {
      const data = await this.servicioService.unoServicio(id_servicio).toPromise();
      this.servicio = data? data : new Servicios({ id_categoria: 0, categoria: '' }, '', 0);
  
      if (this.plan2.servicios.some((s:any) => s.id_servicio === this.servicio.id_servicio)) {
        console.log('El servicio ya está en la lista');
        alert('No puedes añadir servicios repetidos al plan');
        return;
      }
  
      this.plan2.servicios.push(this.servicio);
      this.serviciosSeleccionados.push(this.servicio);
      
      await this.añadirServicioApi();
      this.listarPlanes();
  
      console.log(
        'Servicio añadido correctamente: ',
        this.servicio,
        'Lista de servicios: ',
        this.serviciosSeleccionados
      );
      
    } catch (error) {
      console.error('Error añadiendo el servicio: ', error);
    }
  }
  


  async removeServicio(id_servicio: any): Promise<void> {
    this.servicioService
      .unoServicio(id_servicio)
      .subscribe(async (data: Servicios) => {
        this.servicio = data;
        this.plan2.servicios.splice(this.plan2.servicios.indexOf(this.servicio), 1);
        console.log('SERVICIOOOO: ', this.servicio);
        this.serviciosSeleccionados = this.serviciosSeleccionados.filter(
          (servicio) => servicio.id_servicio !== this.servicio.id_servicio
        );
        await this.eliminarServicioApi(this.servicio.id_servicio);

        console.log(
          'Servicio eliminado correctamente: ',
          this.servicio,
          'Lista de servicios: ',
          this.serviciosSeleccionados
        );
      });
  }

  async añadirServicioApi(): Promise<void> {
    this.serviciosSeleccionados.forEach((servicio) => {
      this.planService
        .agregarServicio(this.plan2.id_plan, servicio.id_servicio)
        .subscribe((data: any) => {
          console.log(data);
          this.resetEstado();
        });
    });
  }

  async eliminarServicioApi(id_servicio: any): Promise<void> {
    this.planService
      .eliminarServicio(this.plan2.id_plan, id_servicio)
      .subscribe((data: any) => {
        console.log(data);
        this.resetEstado();
      });
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

  openModalServicios(): void {
    console.log(this.servicios);
    const myModal = document.getElementById('modalServices');
    if (myModal != null) {
      myModal.classList.add('show');
      myModal.style.display = 'block';
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.classList.add('modal-backdrop', 'fade', 'show');
      document.body.appendChild(backdrop);
    }
  }

  closeModalServicios(): void {
    const myModal = document.getElementById('modalServices');
    if (myModal != null) {
      myModal.classList.remove('show');
      myModal.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    }
  }
}
