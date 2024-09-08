export interface PlanResponse {
  content: Planes[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export class Planes {
  id_plan: number;
  nombre: string;
  descripcion: string;
  costo: number;
  duracion_dias: number;
  imagen: string;

  constructor(
    id_plan: number,
    nombre: string,
    descripcion: string,
    costo: number,
    duracion_dias: number,
    imagen: string
  ) {
    this.id_plan = id_plan;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.costo = costo;
    this.duracion_dias = duracion_dias;
    this.imagen = imagen;
  }
}
