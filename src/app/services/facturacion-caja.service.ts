import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Detalle } from '../models/Detalle';
import { Factura } from '../models/Factura';

@Injectable({
  providedIn: 'root',
})
export class FacturacionCajaService {
  urlFacturacion: string = 'api/facturas';
  urlDetalles: string = 'api/detalles';

  constructor(private http: HttpClient) {}

  generarFactura(factura: Factura): Observable<any> {
    return this.http.post<any>(`${this.urlFacturacion}/generar`, factura);
  }

  generarDetalle(detalle: Detalle): Observable<any> {
    return this.http.post<any>(`${this.urlDetalles}/generar`, detalle);
  }

  getLastFactura(id_cliente: string): Observable<Factura> {
    return this.http.get<Factura>(`${this.urlFacturacion}/last/${id_cliente}`);
  }
}
