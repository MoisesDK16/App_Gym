import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MembresiaService } from '../../../services/membresia.service';
import { DatePipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanService } from '../../../services/plan-service';
import { Planes } from '../../../models/Planes';
import { FacturacionCajaService } from '../../../services/facturacion-caja.service';
import { Clientes } from '../../../models/Clientes';
import { Factura } from '../../../models/Factura';
import { DetalleMembresia } from '../../../models/DetalleMembresia';
import { Membresia } from '../../../models/Membresia';
import { ClienteService } from '../../../services/cliente-service';

@Component({
  selector: 'app-membresias',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    KeyValuePipe,
  ],
  templateUrl: './membresias.component.html',
  styleUrl: './membresias.component.css',
})
export default class MembresiasComponent implements OnInit {
  membresias: any[] = [];
  membresia: any;
  planes: Planes[] | undefined;
  selectedEstado: string = 'TODOS';
  membresiaUno: any;

  factura: Factura = new Factura(
    0,
    { id_cliente: '', nombre: '', primer_apellido: '' }, // Objeto cliente con id_cliente
    '',
    new Date(), // fecha_emision
    'EFECTIVO', // metodo_pago
    0, // subtotal
    0, // iva
    0 // total
  );

  facturaResponse: any;

  detalle: DetalleMembresia = new DetalleMembresia(
    0,
    0,
    0,
    { idFactura: 0 },
    { idMembresia: 0 }
  );

  displayedColumns: string[] = [
    'ID cliente',
    'nombres',
    'plan',
    'costo',
    'fechaInicio',
    'fechaFin',
    'dias_restantes',
    'estado',
    'acciones',
  ];

  dataSource!: MatTableDataSource<any>;
  selectedFile: File | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 10;
  currentPage = 0;
  totalItems = 0;

  constructor(
    private _membresiaService: MembresiaService,
    private _planService: PlanService,
    private _clienteService: ClienteService,
    private _facturacionService: FacturacionCajaService
  ) {}

  ngOnInit(): void {
    this.getMembresias();
    this.listarPlanesCombo();
    this.deactivarMembresias();
  }

  resetAll(): void {
    this.factura = new Factura(
      0,
      { id_cliente: '', nombre: '', primer_apellido: '' }, // Objeto cliente con id_cliente
      '',
      new Date(), // fecha_emision
      'EFECTIVO', // metodo_pago
      0, // subtotal
      0, // iva
      0 // total
    );
    this.facturaResponse = null;
    this.detalle = new DetalleMembresia(
      0,
      0,
      0,
      { idFactura: 0 },
      { idMembresia: 0 }
    );
  }

  async generarFacturaRenovacion(): Promise<void> {
    console.log('membresia 2:', this.membresia);
    this.factura.cliente = this.membresia.cliente;
    this.factura.subtotal = this.membresia.plan.costo;
    this.factura.iva = 0;
    this.factura.total = this.membresia.plan.costo;

    this.facturaResponse = await this._facturacionService
      .generarFactura(this.factura)
      .toPromise();
  }

  async generarDetalleFacturaRenovacion(): Promise<void> {
    this.detalle.factura.idFactura = this.facturaResponse.idFactura;
    this.detalle.membresia.idMembresia = this.membresia.idMembresia;
    this.detalle.precio = this.membresia.plan.costo;
    this.detalle.cantidad = 1;
    this.detalle.total = this.membresia.plan.costo;

    try {
      const data = await this._facturacionService
        .generarDetalleMembresia(this.detalle)
        .toPromise();
      console.log('Detalle generado:', data);
    } catch (error) {
      console.error('Error al generar el detalle:', error);
    }
  }

  async generarFacturaPDF(): Promise<void> {
    this._facturacionService
      .downloadFacturaMembresiaPDF(this.facturaResponse.idFactura)
      .subscribe(async (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'facturaPersonalMembresiaRenovacion.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        let destinatario = this.membresia.cliente.correo;
        let asunto = 'Factura de Membresia';
        let mensaje = 'Gracias por su compra';
        await this.enviarFacturaEmail(destinatario, asunto, mensaje, data);
        this.resetAll();
      });
  }

