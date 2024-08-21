import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicios, ServiciosResponse } from '../models/Servicios';
import { Categorias } from '../models/Categorias';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  private url = 'api/servicios';
  private urlCategorias = 'api/categorias';

  constructor(private http: HttpClient) {}

  crearServicio(servicio: Servicios): Observable<any> {
    return this.http.post<any>(`${this.url}/crear`, servicio);
  }

  actualizarServicio(servicio: Servicios): Observable<any> {
    return this.http.post<any>(`${this.url}/actualizar`, servicio);
  }

  eliminarServicio(id_servicio: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/eliminar/${id_servicio}`);
  }

  listarServicios(page: number, size: number): Observable<ServiciosResponse> {
    return this.http.get<ServiciosResponse>(
      `${this.url}/all?page=${page}&size=${size}`
    );
  }

  unoServicio(id: number): Observable<Servicios> {
    return this.http.get<Servicios>(`${this.url}/uno/${id}`);
  }

  listarCategorias(): Observable<Categorias[]> {
    return this.http.get<Categorias[]>(`${this.urlCategorias}/all`);
  }
}
