import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  url: string = 'personal';

  constructor(private http: HttpClient) { }

  registrarPersonal(personal: Personal): Observable<Personal> {
    return this.http.post<Personal>(`${this.url}/registrar`, personal);
  }

  listarPersonal(): Observable<Personal> {
    return this.http.get<Personal>(`${this.url}/listar`);
  }

}
