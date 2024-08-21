
export interface ServiciosResponse {
  content: Servicios[];
  totalElements: number;
  totalPages: number;
  size: number;
}

export class Servicios {
  id_servicio?: number;
  categoria: {
    id_categoria: number;
    categoria: string;
  };
  nombre: string;
  precio: number;

  constructor(
    categoria: {id_categoria:number, categoria:string},
    nombre: string,
    precio: number
  ) {
    this.categoria = categoria;
    this.nombre = nombre;
    this.precio = precio;
  }
}
