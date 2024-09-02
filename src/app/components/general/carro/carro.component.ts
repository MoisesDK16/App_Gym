import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { ProductoService } from '../../../services/producto-service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { Detalle } from '../../../models/Detalle';
import { Productos } from '../../../models/Productos';


@Component({
  selector: 'app-carro',
  standalone: true,
  imports: [NgFor, AsyncPipe, NgIf],
  templateUrl: './carro.component.html',
  styleUrl: './carro.component.css',
})
export default class CarroComponent implements OnInit {
  items$: Observable<{ detalle: Detalle[]; producto: Productos[] }[]>;
  listaItems: { detalle: Detalle[]; producto: Productos[] }[];
  @Output() opened = new EventEmitter<boolean>();

  constructor(private _productoServices: ProductoService) {
    this.items$ = this._productoServices.recogerItems();
  }

  ngOnInit() {
    console.log('CarroComponent initialized');
    this.agregarLista();
  }

  agregarLista(): void {
    this.listaItems = [];
    this.items$.subscribe((items) => {
      this.listaItems = items;
      console.log(this.listaItems);
    });
  }

  eliminarDetalle(detalle: Detalle): void {
    this._productoServices.eliminarItem(detalle);
  }

  restarCantidad(detalle:Detalle): void {
    this._productoServices.restarCantidad(detalle);
  }

  sumarCantidad(detalle:Detalle): void {
    this._productoServices.sumarCantidad(detalle);
  }

  cerrarCarro(): void {
    this.opened.emit(false);
    console.log('cerrarCarro');
    console.log(this.opened);
  }
}
