import { Component } from '@angular/core';
import { Factura } from '../../../../models/Factura';
import { Detalle } from '../../../../models/Detalle';
import { FacturacionCajaService } from '../../../../services/facturacion-caja.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { DetalleMembresia } from '../../../../models/DetalleMembresia';

@Component({
  selector: 'app-facturas-membresias',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe],
  templateUrl: './facturas-membresias.component.html',
  styleUrl: './facturas-membresias.component.css',
})
export class FacturasRenovacionComponent {
  detalles: any[] = [];
  detallesFactura: any[] = [];
  estado: String = '';

  constructor(private _FacturaService: FacturacionCajaService) {}

  ngOnInit(): void {
    this.listarTodasFacturas();
  }

  listarFacturas(): void {
    this._FacturaService.listarFacturasMembresia().subscribe((data) => {
      this.detalles = data;
      console.log(this.detalles);
    });
  }

  listarDetallesFactura(idFactura: number): void {
    this._FacturaService.listarDetallesFactura(idFactura).subscribe((data) => {
      this.detallesFactura = data;
      console.log(this.detallesFactura);
      this.openModal();
    });
  }

  downloadFacturasPDF(): void {
    this._FacturaService.downloadFacturasPDF().subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'facturas.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  downloadFacturaPDF(idFactura: number): void {
    this._FacturaService
      .downloadFacturaPDF(idFactura)
      .subscribe((data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'facturaPersonal.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  //FILTROS

  filtrarPorFecha(): void {
    const select_dias = document.getElementById(
      'select-dias'
    ) as HTMLSelectElement;
    const select_metodoPago = document.getElementById(
      'select-metodoPago'
    ) as HTMLSelectElement;
    let fechaInicio = new Date();
    let fechaFin;
    let formattedFechaInicio = fechaInicio.toString().split('T')[0];
    let formattedFechaFin;

    switch (select_dias.value) {
      case '0':
        this.listarTodasFacturas();
        break;

      case '1':
        if (select_metodoPago.value == '0') {
          this.listarTodasFacturas();
          break;
        }
        fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate());
        formattedFechaFin = fechaFin.toISOString().split('T')[0];
        this._FacturaService
          .getAllMembresiaByFecha(
            formattedFechaInicio,
            formattedFechaFin,
            select_metodoPago.value
          )
          .subscribe((data) => {
            this.detalles = data;
          });
        break;

      case '7':
        if (select_metodoPago.value == '0') {
          this.listarTodasFacturas();
          break;
        }
        fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + 7);
        formattedFechaFin = fechaFin.toISOString().split('T')[0];
        this._FacturaService
          .getAllMembresiaByFecha(
            formattedFechaInicio,
            formattedFechaFin,
            select_metodoPago.value
          )
          .subscribe((data) => {
            this.detalles = data;
          });
        break;

      case '30':
        if (select_metodoPago.value == '0') {
          this.listarTodasFacturas();
          break;
        }
        fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + 30);
        formattedFechaFin = fechaFin.toISOString().split('T')[0];
        this._FacturaService
          .getAllMembresiaByFecha(
            formattedFechaInicio,
            formattedFechaFin,
            select_metodoPago.value
          )
          .subscribe((data) => {
            this.detalles = data;
          });
        break;

      case '60':
        if (select_metodoPago.value == '0') {
          this.listarTodasFacturas();
          break;
        }
        fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + 60);
        formattedFechaFin = fechaFin.toISOString().split('T')[0];
        this._FacturaService
          .getAllMembresiaByFecha(
            formattedFechaInicio,
            formattedFechaFin,
            select_metodoPago.value
          )
          .subscribe((data) => {
            this.detalles = data;
          });
        break;

      default:
        this.listarTodasFacturas();
        break;
    }
  }

  listarTodasFacturas(): void {
    const select_dias = document.getElementById(
      'select-dias'
    ) as HTMLSelectElement;
    const select_metodoPago = document.getElementById(
      'select-metodoPago'
    ) as HTMLSelectElement;

    select_dias.value = '30';
    select_metodoPago.value = '0';
    let fechaInicio = new Date();
    let fechaFin;
    let formattedFechaInicio = fechaInicio.toString().split('T')[0];
    let formattedFechaFin;
    fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + 30);
    formattedFechaFin = fechaFin.toISOString().split('T')[0];
    this._FacturaService
      .getAllMembresiaByFecha(formattedFechaInicio, formattedFechaFin, 'null')
      .subscribe((data) => {
        this.detalles = data;
      });
  }

  listarFacturasByCliente(event: Event): void {
    let clienteInput = event.target as HTMLInputElement;
    let clienteValue = clienteInput.value;
    console.log('Cliente: ', clienteValue);
    let verificaNumeros = /^[0-9]+$/;
    if (verificaNumeros.test(clienteValue)) {
      this._FacturaService.getAllMembresiaByClienteId(clienteValue).subscribe({
        next: (data) => {
          this.detalles = data;
          console.log(this.detalles);
        },
        error: (error) => {
          console.log(error);
          this.listarTodasFacturas();
        },
      });
    }else{
      this._FacturaService.getAllMembresiaByClienteCompleto(clienteValue).subscribe({
        next: (data) => {
          this.detalles = data;
          console.log(this.detalles);
        },
        error: (error) => {
          console.log(error);
          this.listarTodasFacturas();
        }
      });
    }
  }

  openModal(): void {
    const modalDiv = document.getElementById('detailsModal');
    if (modalDiv != null) {
      modalDiv.classList.add('show');
      modalDiv.style.display = 'block';
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.classList.add('modal-backdrop', 'fade', 'show');
      document.body.appendChild(backdrop);
    }
  }

  closeModal(): void {
    const modalDiv = document.getElementById('detailsModal');
    if (modalDiv != null) {
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
