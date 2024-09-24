import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { ProductoResponse, Productos } from '../models/Productos';
import { CategoriasResponse } from '../models/Categorias';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private url: string = 'api/productos';
  private urlCategorias: string = 'api/categorias';

  constructor(private http: HttpClient) {

  }
  
  getProductos(page: number, size: number): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      `${this.url}/me/all?page=${page}&size=${size}`
    );
  }

  registrarProducto(formData: FormData) {
    return this.http.post(`${this.url}/registrar`, formData);
  }

  actualizarProducto(idProducto: String, formData: FormData): Observable<any> {
    return this.http.patch<any>(`${this.url}/actualizar/${idProducto}`, formData);
  }

  actualizarProductoImagen(idProducto: String, formData: FormData): Observable<any> {
    return this.http.patch<any>(`${this.url}/actualizarImagen/${idProducto}`, formData);
  }

  eliminarProducto(id_producto: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/eliminar/${id_producto}`);
  }

  unoProducto(id_producto: string): Observable<Productos> {
    return this.http.get<Productos>(`${this.url}/me/${id_producto}`);
  }

  listarCategorias(): Observable<CategoriasResponse[]> {
    return this.http.get<CategoriasResponse[]>(`${this.urlCategorias}/all`);
  }

  buscarXNombre(nombre: string): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(`${this.url}/nombre/${nombre}`);
  }

  buscarXCategoria(id_categoria: number): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(`${this.url}/categoria/${id_categoria}`);
  }

  buscarXStock(stock: number): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(`${this.url}/stock/${stock}`);
  }

  buscarXFechaCaducacion(fechaInicio: string, fechaFin:string): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(`${this.url}/fecha_caducacion/${fechaInicio}/${fechaFin}`);
  }

  actualizarStock(id_producto: string, cantidad: number): Observable<any> {
    return this.http.post<any>(
      `${this.url}/actualizarStock/${id_producto}/${cantidad}`,
      {}
    );
  }
}
