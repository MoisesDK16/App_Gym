import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Clientes } from '../../../../models/Clientes';
import { ProductoService } from '../../../../services/producto-service';
import { FacturacionCajaService } from '../../../../services/facturacion-caja.service';
import { ClienteService } from '../../../../services/cliente-service';
import { PlanService } from '../../../../services/plan-service';
import { Planes } from '../../../../models/Planes';
import { DetalleMembresia } from '../../../../models/DetalleMembresia';
import { Factura } from '../../../../models/Factura';
import { Membresia } from '../../../../models/Membresia';
import { MembresiaService } from '../../../../services/membresia.service';

@Component({
  selector: 'app-membresiaF',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './membresiaF.component.html',
  styleUrl: './membresiaF.component.css',
})
export class MembresiaComponentF {
  id_cliente: string = '';
  id_plan: number;

  ruc: string = '54656465465';

  estado: string = '';
  cliente: Clientes = new Clientes('', '', '', '', '', '', '', '', '');
  plan: Planes = new Planes(0, '', '', 0, 0, '');
  detalle: DetalleMembresia = new DetalleMembresia(
    0,
    0,
    0,
    { idFactura: 0 },
    { idMembresia: 0 }
  );
  factura: Factura = new Factura(
    0,
    { id_cliente: '', nombre: '', primer_apellido: '' }, // Objeto cliente con id_cliente
    '',
    new Date(), // fecha_emision
    '', // metodo_pago
    0, // subtotal
    0, // iva
    0 // total
  );

  membresia: Membresia = new Membresia(
    0,
    { id_cliente: '' },
    { id_plan: 0 },
    new Date(),
    new Date(),
    ''
  );

  constructor(
    private _FacturaService: FacturacionCajaService,
    private _DetalleService: FacturacionCajaService,
    private _ClienteService: ClienteService,
    private _PlanService: PlanService,
    private _MembresiaService: MembresiaService
  ) {}

  ngOnInit(): void {
    console.log('Componente de productos cargado');
  }

  resetEstado() {
    this.estado = '';
  }

  resetDetalle() {
    this.detalle = new DetalleMembresia(
      0,
      0,
      0,
      { idFactura: 0 },
      { idMembresia: 0 }
    );
  }

  buscarCliente(): void {
    this._ClienteService.unoCliente(this.id_cliente).subscribe((data) => {
      this.cliente = data;
      console.log(this.cliente);
    });
  }

  buscarPlan(): void {
    this._PlanService.buscarPlanId(this.id_plan).subscribe((data) => {
      this.plan = data;
      console.log(this.plan);
    });
  }

  async generarFactura(): Promise<void> {
    this.factura = {
      idFactura: 0,
      cliente: {
        id_cliente: this.cliente.id_cliente,
        nombre: this.cliente.nombre,
        primer_apellido: this.cliente.primer_apellido,
      },
      ruc: this.ruc,
      fechaEmision: new Date(),
      metodoPago: 'EFECTIVO',
      subtotal: this.plan.costo,
      iva: 0,
      total: this.plan.costo,
    };

    this._FacturaService.generarFactura(this.factura).subscribe((data) => {
      this.factura = data;
      console.log("FACTURA GENERADA: ", this.factura);
    });
  }

  async registrarMembresia(): Promise<void> {

    let fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + 30);

    console.log("Fecha Fin:", fechaFin);

    this.membresia = {
      idMembresia: 0,
      cliente: { id_cliente: this.cliente.id_cliente },
      plan: { id_plan: this.plan.id_plan },
      fechaInicio: new Date(),
      fechaFin: fechaFin,
      estado: 'ACTIVO',
    };

    this.membresia = await this._MembresiaService.registrar(this.membresia).toPromise();
    console.log("MEMBRESIA GENERADA: ", this.membresia);
  }


  async registrarDetalle(): Promise<void> {
    console.log("FACTURA ID: ", this.factura.idFactura);
    console.log("MEMBRESIA ID: ", this.membresia.idMembresia);

    this.detalle = {
      factura: { idFactura: this.factura.idFactura },
      membresia: { idMembresia: this.membresia.idMembresia },
      precio: this.plan.costo,
      cantidad: 1,
      total: this.plan.costo,
    };

    this.detalle = await this._DetalleService.generarDetalleMembresia(this.detalle).toPromise();
    console.log("DETALLE GENERADO: ", this.detalle);
  }

  async pagar(): Promise<void> {
    await this.generarFactura();
    await this.registrarMembresia();
    await this.registrarDetalle();
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
