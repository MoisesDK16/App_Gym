import { Component, EventEmitter, OnInit, Output, Pipe } from '@angular/core';
import { ProductoService } from '../../../services/producto-service';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { first, firstValueFrom, map, Observable, of } from 'rxjs';
import { Detalle } from '../../../models/Detalle';
import { Productos } from '../../../models/Productos';
import {
  ICreateOrderRequest,
  IPayPalConfig,
  NgxPayPalModule,
} from 'ngx-paypal';
import { environment } from '../../../../environments/environment';
import { CarroService } from '../../../services/carro.service';
import { AuthService } from '../../../services/auth.service';
import { Clientes } from '../../../models/Clientes';
import { FacturacionCajaService } from '../../../services/facturacion-caja.service';
import { Factura } from '../../../models/Factura';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetallesCompraComponent } from '../modales/detalles-compra/detalles-compra.component';

@Component({
  selector: 'app-carro',
  standalone: true,
  imports: [NgFor, AsyncPipe, NgIf, NgxPayPalModule, DatePipe],
  templateUrl: './carro.component.html',
  styleUrl: './carro.component.css',
})
export default class CarroComponent implements OnInit {
  items$: Observable<{ detalle: Detalle[]; producto: Productos[] }[]>;
  subtotal$: Observable<number>;
  listaItems: { detalle: Detalle[]; producto: Productos[] }[] = [];
  subtotal: number;
  userCliente: Clientes;

  public payPalConfig?: IPayPalConfig;

  @Output() opened = new EventEmitter<boolean>();

  constructor(
    private _carroService: CarroService,
    private _authService: AuthService,
    private _facturaService: FacturacionCajaService,
    private _productoService: ProductoService,
    private modalService: NgbModal
  ) {
    this.items$ = this._carroService.retornarCarrito();
    this.subtotal$ = this._carroService.retornarSubtotal();
    // this.userCliente = this._authService.getUserCliente();
  }

  ngOnInit() {

    if (this._carroService.existsCart()) {
      this.items$ = this._carroService.retornarCarrito();
      this.subtotal$ = this._carroService.retornarSubtotal();
    }

    console.log('CarroComponent initialized');
    this.agregarLista();
    this.generarDetalles();

    this.initConfig();
    this.getCliente();
    // this._authService.setUserCliente();
    console.log('USER CLIENTE: ', this.userCliente);
    this.getCliente2();
  }

  
  agregarLista(): void {
    this.items$.subscribe((items) => {
      this.listaItems = items;
      console.log('ITEMS: ', this.listaItems);
    });
  }

  getCliente(): void {
    const user = this._authService.getUserCliente();
    
    if (user) {
        console.log('USER CLIENTE: ', user);
    } else {
        console.warn('No se pudo obtener el usuario cliente');
    }
  }

  getCliente2(): void {
    const user = this._authService.getCliente();
    if(user) {
      this.userCliente = user;
      console.log('USER CLIENTE 2: ', this.userCliente);
    } else {
      console.warn('No se pudo obtener el cliente');
    }
  }

  getSubtotalStorage(): void {
    this._carroService.getsubtotalStorage().subscribe((subtotal) => {
      this.subtotal = subtotal;
    });
  }

  restarCantidad(detalle: Detalle): void {
    this._carroService.restarCantidad(detalle);
  }

  sumarCantidad(detalle: Detalle): void {
    this._carroService.sumarCantidad(detalle);
  }

  eliminarDetalle(detalle: Detalle): void {
    this._carroService.eliminarItem(detalle);
  }

  cerrarCarro(): void {
    this.opened.emit(false);
    console.log('cerrarCarro');
    console.log(this.opened);
  }

