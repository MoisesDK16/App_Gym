export class Detalle {
  id_detalle?: number;
  producto: {
    idProducto: string;
    nombre?: string; 
  };
  factura: {
    idFactura: number;
  };
  membresia?: {
    id_membresia: number;
  };
  precio: number;
  cantidad: number;
  total: number;

  constructor(
    producto: { idProducto: string, nombre: string },
    precio: number,
    cantidad: number,
    total: number,
    factura: { idFactura: number },
    membresia?: { id_membresia: number }
  ) {
    this.producto = producto;
    this.factura = factura;
    this.precio = precio;
    this.cantidad = cantidad;
    this.total = total;
    this.membresia = membresia;
  }
}
