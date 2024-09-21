import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Factura } from '../../../../models/Factura';
import { Detalle } from '../../../../models/Detalle';
import { FacturacionCajaService } from '../../../../services/facturacion-caja.service';

@Component({
  selector: 'app-facturas-productos',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe],
  templateUrl: './facturas-productos.component.html',
  styleUrl: './facturas-productos.component.css'
})
export class FacturasProductosComponent {

  facturas: Factura[] = [];
  detallesFactura: Detalle[] = [];
  estado: String = '';

  constructor(private _FacturaService: FacturacionCajaService) { }

  ngOnInit(): void {
    this.listarFacturas();
  }

  listarFacturas(): void {
    this._FacturaService.listarFacturasProductos().subscribe(
      (data) => {
        this.facturas = data;
        console.log(this.facturas);
      }
    );
  }

  listarDetallesFactura(idFactura: number): void {
    this._FacturaService.listarDetallesFactura(idFactura).subscribe(
      (data) => {
        this.detallesFactura = data;
        console.log(this.detallesFactura);
        this.openModal();
      }
    );
  }

  downloadFacturasPDF(): void {
    this._FacturaService.downloadFacturasPDF().subscribe(
      (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'facturas.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
    );
  }   

  downloadFacturaPDF(idFactura: number): void {
    this._FacturaService.downloadFacturaPDF(idFactura).subscribe(
      (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'facturaPersonal.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    );
  }
  

  openModal(): void {
    const modalDiv = document.getElementById('detailsModal');
    if (modalDiv != null) {
      modalDiv.classList.add('show');
      modalDiv.style.display = 'block';
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.classList.add('modal-backdrop', 'fade', 'show');
      document.body.appendChild(backdrop);
    }
  }

  closeModal(): void {
    const modalDiv = document.getElementById('detailsModal');
    if (modalDiv != null) {
      modalDiv.classList.remove('show');
      modalDiv.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    }
  }

}