  private initConfig(): void {
    this.getDataCheckOut().subscribe((data) => {
      let subtotal = Number(data.subtotal);
      let iva = subtotal * 0.15;
      let total = subtotal + iva;

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
                  value: total.toFixed(2),
                  breakdown: {
                    item_total: {
                      currency_code: 'USD',
                      value: subtotal.toFixed(2),
                    },
                    tax_total: {
                      currency_code: 'USD',
                      value: iva.toFixed(2),
                    },
                  },
                },
                items: (data.detalle || []).map((item: Detalle) => ({
                  name: item.producto.nombre,
                  quantity: item.cantidad.toString(),
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'USD',
                    value: item.precio.toFixed(2),
                  },
                })),
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
        onClientAuthorization: async (data) => {
          console.log(
            'onClientAuthorization - you should probably inform your server about completed transaction at this point',
            data
          );
          this.generarFacturaYDetalles();
          console.log('FACTURA Y DETALLES GENERADOS CORRECTAMENTE');
        },
        onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);
        },
        onError: (err) => {
          console.log('OnError', err);
        },
        onClick: (data, actions) => {
          console.log('onClick', data, actions);
        },
      };
    });
  }

  getDataCheckOut(): Observable<any> {
    console.log('DATA CHECKOUT: ', this.listaItems);
    console.log('SUBTOTAL: ', this.subtotal);

    let detalles = this._carroService.retornarCarrito().detalle;
    let productos = this._carroService.retornarCarrito().producto;
    let subtotal = this._carroService.retornarSubtotal();

    return subtotal.pipe(
      map((subtotalValue) => {
        const carrito = {
          detalles: detalles,
          productos: productos,
          subtotal: subtotalValue,
        };
        return carrito;
      })
    );
  }

  async generarFactura(): Promise<void> {
    let subtotal = await firstValueFrom(this.subtotal$);
    let iva = subtotal * 0.15;
    let total = subtotal + iva;

    let factura: Factura = new Factura(
      0,
      {
        id_cliente: this.userCliente.id_cliente,
        nombre: this.userCliente.nombre,
        primer_apellido: this.userCliente.primer_apellido,
      },
      '54656465465',
      new Date(),
      'EN LINEA',
      subtotal, // subtotal
      iva, // iva
      total // total
    );

    return new Promise<void>((resolve, reject) => {
      this._facturaService.generarFactura(factura).subscribe(
        (data) => {
          console.log('FACTURA GENERADA: ', data);
          resolve();
        },
        (error) => {
          console.error('Error al generar factura: ', error);
          reject(error);
        }
      );
    });
  }

  async generarDetalles(): Promise<void> {
    let detalles = this.listaItems.map((item) =>
      item.detalle.map((detalle) => detalle)
    );
    let idFactura = await this.getLastFactura();
    console.log('ID FACTURA: ', idFactura);

    detalles.forEach((detalle) => {
      detalle.forEach((detalle) => {
        this._facturaService
          .generarDetalle(
            new Detalle(
              {
                idProducto: detalle.producto.idProducto,
                nombre: detalle.producto.nombre || '',
              },
              detalle.precio,
              detalle.cantidad,
              detalle.total,
              { idFactura: idFactura }
            )
          )
          .subscribe(
            (data) => {
              console.log('DETALLE GENERADO: ', data);
              this._productoService
                .actualizarStock(data.producto.idProducto, data.cantidad)
                .subscribe((data) => {
                  console.log('Stock actualizado: ', data);
                });
            },
            (error) => {
              console.error('Error al generar detalle: ', error);
            }
          );
      });
    });
  }

  async getLastFactura(): Promise<number> {
    let id_cliente = this.userCliente.id_cliente;
    return new Promise<number>((resolve, reject) => {
      this._facturaService.getLastFactura(id_cliente).subscribe(
        (data) => {
          console.log('LAST FACTURA: ', data);
          resolve(data.idFactura);
        },
        (error) => {
          console.error('Error al obtener la última factura: ', error);
          reject(error);
        }
      );
    });
  }

  async generarFacturaYDetalles(): Promise<void> {
    try {
      await this.generarFactura();
      await this.generarDetalles();
      await this.generarFacturaPDF(this.getLastFactura());
      this._carroService.removerCarrito();
    } catch (error) {
      console.error('Error al generar factura y detalles: ', error);
    }
  }

  async generarFacturaPDF(idFactura: Promise<number>): Promise<void> {
    this._facturaService.downloadFacturaPDF(await idFactura).subscribe(
      (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'facturaPersonal.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        let destinatario = this.userCliente.correo;
        let asunto = "Factura de Productos";
        let mensaje = "Gracias por su compra";
        this._facturaService.enviarFacturaEmail(destinatario, asunto, mensaje, data).subscribe(
          (data) => {
            console.log('Correo enviado:', data);
          }
        );
      }
    );
  }

  openModal(listaItems:any, total:any){
    const modalRef = this.modalService.open(DetallesCompraComponent);
    modalRef.componentInstance.listaItems = listaItems;
    modalRef.componentInstance.total = total;
  }
}
