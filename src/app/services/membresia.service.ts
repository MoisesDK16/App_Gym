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

  listarMembresias(page:number, size:number): Observable<MembresiaResponse> {
    return this.http.get<MembresiaResponse>(`${this.url}/all?page=${page}&size=${size}`);
  }
}
