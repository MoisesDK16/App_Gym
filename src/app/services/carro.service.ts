import { Injectable } from '@angular/core';
import { Productos } from '../models/Productos';
import { Detalle } from '../models/Detalle';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarroService {
  private myList: { detalle: Detalle[]; producto: Productos[] }[] = [];

  private carrito = new BehaviorSubject<
    { detalle: Detalle[]; producto: Productos[] }[]
  >(this.myList);

  private subtotal = new BehaviorSubject<number>(0);

  constructor() {
    this.myList = this.asignarCarritoALista().value;
    this.subtotal = new BehaviorSubject<number>(this.asignarSubtotalALista());
  }

  addToCarro(detalle: Detalle, producto: Productos) {
    const itemIndex = this.myList.findIndex((item) =>
      item.detalle.some((d) => d.producto.nombre === detalle.producto.nombre)
    );

    if (itemIndex > -1) {
      this.myList.forEach((item) => {
        if (item.detalle[0].cantidad >= item.producto[0].stock) {
          item.detalle[0].cantidad = item.producto[0].stock;
          item.detalle[0].total = item.detalle[0].cantidad * item.producto[0].precioVenta;
          return;
        } else {
          this.myList[itemIndex].detalle[0].cantidad += 1;
          this.myList[itemIndex].detalle[0].total += this.myList[itemIndex].producto[0].precioVenta;
          this.subtotal.next(
            this.subtotal.value + this.myList[itemIndex].producto[0].precioVenta
          );
        }
      });
    } else {
      this.myList.push({
        detalle: [
          detalle.cantidad > 0
            ? detalle
            : { ...detalle, cantidad: 1, total: producto.precioVenta },
        ],
        producto: [producto],
      });
      const newIndex = this.myList.length - 1;
      this.subtotal.next(
        this.subtotal.value + this.myList[newIndex].producto[0].precioVenta
      );
    }

    this.carrito.next([...this.myList]);
    this.guardarCarrito();
  }

  sumarCantidad(detalle: Detalle) {
    const itemIndex = this.myList.findIndex((item) =>
      item.detalle.some((d) => d.producto.nombre === detalle.producto.nombre)
    );

    if (itemIndex > -1) {
      this.myList.forEach((item) => {
        if (
          item.detalle[0].cantidad >= item.producto[0].stock
        ) {
          console.log('Stock insuficiente');
          console.log('Stock Producto: ', item.producto[0].stock);
          item.detalle[0].cantidad = item.producto[0].stock;
          item.detalle[0].total = item.detalle[0].cantidad * item.producto[0].precioVenta;
          return;
          
        } else {
          this.myList[itemIndex].detalle[0].cantidad += 1;
          this.myList[itemIndex].detalle[0].total += this.myList[itemIndex].producto[0].precioVenta;
          this.subtotal.next(this.subtotal.value + this.myList[itemIndex].producto[0].precioVenta);
        }
      });
    }

    this.carrito.next([...this.myList]);
    this.guardarCarrito();
  }

  restarCantidad(detalle: Detalle) {
    const itemIndex = this.myList.findIndex((item) =>
      item.detalle.some((d) => d.producto.nombre === detalle.producto.nombre)
    );

    if (itemIndex > -1) {
      this.myList[itemIndex].detalle[0].cantidad -= 1;
      this.myList[itemIndex].detalle[0].total -=
        this.myList[itemIndex].producto[0].precioVenta;

      if (this.myList[itemIndex].detalle[0].cantidad === 0) {
        this.subtotal.next(
          this.subtotal.value - this.myList[itemIndex].producto[0].precioVenta
        );
        this.myList.splice(itemIndex, 1);
      } else {
        this.subtotal.next(
          this.subtotal.value - this.myList[itemIndex].producto[0].precioVenta
        );
      }
    }

    this.carrito.next([...this.myList]);
    this.guardarCarrito();
  }

  eliminarItem(detalle: Detalle) {
    const itemIndex = this.myList.findIndex((item) =>
      item.detalle.some((d) => d.producto.nombre === detalle.producto.nombre)
    );

    if (itemIndex > -1) {
      this.subtotal.next(
        this.subtotal.value -
          this.myList[itemIndex].detalle[0].cantidad *
            this.myList[itemIndex].producto[0].precioVenta
      );
      this.myList.splice(itemIndex, 1);
    }

    this.carrito.next([...this.myList]);
    this.guardarCarrito();
  }

  removerCarrito(): void {
    this.myList = [];
    this.carrito.next([...this.myList]);
    this.subtotal.next(0);
    this.guardarCarrito();
  }

  guardarCarrito(): void {
    localStorage.setItem('preFactura', JSON.stringify(this.carrito.value));
    localStorage.setItem('subtotal', JSON.stringify(this.subtotal.value));
  }

  asignarCarritoALista(): any {
    const preFactura = localStorage.getItem('preFactura');
    this.myList = preFactura ? JSON.parse(preFactura) : [];
    this.carrito.next(this.myList);
    return preFactura
      ? new BehaviorSubject<{ detalle: Detalle[]; producto: Productos[] }[]>(
          this.myList
        )
      : this.carrito;
  }

  retornarCarrito(): any {
    return this.carrito.asObservable();
  }

  asignarSubtotalALista(): number {
    const subtotal = localStorage.getItem('subtotal');
    return subtotal ? JSON.parse(subtotal) : 0;
  }

  retornarSubtotal(): Observable<number> {
    return this.subtotal.asObservable();
  }

  existsCart(): boolean {
    return localStorage.getItem('preFactura') != null;
  }

  setCart(preFactura: {
    detalle: Detalle[];
    producto: Productos[];
    subtotal: number;
  }): void {
    localStorage.setItem('preFactura', JSON.stringify(preFactura));
  }

  getCart(): Observable<{
    detalle: Detalle[];
    producto: Productos[];
    subtotal: number;
  }> {
    const preFactura = localStorage.getItem('preFactura');
    return preFactura ? of(JSON.parse(preFactura)) : of(null);
  }

  getsubtotalStorage(): Observable<number> {
    const subtotal = localStorage.getItem('subtotal');
    return subtotal ? of(JSON.parse(subtotal)) : of(0);
  }

  clear(): void {
    localStorage.removeItem('preFactura');
  }
}