  async enviarFacturaEmail(
    destinatario: string,
    asunto: string,
    mensaje: string,
    data: Blob
  ): Promise<void> {
    this._facturacionService
      .enviarFacturaEmail(destinatario, asunto, mensaje, data)
      .subscribe((data) => {
        console.log('Correo enviado:', data);
      });
  }

  renovarMembresia(id: number): void {
    const membresia = this.membresias.find((m) => m.idMembresia === id);
    if (!membresia) {
      console.error('Membresía no encontrada');
      return;
    }

    const cantidad_dias = membresia.plan.duracion_dias;

    const fechaInicio = new Date().toLocaleString('en-US', {
      timeZone: 'America/Guayaquil',
    });
    const fechaInicioDate = new Date(fechaInicio);
    fechaInicioDate.setDate(fechaInicioDate.getDate() + 1);

    const fechaFin = new Date(fechaInicioDate);
    fechaFin.setDate(fechaFin.getDate() + cantidad_dias);

    const formData = new FormData();
    formData.append('fechaInicio', fechaInicioDate.toISOString());
    formData.append('fechaFin', fechaFin.toISOString());

    this._membresiaService.renovarMembresia(formData, id).subscribe({
      next: async (data) => {
        console.log('Membresía renovada:', data);
        this.getMembresias();
        await this.obtenerMembresia(id);
        await this.generarFacturaRenovacion();
        await this.generarDetalleFacturaRenovacion();
        await this.generarFacturaPDF();
      },
      error: (error) => {
        console.error('Error al renovar la membresía:', error);
      },
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

    if (selectElement.value === 'TODOS') {
      this.getMembresias();
    } else {
      this._membresiaService
        .getMembresiasByEstado(this.selectedEstado)
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

  filtrarPorPlan($event: Event): void {
    const selectElement = $event.target as HTMLSelectElement;
    const planSeleccionado = selectElement.value.trim();
    console.log('Plan:', planSeleccionado);
    console.log('Plan:', typeof planSeleccionado);

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

  deactivarMembresias(): void {
    this._membresiaService.desactivarMembresias().subscribe({
      next: (data) => {
        this.getMembresias();
      },
      error: (error) => {
        console.error('Error al desactivar las membresías:', error);
      },
    });
  }

  async obtenerMembresia(id: number): Promise<void> {
    this.membresia = await this._membresiaService.uno(id).toPromise();
    console.log('membresia:', this.membresia);
  }

  unoMembresia(id: number): void {
    this.membresiaUno = this.membresias.find((m) => m.idMembresia === id);
    console.log('membresia:', this.membresiaUno);
  }

  eliminarMembresia(id: number): void {

    let answer= confirm('¿Está seguro de eliminar la membresía?');

    if(answer){
      this._membresiaService.eliminarMembresia(id).subscribe({
        next: () => {
          // Crear un objeto que simule el evento
          const simulatedEvent = {
            target: {
              value: 'INACTIVO'
            }
          } as unknown as Event;
    
          // Llamar al método filtrarPorPlan pasando el objeto simulado
          this.filtrarPorEstado(simulatedEvent);
          alert('Membresía eliminada correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar la membresía:', err);
          alert('No se puede eliminar una membresía activa');
        },
      });
    }else{
      return;
    }
  }
  

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getMembresias();
  }

  openModalDetalles(id: number): void {
    this.unoMembresia(id);
    const modalDetalles = document.getElementById('modal-detalles-membresia');
    if (modalDetalles) {
      modalDetalles.style.display = 'block';
      modalDetalles.classList.add('show');
      const backdrop = document.createElement('div');
      backdrop.classList.add('modal-backdrop', 'fade', 'show');
      document.body.appendChild(backdrop);
    }
  }

  closeModalDetalles(): void {
    const modalDetalles = document.getElementById('modal-detalles-membresia');
    if (modalDetalles) {
      modalDetalles.style.display = 'none';
      modalDetalles.classList.remove('show');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    }
  }
}
