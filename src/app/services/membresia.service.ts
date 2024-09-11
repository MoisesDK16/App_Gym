import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Membresia, MembresiaResponse} from '../models/Membresia';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembresiaService {
  url: string = 'api/membresias';

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


}
