import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Detalle } from '../models/Detalle';
import { Factura } from '../models/Factura';

@Injectable({
  providedIn: 'root',
})
export class FacturacionCajaService {
  urlFacturacion: string = 'api/facturas';
  urlDetalles: string = 'api/detalles';
  urlEnvioCorreo: string = 'apiEmail';

  constructor(private http: HttpClient) {}

  generarFactura(factura: Factura): Observable<any> {
    return this.http.post<any>(`${this.urlFacturacion}/generar`, factura);
  }

  generarDetalle(detalle: any): Observable<any> {
    return this.http.post<any>(`${this.urlDetalles}/generar`, detalle);
  }

  generarDetalleMembresia(detalle: any): Observable<any> {
    return this.http.post<any>(`${this.urlDetalles}/generar-detalle-membresia`, detalle);
  }

  getLastFactura(id_cliente: string): Observable<Factura> {
    return this.http.get<Factura>(`${this.urlFacturacion}/last/${id_cliente}`);
  }

  listarFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.urlFacturacion}/all`);
  }

  downloadFacturasPDF(): Observable<Blob> {
    return this.http.get(`${this.urlFacturacion}/all?format=pdf`, {
      responseType: 'blob'
    });
  }
  
  listarDetallesFactura(idFactura: number): Observable<Detalle[]> {
    return this.http.get<Detalle[]>(`${this.urlDetalles}/listar/${idFactura}`);
  }

  downloadFacturaPDF(idFactura: number): Observable<Blob> {
    return this.http.get(`${this.urlFacturacion}/DownloadPdf/${idFactura}`, {
      responseType: 'blob'
    });
  }

  downloadFacturaMembresiaPDF(idFactura: number): Observable<Blob> {
    return this.http.get(`${this.urlFacturacion}/Download-MembresiaPdf/${idFactura}`, {
      responseType: 'blob'
    });
  }
  
   enviarFacturaEmail(destinatario: string, asunto: string, mensaje: string, factura: Blob): Observable<any> {
    const formData = new FormData();
    
    const correoBlob = new Blob([JSON.stringify({
      destinatario,
      asunto,
      mensaje
    })], { type: 'application/json' });

    formData.append('campos', correoBlob);
    formData.append('archivo', factura, 'factura.pdf');

    return this.http.post<any>(`${this.urlEnvioCorreo}/enviar-correo`, formData);
  }


  /***FILTROS******/

  //Membresias
  listarFacturasMembresia(): Observable<any[]> {
    return this.http.get<Factura[]>(`${this.urlFacturacion}/all-membresia`);
  }

  getAllMembresiaByFecha(fechaInicio: string, fechaFin:string, metodoPago:string): Observable<any[]> {
    return this.http.get<Factura[]>(`${this.urlFacturacion}/all-membresia/by-fecha/${fechaInicio}/${fechaFin}/${metodoPago}`);
  }

  getAllMembresiaByClienteId(id_cliente: string): Observable<any[]> {
    return this.http.get<Factura[]>(`${this.urlFacturacion}/all-membresia/by-cliente/${id_cliente}`);
  }

  getAllMembresiaByClienteCompleto(nombreApellido:string){
    return this.http.get<Factura[]>(`${this.urlFacturacion}/all-membresia/by-nombre-apellido/${nombreApellido}`);
  }


  //Productos
  listarFacturasProductos(): Observable<any[]> {
    return this.http.get<Factura[]>(`${this.urlFacturacion}/all-productos`);
  }

  getAllProductosByFecha(fechaInicio: string, fechaFin:string, metodoPago:string): Observable<any[]> {
    return this.http.get<Factura[]>(`${this.urlFacturacion}/all-productos/by-fecha/${fechaInicio}/${fechaFin}/${metodoPago}`);
  }

  getAllProductosByClienteId(id_cliente: string): Observable<any[]> {
    return this.http.get<Factura[]>(`${this.urlFacturacion}/all-productos/by-cliente/${id_cliente}`);
  }

  getAllProductosByClienteCompleto(nombreApellido:string){
    return this.http.get<Factura[]>(`${this.urlFacturacion}/all-productos/by-nombre-apellido/${nombreApellido}`);
  }

}
