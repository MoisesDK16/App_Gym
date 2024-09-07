import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detalles-compra',
  templateUrl: './detalles-compra.component.html',
  styleUrl: './detalles-compra.component.css'
})
export class DetallesCompraComponent implements OnInit {

  @Input() public listaItems: any;
  @Input() public total: number;

  constructor( public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    console.log('DetallesCompraComponent initialized');
    console.log('Detalles:', this.listaItems);
  }

}
