import { Component, Input } from '@angular/core';
import {
  ICreateOrderRequest,
  IPayPalConfig,
  NgxPayPalModule,
} from 'ngx-paypal';
import { CheckoutService } from '../../../services/checkout.service';
import { Clientes } from '../../../models/Clientes';
import { Observable, Subscription } from 'rxjs';
import PlanesComponent from "../../admin/planes/planes.component";
import CatalogoPlanesComponent from "../catalogo-planes/catalogo-planes.component";
import { PlanService } from '../../../services/plan-service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Factura } from '../../../models/Factura';
import { Membresia } from '../../../models/Membresia';
import { DetalleMembresia } from '../../../models/DetalleMembresia';
import { FacturacionCajaService } from '../../../services/facturacion-caja.service';
import { MembresiaService } from '../../../services/membresia.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [NgxPayPalModule, NgIf,NgFor,  PlanesComponent, CatalogoPlanesComponent, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export default class CheckoutComponent {
  public payPalConfig?: IPayPalConfig;

  cliente: Clientes = this._checkoutService.getCliente();
  id_plan: number = 0;
  plan: any;
  servicios: any;
  isPlanLoaded: boolean = false;

  factura: Factura = new Factura(
    0,
    { id_cliente: '', nombre: '', primer_apellido: '' }, 
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

  detalle: DetalleMembresia = new DetalleMembresia(
    0,
    0,
    0,
    { idFactura: 0 },
    { idMembresia: 0 }
  );


  constructor(private _checkoutService: CheckoutService, private _planService: PlanService, 
    private _facturaService: FacturacionCajaService, private _MembresiaService: MembresiaService,
    private _DetalleService: FacturacionCajaService) {
  }

  async ngOnInit(): Promise<void> {
    this.recibirIdPlan();
    await this.obtenerDatosPlan();
    this.cargarDatosClienteForm();
    this.cargarDatosPlanForm();
    console.log(this.cliente);
    this.initConfig();
    console.log("id_plan:", this.id_plan);
  }

  resetFactura(): void {
    this.factura = new Factura(
      0,
      { id_cliente: '', nombre: '', primer_apellido: '' },
      '',
      new Date(),
      '',
      0,
      0,
      0
    );
  }


  resetMembresia() {
    this.membresia = new Membresia(
      0,
      { id_cliente: '' },
      { id_plan: 0 },
      new Date(),
      new Date(),
      ''
    );
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


  resetAll(): void {
    this.resetFactura();
    this.resetMembresia();
    this.resetDetalle();
  }

  async generarFactura(): Promise<void> {
    this.factura = {
      idFactura: 0,
      cliente: {
        id_cliente: this.cliente.id_cliente,
        nombre: this.cliente.nombre,
        primer_apellido: this.cliente.primer_apellido,
      },
      ruc: '54656465465',
      fechaEmision: new Date(),
      metodoPago: 'EN LINEA',
      subtotal: this.plan.costo,
      iva: 0,
      total: this.plan.costo,
    };

    this._facturaService.generarFactura(this.factura).subscribe((data) => {
      this.factura = data;
      console.log("FACTURA GENERADA: ", this.factura);
    });
  }

  async registrarMembresia(): Promise<void> {

    let fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + this.plan.duracion_dias);

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
    console.log("DETALLE GENERADO: ", this.detalle);;
  }


  async generarFacturaPDF(): Promise<void> {
    this._facturaService.downloadFacturaMembresiaPDF(this.factura.idFactura).subscribe(
      async (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'facturaPersonalMembresia.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        let destinatario = this.cliente.correo;
        let asunto = "Factura de Membresia";
        let mensaje = "Gracias por su compra";
        await this.enviarFacturaEmail(destinatario, asunto, mensaje, data);
        this.resetAll();
      }
    );
  }

  async enviarFacturaEmail(destinatario: string, asunto: string, mensaje: string, data: Blob): Promise<void> { 
    this._facturaService.enviarFacturaEmail(destinatario, asunto, mensaje, data).subscribe(
      (data) => {
        console.log('Correo enviado:', data);
      }
    );
  }

  async generarFacturaYDetalles(): Promise<void> {
    try {
      await this.generarFactura();
      await this.registrarMembresia();
      await this.registrarDetalle();
      await this.generarFacturaPDF();
    } catch (error) {
      console.error('Error al generar factura y detalles: ', error);
    }
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: environment.clientId,
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: this.plan.costo.toString(),
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: this.plan.costo.toString(),
                  },
                },
              },
              items: [
                {
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'USD',
                    value: this.plan.costo.toString(),
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details: any) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );
        this.generarFacturaYDetalles();
        setTimeout(() => {
          alert('Pago realizado con éxito');
        }, 1000);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        alert('Pago cancelado');
      },
      onError: (err) => {
        console.log('OnError', err);
        alert('Error al procesar el pago');
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }


  recibirIdPlan(): void {
    const idPlan = localStorage.getItem('id_plan');  
    if (idPlan) {
      this.id_plan = +idPlan;  
      console.log("Id plan recibido:", this.id_plan);
    } else {
      console.error("No se encontró el id_plan en localStorage");
    }
  }

  async obtenerDatosPlan(): Promise<void> {
    this.plan = await this._planService.buscarPlanId(this.id_plan).toPromise();
    this.servicios = this.plan.servicios;
    console.log("Plan obtenido:", this.plan);
    console.log("Servicios obtenidos:", this.servicios);
  }


  cargarDatosClienteForm(): void {
    const id_cliente = document.getElementById('id_cliente') as HTMLInputElement;
    const nombres = document.getElementById('nombres') as HTMLInputElement;
    const correo = document.getElementById('correo') as HTMLInputElement;
    const telefono = document.getElementById('telefono') as HTMLInputElement;
    id_cliente.value = this.cliente.id_cliente;
    nombres.value = this.cliente.nombre+" "+this.cliente.primer_apellido+" "+this.cliente.segundo_apellido;
    correo.value = this.cliente.correo;
    telefono.value = this.cliente.telefono;
  }

  cargarDatosPlanForm(): void {
    const nombre_plan = document.getElementById('nombre_plan') as HTMLInputElement;
    const costo = document.getElementById('costo') as HTMLInputElement;
    const duracion_dias = document.getElementById('duracion_dias') as HTMLInputElement;
    const descripcion = document.getElementById('descripcion') as HTMLInputElement;
    nombre_plan.value = this.plan.nombre;
    costo.value = this.plan.costo+" $ ";
    duracion_dias.value = this.plan.duracion_dias+" dias ";
    descripcion.value = this.plan.descripcion;
  }
  
}
