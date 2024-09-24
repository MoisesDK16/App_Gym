import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { ClienteResponse, Clientes} from '../models/Clientes';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  url: string = "api/clientes";

  constructor(private  http: HttpClient) { }

  // Ahora el método recibe page y size como parámetros
  getClientes(page: number, size: number): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${this.url}/all?page=${page}&size=${size}`);
  }

  registrarCliente(cliente: Clientes): Observable<any> {
    return this.http.post<any>(`${this.url}me/registrar`, cliente);
  }

  actualizarCliente(cliente: Clientes): Observable<any> {
    return this.http.put<any>(`${this.url}me/actualizar/${cliente.id_cliente}`,cliente);
  }

  eliminarCliente(id_cliente: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/eliminar/${id_cliente}`);
  }

  unoCliente(id_cliente: string): Observable<any> {
    return this.http.get<any>(`${this.url}/me/${id_cliente}`);
  }

  unoClienteCorreo(correo: string): Observable<any> {
    return this.http.get<any>(`${this.url}/me/correo/${correo}`);
  }

}
  

