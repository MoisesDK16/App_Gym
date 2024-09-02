import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { ProductoResponse, Productos } from '../models/Productos';
import { Categorias, CategoriasResponse } from '../models/Categorias';
import { Detalle } from '../models/Detalle';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private url: string = 'api/productos';
  private urlCategorias: string = 'api/categorias';

  private myList: { detalle: Detalle[]; producto: Productos[] }[] = [];

  private carrito = new BehaviorSubject<{ detalle: Detalle[], producto: Productos[] }[]>(this.myList);

  constructor(private http: HttpClient) {}

  addToCarro(detalle: Detalle, producto: Productos) {

    const itemIndex = this.myList.findIndex((item) =>
      item.detalle.some((d) => d.producto.nombre === detalle.producto.nombre)
    );

    if (itemIndex > -1) {
      this.myList[itemIndex].detalle[0].cantidad += 1;
    } else {
      this.myList.push({
        detalle: [detalle.cantidad > 0 ? detalle : { ...detalle, cantidad: 1 } ],
        producto: [producto],
      });
    }

    this.carrito.next([...this.myList]);
  }

  sumarCantidad(detalle: Detalle) {
    const itemIndex = this.myList.findIndex((item) =>
      item.detalle.some((d) => d.producto.nombre === detalle.producto.nombre)
    );

    if (itemIndex > -1) {
      this.myList[itemIndex].detalle[0].cantidad +=1;
    }

    this.carrito.next([...this.myList]);
  }

  restarCantidad(detalle: Detalle) {
    const itemIndex = this.myList.findIndex((item) =>
      item.detalle.some((d) => d.producto.nombre === detalle.producto.nombre)
    );

    if (itemIndex > -1) {
      this.myList[itemIndex].detalle[0].cantidad -=1;
    }

    this.carrito.next([...this.myList]);
  }

  eliminarItem(detalle: Detalle) {
    const itemIndex = this.myList.findIndex((item) =>
      item.detalle.some((d) => d.producto.nombre === detalle.producto.nombre)
    );

    if (itemIndex > -1) {
      this.myList.splice(itemIndex, 1);
    }

    this.carrito.next([...this.myList]);
  }

  recogerItems(): Observable<{ detalle: Detalle[], producto: Productos[] }[]> {
      return this.carrito.asObservable();
  }

  getProductos(page: number, size: number): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      `${this.url}/all?page=${page}&size=${size}`
    );
  }

  registrarProducto(formData: FormData) {
    return this.http.post(`${this.url}/registrar`, formData);
  }

  actualizarProducto(idProducto: String, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.url}/actualizar/${idProducto}`, formData);
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
