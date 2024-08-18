export class Factura {
  idFactura: number;
  usuario?: {
    id_usuario: number;
    nombre: string; 
  };
  cliente: {
    id_cliente: string;
  };
  ruc: string;
  fechaEmision: Date;
  metodoPago: string;
  subtotal: number;
  iva: number;
  total: number;

  constructor(
    idFactura: number,
    cliente: { id_cliente: string },
    ruc: string,
    fechaEmision: Date,
    metodoPago: string,
    subtotal: number,
    iva: number,
    total: number,
    usuario?: { id_usuario: number, nombre: string }
  ) {
    this.idFactura = idFactura;
    this.cliente = cliente;
    this.ruc = ruc;
    this.fechaEmision = fechaEmision;
    this.metodoPago = metodoPago;
    this.subtotal = subtotal;
    this.iva = iva;
    this.total = total;
    this.usuario = usuario;
  }
}
