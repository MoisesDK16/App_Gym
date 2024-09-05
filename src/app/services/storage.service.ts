import { Injectable } from '@angular/core';
import { Detalle } from '../models/Detalle';
import { Productos } from '../models/Productos';
import { ProductoService } from './producto-service';
import { BehaviorSubject, combineLatest, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // items$: Observable<{ detalle: Detalle[]; producto: Productos[] }[]>;
  // subtotal$: Observable<number>;
  // preFactura$: Observable<{ detalle: Detalle[]; producto: Productos[]; subtotal: number }>;

  // constructor(private _productoServices: ProductoService) {
  //   this.items$ = this._productoServices.recogerItems();
  //   this.subtotal$ = this._productoServices.recogerSubtotal();
  //   this.preFactura$ = this.recogerPreFactura();
  // }

  // recogerPreFactura(): Observable<{ detalle: Detalle[]; producto: Productos[]; subtotal: number }> {
  //   return combineLatest([this.items$, this.subtotal$]).pipe(
  //     map(([items, subtotal]) => {
  //       return {
  //         detalle: items.map(item => item.detalle).reduce((acc, val) => acc.concat(val), []),
  //         producto: items.map(item => item.producto).reduce((acc, val) => acc.concat(val), []),
  //         subtotal
  //       };
  //     })
  //   );
  // }

  // existsCart(): boolean {
  //   return localStorage.getItem('preFactura') != null;
  // }

  // setCart(preFactura: { detalle: Detalle[]; producto: Productos[]; subtotal: number }): void {
  //   localStorage.setItem('preFactura', JSON.stringify(preFactura));
  // }

  // getCart(): Observable<{ detalle: Detalle[]; producto: Productos[]; subtotal: number }> {
  //   const preFactura = localStorage.getItem('preFactura');
  //   return preFactura ? of(JSON.parse(preFactura)) : of(null);
  // }

  // clear(): void {
  //   localStorage.removeItem('preFactura');
  // }

}
