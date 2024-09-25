import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MembresiaService } from '../../../../services/membresia.service';
import { AuthService } from '../../../../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { ICreateOrderRequest, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';
import { environment } from '../../../../../environments/environment';
import { FacturacionCajaService } from '../../../../services/facturacion-caja.service';
import { PlanService } from '../../../../services/plan-service';
import { Factura } from '../../../../models/Factura';
import { DetalleMembresia } from '../../../../models/DetalleMembresia';
import { Clientes } from '../../../../models/Clientes';

@Component({
  selector: 'app-user-membresia',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, NgxPayPalModule],
  templateUrl: './user-membresia.component.html',
  styleUrl: './user-membresia.component.css'
})
export default class UserMembresiaComponent {

  cliente: Clientes;
  membresia: any;
  checkoutOpended: boolean = false;
  public payPalConfig?: IPayPalConfig;

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

  detalle: DetalleMembresia = new DetalleMembresia(
    0,
    0,
    0,
    { idFactura: 0 },
    { idMembresia: 0 }
  );

  facturaResponse: any;

  constructor(private _membresiaService: MembresiaService, private _authService: AuthService, private _planService: PlanService, 
    private _facturacionService: FacturacionCajaService, private _MembresiaService: MembresiaService,
    private _DetalleService: FacturacionCajaService) { }

  ngOnInit() {
    this.getCliente();
    this.getMembresia();
    this.initConfig();
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


  renovarMembresia(): void {

    if (this.membresia.estado === 'INACTIVO') {
      const cantidad_dias = this.membresia.plan.duracion_dias;
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

      this._membresiaService.renovarMembresia(formData, this.membresia.idMembresia).subscribe({
        next: async (data) => {
          console.log('Membresía renovada:', data);
          await this.generarFacturaRenovacion();
          await this.generarDetalleFacturaRenovacion();
          await this.generarFacturaPDF();
        },
        error: (error) => {
          console.error('Error al renovar la membresía:', error);
        },
      });
    }else{
      const cantidad_dias = this.membresia.plan.duracion_dias;

      const fechaInicio = new Date(this.membresia.fechaInicio);
      fechaInicio.setDate(fechaInicio.getDate() + 1);
      console.log(fechaInicio);
    

      const fechaFin =  new Date(this.membresia.fechaFin);
      fechaFin.setDate((fechaFin.getDate()+1) + cantidad_dias);
      console.log(fechaFin);

      const formData = new FormData();
      formData.append('fechaInicio', fechaInicio.toISOString());
      formData.append('fechaFin', fechaFin.toISOString());

      this._membresiaService.renovarMembresia(formData, this.membresia.idMembresia).subscribe({
        next: async (data) => {
          console.log('Membresía renovada:', data);
          await this.generarFacturaRenovacion();
          await this.generarDetalleFacturaRenovacion();
          await this.generarFacturaPDF();
        },
        error: (error) => {
          console.error('Error al renovar la membresía:', error);
        },
      });
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
                value: this.membresia.plan.costo.toString(),
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: this.membresia.plan.costo.toString(),
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
                    value: this.membresia.plan.costo.toString(),
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
        this.renovarMembresia();
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
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

  getCliente() {
    this.cliente = this._authService.getCliente();
    console.log(this.cliente);
    return this._authService.getCliente(); 
  }

  async getMembresia(){
    this._membresiaService.getMembresiaByCliente(this.cliente.id_cliente).subscribe((data)=> {
      this.membresia = data;
      console.log(this.membresia);
    });
  }

  eliminarMembresia(idMembresia: number) {
    this._MembresiaService.eliminarMembresia(idMembresia).subscribe({
      next: (data) => {
        console.log('Membresía eliminada:', data);
        this.getMembresia();
      },
      error: (error) => {
        console.error('Error al eliminar la membresía:', error);
        alert('No puede eliminar su membresia ya que sigue activa');
      },
    });
  }

  
  abrirCheckout() {
    this.checkoutOpended = true;
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

}
