export class Factura {
  id_factura?: number;
  usuario?: {
    id_usuario: number;
    nombre: string; 
  };
  cliente: {
    id_cliente: string;
  };
  fecha_emision: Date;
  metodo_pago: string;
  subtotal: number;
  iva: number;
  total: number;

  constructor(
    cliente: { id_cliente: string},
    fecha_emision: Date,
    metodo_pago: string,
    subtotal: number,
    iva: number,
    total: number,
    usuario?: { id_usuario: number, nombre: string }
  ) {
    this.cliente = cliente;
    this.fecha_emision = fecha_emision;
    this.metodo_pago = metodo_pago;
    this.subtotal = subtotal;
    this.iva = iva;
    this.total = total;
    this.usuario = usuario;
  }
}
