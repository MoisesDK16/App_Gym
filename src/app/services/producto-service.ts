import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductoResponse, Productos } from '../models/Productos';
import { Categorias, CategoriasResponse } from '../models/Categorias';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private url: string = 'api/productos';
  private urlCategorias: string = 'api/categorias';

  constructor(private http: HttpClient) {}

  getProductos(page: number, size: number): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      `${this.url}/all?page=${page}&size=${size}`
    );
  }

  registrarProducto(formData: FormData) {
    return this.http.post('http://localhost:8080/api/productos/registrar', formData);
  }

  actualizarProducto(producto: Productos): Observable<any> {
    return this.http.put<any>(
      `${this.url}/actualizar/${producto.idProducto}`,
      producto
    );
  }

  eliminarProducto(id_producto: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/eliminar/${id_producto}`);
  }

  unoProducto(id_producto: string): Observable<Productos> {
    return this.http.get<Productos>(`${this.url}/${id_producto}`);
  }

  listarCategorias(): Observable<CategoriasResponse[]> {
    return this.http.get<CategoriasResponse[]>(`${this.urlCategorias}/all`);
  }

  actualizarStock(id_producto: string, cantidad: number): Observable<any> {
    return this.http.post<any>(
      `${this.url}/actualizarStock/${id_producto}/${cantidad}`,
      {}
    );
  }
}
