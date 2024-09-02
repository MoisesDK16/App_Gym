export interface ProductoResponse {
  content: Productos[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export class Productos {
  idProducto: string;
  nombre: string;
  categoria: {
    id_categoria: number,
    categoria: string
  };
  stock: number;
  precioCompra: number;
  margenGanancia: number;
  precioVenta: number;
  fecha_caducacion: Date;
  descripcion: string;
  imagen: string
  
  constructor(
    idProducto: string,
    nombre: string,
    categoria: { id_categoria: number, categoria: string },
    stock: number,
    precioCompra: number,
    margenGanancia: number,
    precioVenta: number,
    fecha_caducacion: Date,
    descripcion: string,
    imagen: string
  ) {
    this.idProducto = idProducto;
    this.nombre = nombre;
    this.categoria = categoria;
    this.stock = stock;
    this.precioCompra = precioCompra;
    this.margenGanancia = margenGanancia;
    this.precioVenta = precioVenta;
    this.fecha_caducacion = fecha_caducacion;
    this.descripcion = descripcion;
    this.imagen = imagen;
  }
}
