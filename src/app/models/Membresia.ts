export interface MembresiaResponse {
  content: any[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export class Membresia {
  idMembresia: number;
  cliente: {
    id_cliente: string;
  };
  plan: {
    id_plan: number;
  };

  fechaInicio: Date;
  fechaFin: Date;
  dias_restantes?: number;
  estado?: string;

  constructor(
    idMembresia: number,
    cliente: { id_cliente: string },
    plan: { id_plan: number },
    fechaInicio: Date,
    fechaFin: Date,
    estado: string
  ) {
    this.idMembresia = idMembresia;
    this.cliente = cliente;
    this.plan = plan;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.estado = estado;
  }
}
