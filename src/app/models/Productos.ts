export interface ProductoResponse {
  content: Productos[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export class Productos {
  id_producto: string;
  nombre: string;
  categoria: {
    id_categoria: string,
    categoria: string
  };
  stock: number;
  precio_compra: number;
  margen_ganancia: number;
  precio_venta: number;
  fecha_caducacion: Date;
  descripcion: string;
  imagen: string
  
  constructor(
    id_producto: string,
    nombre: string,
    categoria: { id_categoria: string, categoria: string },
    stock: number,
    precio_compra: number,
    margen_ganancia: number,
    precio_venta: number,
    fecha_caducacion: Date,
    descripcion: string,
    imagen: string
  ) {
    this.id_producto = id_producto;
    this.nombre = nombre;
    this.categoria = categoria;
    this.stock = stock;
    this.precio_compra = precio_compra;
    this.margen_ganancia = margen_ganancia;
    this.precio_venta = precio_venta;
    this.fecha_caducacion = fecha_caducacion;
    this.descripcion = descripcion;
    this.imagen = imagen;
  }
}
