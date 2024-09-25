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
    return this.http.post<Membresia>(`${this.url}/me/registrar`, membresia);
  }

  uno(id: number): Observable<any> {
    return this.http.get<Membresia>(`${this.url}/me/uno/${id}`);
  }

  getMembresias(page:number, size:number): Observable<MembresiaResponse> {
    return this.http.get<MembresiaResponse>(`${this.url}/all?page=${page}&size=${size}`);
  }

  getMembresias2(): Observable<MembresiaResponse[]> {
    return this.http.get<MembresiaResponse[]>(`${this.url}/all2`);
  }

  getMembresiaByCliente(idCliente: string): Observable<MembresiaResponse[]> {
    return this.http.get<MembresiaResponse[]>(`${this.url}/me/cliente/${idCliente}`);
  }

  getMembresiasByPrimerApellido(primerApellido: string): Observable<MembresiaResponse[]> {
    return this.http.get<MembresiaResponse[]>(`${this.url}/cliente/apellido/${primerApellido}`);
  }

  getMembresiasByPlan_Estado(plan: string, estado: string): Observable<MembresiaResponse[]>{
    return this.http.get<MembresiaResponse[]>(`${this.url}/planYestado/${plan}/${estado}`);
  }

  getMembresiasByDiasRestantesAsc(): Observable<MembresiaResponse[]> {
    return this.http.get<MembresiaResponse[]>(`${this.url}/dias_restantes-asc`);
  }

  renovarMembresia(data:FormData, id:number): Observable<any> {
    return this.http.patch(`${this.url}/me/renovar/${id}`, data);
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
