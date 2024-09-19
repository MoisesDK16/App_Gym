import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Membresia, MembresiaResponse} from '../models/Membresia';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembresiaService {
  url: string = 'api/membresias';
  urlEmail: string = 'apiEmail';

  constructor(private http: HttpClient) {}

  registrar(membresia: Membresia): Observable<any> {
    return this.http.post<Membresia>(`${this.url}/registrar`, membresia);
  }

  uno(id: number): Observable<any> {
    return this.http.get<Membresia>(`${this.url}/uno/${id}`);
  }

  getMembresias(page:number, size:number): Observable<MembresiaResponse> {
    return this.http.get<MembresiaResponse>(`${this.url}/all?page=${page}&size=${size}`);
  }

  getMembresiasByCliente(idCliente: string): Observable<MembresiaResponse[]> {
    return this.http.get<MembresiaResponse[]>(`${this.url}/cliente/${idCliente}`);
  }

  getMembresiasByPrimerApellido(primerApellido: string): Observable<MembresiaResponse[]> {
    return this.http.get<MembresiaResponse[]>(`${this.url}/cliente/apellido/${primerApellido}`);
  }

  getMembresiasByPlanNombre(planNombre: string): Observable<MembresiaResponse[]> {
    return this.http.get<MembresiaResponse[]>(`${this.url}/plan/${planNombre}`);
  }

  getMembresiasByDiasRestantesAsc(): Observable<MembresiaResponse[]> {
    return this.http.get<MembresiaResponse[]>(`${this.url}/dias_restantes-asc`);
  }

  getMembresiasByEstado(estado: string): Observable<MembresiaResponse[]> {
    return this.http.get<MembresiaResponse[]>(`${this.url}/estado/${estado}`);
  }

  renovarMembresia(data:FormData, id:number): Observable<any> {
    return this.http.patch(`${this.url}/renovar/${id}`, data);
  }

  desactivarMembresias(): Observable<any> {
    return this.http.patch(`${this.url}/desactivar`, {});
  }

  getMemmbresiaByCliente(id_cliente: string): Observable<MembresiaResponse> {
    return this.http.get<MembresiaResponse>(`${this.url}/cliente/${id_cliente}`);
  }

  eliminarMembresia(id: number): Observable<any> {
    return this.http.delete(`${this.url}/eliminar/${id}`);
  }

  advertirMembresia(destinatario: string, asunto: string, mensaje: string, membresia: any): Observable<any> {
    const data = new FormData();
  
    const correoBlob = new Blob(
      [JSON.stringify({
        destinatario,
        asunto,
        mensaje
      })], { type: 'application/json' });
  
    const membresiaBlob = new Blob(
      [JSON.stringify(membresia)], { type: 'application/json' });
  
    // Añadir el correo como JSON
    data.append('campos', correoBlob);
  
    // Añadir la membresía como JSON
    data.append('membresia', membresiaBlob);
  
    return this.http.post(`${this.urlEmail}/advertencia-membresia`, data, {
      headers: {
        'Accept': 'application/json'
      }
    });
  }
  
}
