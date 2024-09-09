export class DetalleMembresia {
    id_detalle?: number;
    factura: {
      idFactura: number;
    };
    membresia: {
      idMembresia: number;
    };
    precio: number;
    cantidad: number;
    total: number;
  
    constructor(
      precio: number,
      cantidad: number,
      total: number,
      factura: { idFactura: number },
      membresia: { idMembresia: number }
    ) {
      this.factura = factura;
      this.membresia = membresia;
      this.precio = precio;
      this.cantidad = cantidad;
      this.total = total;
    }
  }
  